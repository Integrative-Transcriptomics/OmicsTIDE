from flask import Flask, jsonify, render_template, request, session, redirect, url_for, send_from_directory, send_file, Response
from jinja2 import Template
from werkzeug.utils import secure_filename
import csv
import pandas as pd
import numpy as np
import json
import sys
import copy
import os
import tempfile
#import svgutils
from sklearn.cluster import KMeans
from scipy import stats
from itertools import combinations
from Bio import SeqIO, Entrez
from enum import Enum
from pathlib import Path
#import cairosvg
from zipfile import ZipFile
from datetime import datetime
from enums import Ptcf_file, ComparisonType
from app import app, files
from preprocess_files import preprocess_file, remove_invalid_genes
from data_quality_assurance import valid_cluster_header, valid_cluster_values, invalid_cluster_value_pos, has_equal_number_of_timepoints, equal_number_of_columns
from trend_comparison import pairwise_trendcomparison, get_info
from ptcf import get_non_intersecting_ptcf_from_ptcf, get_intersecting_ptcf_from_ptcf, add_additional_columns, ptcf_to_json


#if not os.path.exists(os.path.join('.', 'tmp_files_OmicsTIDE')):

# MAY HAVE TO BE CHANGED ON TUEVIS DUE TO PERMISSIONS (-> "tempfile.TemporaryDirectory(dir="/tmp")
# MAKE SURE tempfile PACKAGE IS INSTALLED ON
tempdir = tempfile.TemporaryDirectory(dir=".")

app.config['UPLOAD_FOLDER'] = tempdir.name
app.config['FILES_BLOODCELLS'] = os.path.join('.', 'static', 'data', 'BloodCell')
app.config['FILES_STREPTOMYCES'] = os.path.join('.', 'static', 'data', 'caseStudy_colnames')


def get_k_from_ptcf(data):
	"""extracts k parameter from the data

	:param data: data frame 

	:return: number of trends/clusters determined
	"""

	ds1_cluster = data['ds1_cluster'].dropna().unique()
	ds2_cluster = data['ds2_cluster'].dropna().unique()

	ds1_cluster_number_only = [x.split("_")[1] for x in ds1_cluster]
	ds2_cluster_number_only = [x.split("_")[1] for x in ds2_cluster]

	return len(list(set(ds1_cluster_number_only + ds2_cluster_number_only)))


def load_and_modify(file, filename):
	"""wrapper function to read and modify PTCF file for transfer to client

	:param file: ptcf file
	:param filename: file name of load ptcf file

	:return: modified data used to transfer form server to client
	"""

	init = None

	try:
		init = pd.read_csv(file, index_col='gene', sep= ",")
	
	except ValueError as ve:
		if (str(ve) == "Index gene invalid"):

			try:
				init = pd.read_csv(file, index_col='gene', sep= "\t")

			except:
				return jsonify(message = "Error: Values in " + file + " neither comma- nor tab-separated!"),500

		else:
			return jsonify(message = "Error: Values in " + file + " neither comma- nor tab-separated!"),500

			
	if not valid_cluster_header("ds1_cluster", init):
		return jsonify(message = "column named 'ds1_cluster' not found"),500

	if not valid_cluster_header("ds2_cluster", init):
		return jsonify(message = "column named 'ds2_cluster' not found"),500

	if not valid_cluster_values("ds1_cluster", init):
		return jsonify(message = "Values in ds1_cluster column should be one of:\n ds1_1, ds1_2, ds1_3, ds1_4, ds1_5, ds1_6 at\n" + 
		str(invalid_cluster_value_pos("ds1_cluster", init))),500

	if not valid_cluster_values("ds2_cluster", init):
		return jsonify(message = "Values in ds1_cluster column should be one of:\n ds2_1, ds2_2, ds2_3, ds2_4, ds2_5, ds2_6 at\n" + 
		str(invalid_cluster_value_pos("ds2_cluster", init))),500

	if not has_equal_number_of_timepoints(init):
		#raise Exception("number of conditions/time points in ds1 and ds2 has to be identical")
		return jsonify(message = "number of conditions/time points in data set 1 and data set 2 has to be identical"),500

	k = get_k_from_ptcf(init)

	init = remove_invalid_genes(init)

	ptcf = add_additional_columns(init)

	i_ptcf = get_intersecting_ptcf_from_ptcf(ptcf)
	ni_ptcf = get_non_intersecting_ptcf_from_ptcf(ptcf)

	intersecting_genes = ptcf_to_json(i_ptcf, True)
	non_intersecting_genes = ptcf_to_json(ni_ptcf, False)

	data = {}

	info = get_info("file_1", "file_2", filename, filename, i_ptcf, ni_ptcf)

	intersecting_genes['info'] = info
	non_intersecting_genes['info'] = info

	data['Comparison1'] = {
		'intersecting' : intersecting_genes,
		'nonIntersecting' : non_intersecting_genes,
		'info' : info,
		'k' : k,
	}

	return data


def get_median_values(data,ds):
	"""extracts median abundance values

	:param data: PTCF
	:param ds: data set identifier (ds1 or ds1)

	:return: median values of given data set 
	"""

	values = data[[x for x in list(data) if x.startswith(ds) & (x!="ds1_cluster") & (x!="ds2_cluster") & (x!="gene")]]

	return values.median(axis=1)


def get_var_values(data,ds):
	"""extracts gene variance values

	:param data: PTCF
	:param ds: data set identifier (ds1 or ds1)

	:return: gene variance values of given data set 
	"""

	values = data[[x for x in list(data) if x.startswith(ds) & (x!="ds1_cluster") & (x!="ds2_cluster") & (x!="gene")]]

	return values.var(axis=1)


def remove_tmp_files():
	"""removes tmp files folder with all its content (loaded files etc)
	"""

	filelist = os.listdir(app.config['UPLOAD_FOLDER'])

	for f in filelist:
		os.remove(os.path.join(app.config['UPLOAD_FOLDER'], f))


##############
### ROUTES ###
##############

@app.route('/load_k', methods=['GET', 'POST'])
def load_k():
	if request.method == 'POST':
		data = {}

		k = int(request.form.to_dict()['k'])
		lower_variance_percentile = int(request.form.to_dict()['lowerVariancePercentage'])
		upper_variance_percentile = int(request.form.to_dict()['upperVariancePercentage'])

		comparison_count = 1

		# outsource this to function #
		for combination in list(combinations(list(files.keys()), 2)):

			tmp_file1 = str(combination[0])
			tmp_file2 = str(combination[1])

			# get file without NA
			try:

				data["Comparison" + str(comparison_count)] = pairwise_trendcomparison(tmp_file1, tmp_file2, comparison_count, lower_variance_percentile, upper_variance_percentile, k, False)
				comparison_count += 1
	
			except TypeError as te:
				if str(te) == "object of type 'builtin_function_or_method' has no len()":
					return jsonify(message='ID column has to be named "gene"'),500

			except ValueError as ve:
				if str(ve).startswith("Length mismatch: Expected axis has"):
					return jsonify(message='Number of columns/conditions for the loaded files not identical!'),500

		return data

	else:
		return render_template('index.html')


@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template('index.html')


@app.route('/cluster_data', methods=['GET','POST'])
def cluster_data():

	if request.method == 'POST':

		counter = 1

		remove_tmp_files()
		
		files.clear()

		# save files 		
		for file in request.files.getlist("files[]")[0:5]:

			tmp_file = file
			tmp_filename = secure_filename(tmp_file.filename)
			tmp_file.save(os.path.join(app.config['UPLOAD_FOLDER'], tmp_filename))

			files['file' + "_" + str(counter)] = tmp_filename
			
			counter += 1

		return "clustered"

	else:

		return render_template('index.html')


@app.route('/load_test_data_bloodcell' , methods=['GET','POST'])
def load_test_data_bloodcell():

	data = {}

	if request.method == 'POST':

		k = int(request.form.to_dict()['k'])
		lower_variance_percentile = int(request.form.to_dict()['lowerVariancePercentage'])
		upper_variance_percentile = int(request.form.to_dict()['upperVariancePercentage'])

		transcriptome_data = os.path.join(app.config['FILES_BLOODCELLS'], "Transcriptome.csv")
		proteome_data = os.path.join(app.config['FILES_BLOODCELLS'], "Proteome.csv")

		try:
			data['Comparison1'] = pairwise_trendcomparison(transcriptome_data, proteome_data, 1, lower_variance_percentile, upper_variance_percentile, k, True)
	
		except TypeError as te:
			if str(te) == "object of type 'builtin_function_or_method' has no len()":
				return jsonify(message='ID column has to be named "gene"'),500

		except ValueError as ve:
			if str(ve).startswith("Length mismatch: Expected axis has"):
				return jsonify(message='Number of columns/conditions for the loaded files not identical!'),500

		return data

	else:
		render_template("index.html")


@app.route('/load_test_data_streptomyces' , methods=['GET','POST'])
def load_test_data_streptomyces():

	data = {}

	if request.method == 'POST':

		k = int(request.form.to_dict()['k'])
		lower_variance_percentile = int(request.form.to_dict()['lowerVariancePercentage'])
		upper_variance_percentile = int(request.form.to_dict()['upperVariancePercentage'])

		trans_m145 = os.path.join(app.config['FILES_STREPTOMYCES'], "Transcriptome_M145.csv")
		trans_m1152 = os.path.join(app.config['FILES_STREPTOMYCES'], "Transcriptome_M1152.csv")
		prot_m1152 = os.path.join(app.config['FILES_STREPTOMYCES'], "Proteome_M1152.csv")

		try:
			data['Comparison1'] = pairwise_trendcomparison(trans_m1152, trans_m145, 1, lower_variance_percentile, upper_variance_percentile, k, True)
			data['Comparison2'] = pairwise_trendcomparison(trans_m1152, prot_m1152, 2, lower_variance_percentile, upper_variance_percentile, k, True)
	
		except TypeError as te:
			if str(te) == "object of type 'builtin_function_or_method' has no len()":
				return jsonify(message='ID column has to be named "gene"'),500

		except ValueError as ve:
			if str(ve).startswith("Length mismatch: Expected axis has"):
				return jsonify(message='Number of columns/conditions for the loaded files not identical!'),500

		return data

	else:
		render_template("index.html")
				

@app.route('/matrix')
def data():
	return render_template('overview.html')


@app.route('/intersecting')
def intersecting():
	return render_template('first-level-intersecting.html')


@app.route('/nonIntersecting')
def non_intersecting():
	return render_template('first-level-non-intersecting.html')


@app.route('/selectionIntersecting')
def selection_intersecting():
	return render_template('second-level-intersecting.html')


@app.route('/selectionNonIntersecting')
def selection_non_intersecting():
	return render_template('second-level-non-intersecting.html')


@app.route('/download_session', methods=['GET', 'POST'])
def download_session():
	if request.method == 'POST':
		path_session = os.path.join(app.config['UPLOAD_FOLDER'], 'download_session.csv')
		
		ptcf_session = pd.read_json(request.form.to_dict()['ptcf'], orient='records')
		ptcf_session.set_index('gene', inplace=True)
		ptcf_session.to_csv(path_session)

		time_id = str(datetime.now())
		time_id = time_id.replace(" ", "_")
		time_id = time_id.replace(":", "_")
		time_id = time_id.split(".")[0]
		time_id = time_id.replace("_","")

		timestamp_name = "OmicsTIDE_" + time_id

		return send_file(path_session,
                     mimetype='text/csv',
                     attachment_filename=timestamp_name + ".csv",
                     as_attachment=True)
	

@app.route('/send_svg', methods=['GET', 'POST'])
def send_svg():
	if request.method == 'POST':

		path1 = os.path.join(app.config['UPLOAD_FOLDER'], 'dataset1.svg')
		path2 = os.path.join(app.config['UPLOAD_FOLDER'], 'dataset2.svg')
		path_selection = os.path.join(app.config['UPLOAD_FOLDER'], 'selection.csv')
		path_go = os.path.join(app.config['UPLOAD_FOLDER'], 'go.csv')

		dataset1 = json.loads(request.form.to_dict()['dataset1_plot'])
		dataset2 = json.loads(request.form.to_dict()['dataset2_plot'])
		selection = pd.read_json(request.form.to_dict()['selection'], orient='records')
		selection.set_index('gene', inplace=True)


		try: 

			mol_func = pd.read_json(request.form.to_dict()['molecularFunction'], orient='records')
			bio_proc = pd.read_json(request.form.to_dict()['biologicalProcess'], orient='records')
			cell_comp = pd.read_json(request.form.to_dict()['cellularComponent'], orient='records')

			mol_func['main_category'] = ['molecularFunction'] * len(mol_func.index)
			bio_proc['main_category'] = ['biologicalProcess'] * len(bio_proc.index)
			cell_comp['main_category'] = ['cellularComponent'] * len(cell_comp.index)

			mol_func = mol_func[pd.notnull(mol_func['id'])]
			bio_proc = bio_proc[pd.notnull(bio_proc['id'])]
			cell_comp = cell_comp[pd.notnull(cell_comp['id'])]

			mol_func.sort_values(by = 'FDR', inplace=True)
			bio_proc.sort_values(by = 'FDR', inplace=True)
			cell_comp.sort_values(by = 'FDR', inplace=True)

			go = pd.concat([mol_func, bio_proc])
			go = pd.concat([go, cell_comp])
			go.drop(columns=['term'], inplace=True)

		except:
			print("no go found")

		selection.drop(columns=['highlighted', 'profile_selected', 'ds1_median', 'ds2_median'], inplace=True)

		svg_1 = open(path1, "a")
		svg_1.write(dataset1)
		svg_1.close()

		svg_2 = open(path2, "a")
		svg_2.write(dataset2)
		svg_2.close()

		selection.to_csv(path_selection)

		try:
			go.to_csv(path_go)

		except:
			print("no go found")

		time_id = str(datetime.now())
		time_id = time_id.replace(" ", "_")
		time_id = time_id.replace(":", "_")
		time_id = time_id.split(".")[0]

		zipObj = ZipFile(os.path.join(app.config['UPLOAD_FOLDER'], "OmicsTIDE_" + str(time_id)), 'w')

		zipObj.write(path1)
		zipObj.write(path2)
		zipObj.write(path_selection)

		try:
			zipObj.write(path_go)

		except:
			print("no go found")

		zipObj.close()

		timestamp_name = "OmicsTIDE_" + time_id

		return send_from_directory(app.config['UPLOAD_FOLDER'], timestamp_name, as_attachment=True)


@app.route('/upload', methods=['GET','POST'])
def uploaded_file():
	if request.method == 'POST':

		remove_tmp_files()
		
		files.clear()

		if len(list(request.files.to_dict().keys())) > 0:

			file = request.files['form_clustered']
			filename = secure_filename(file.filename)

			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			server_data = load_and_modify(os.path.join(app.config['UPLOAD_FOLDER'], filename), filename)

			return server_data

		else:
			return render_template('index.html')



if __name__ == '__main__':
	app.run(debug=False)







# def get_info(file1, file2, filename1, filename2, i_ptcf, ni_ptcf):

# 	info = {}

# 	conc_disc = concordant_discordant(i_ptcf, "ds1_cluster", "ds2_cluster")

# 	genes_in_comparison = len(i_ptcf.index) + len(ni_ptcf.index)

# 	path_file1, filename_file1 = os.path.split(filename1)
# 	path_file2, filename_file2 = os.path.split(filename2)

# 	info['file_1'] = { 'filename' : filename_file1 }
# 	info['file_2'] = { 'filename' : filename_file2 }
# 	info['file_1']['genes'] = list(ni_ptcf[~ni_ptcf['ds1_cluster'].isna()].index) + list(i_ptcf.index)
# 	info['file_2']['genes'] = list(ni_ptcf[~ni_ptcf['ds2_cluster'].isna()].index) + list(i_ptcf.index)
# 	info['file_1_only'] = {'genes' : list(ni_ptcf[~ni_ptcf['ds1_cluster'].isna()].index)}
# 	info['file_2_only'] = {'genes' : list(ni_ptcf[~ni_ptcf['ds2_cluster'].isna()].index)}
# 	info['intersecting_genes'] = {'genes' : len(i_ptcf.index)}
# 	info['barChart'] = {
# 		'allGenesInComparison' : genes_in_comparison,
# 		'absolute' : {
# 			'concordant_count' : conc_disc['concordant'], 
# 			'discordant_count' : conc_disc['discordant'],
# 			'intersecting_genes_count' : len(i_ptcf.index),
# 			'non_intersecting_genes_count' : len(ni_ptcf.index),
# 			'first_non_intersecting_genes_count' : len(ni_ptcf[~ni_ptcf['ds1_cluster'].isna()].index),
# 			'second_non_intersecting_genes_count' : len(ni_ptcf[~ni_ptcf['ds2_cluster'].isna()].index)
# 		}	
# 	}

# 	return info

# def get_intersecting_ptcf_from_ptcf(ptcf):
# 	"""Intersecting genes subset from PTCF format dataframe

# 	Parameters:
# 	argument1 (Obj)


# 	"""

# 	return extract_from_ptcf(Ptcf_file.I_PTCF, ptcf)


# def get_non_intersecting_ptcf_from_ptcf(ptcf):
# 	return extract_from_ptcf(Ptcf_file.NI_PTCF, ptcf)	


# def extract_from_ptcf(ptcf_file, ptcf):

# 	if not isinstance(ptcf_file, Ptcf_file):
# 		return jsonify(message='File is neither I-PTCF nor NI-PTCF file!'),500

# 	if ptcf_file == Ptcf_file.I_PTCF:
# 		intersecting_genes = ptcf[~ptcf.isnull().any(1)]
# 		intersecting_genes = intersecting_genes.sort_values(['ds1_cluster', 'ds2_cluster'])
# 		return intersecting_genes

# 	else:
# 		non_intersecting_genes = ptcf[ptcf.isnull().any(1)]
# 		non_intersecting_genes = non_intersecting_genes.sort_values(['ds1_cluster', 'ds2_cluster'])
# 		return  non_intersecting_genes


# def combine_to_ptcf(i_ptcf, ni_ptcf, file1_colnames, file2_colnames):

# 	combined = pd.concat([i_ptcf, ni_ptcf], axis = 0)

# 	return clustered_to_ptcf(combined, file1_colnames, file2_colnames)


# def has_equal_number_of_timepoints(data):

# 	return get_time_points(data, "ds1") == get_time_points(data, "ds2")


# def get_min_max_values(data, col1, col2):
	
# 	return {
# 		'ds1_min' : data[col1].min(),
# 		'ds1_max' : data[col1].max(),
# 		'ds2_min' : data[col2].min(),
# 		'ds2_max' : data[col2].max()
# 	}


# def extract_additional_information(data):

# 	cluster_count = get_cluster_count(data)

# 	# consider that min and max could be equal if only one gene occurs

# 	# consider that one experiment could contain NO genes!

# 	min_max = get_min_max_values(data, "ds1_median", "ds2_median")

# 	return {
# 		'mod_data' : data,
# 		'cluster_count' : cluster_count,
# 		'min_max' : min_max
# 	}


# def ptcf_to_json(data, is_intersecting):

# 	if len(data.index) > 0:

# 		data['gene'] = data.index

# 		additional_information = extract_additional_information(data)

# 		# split data into links
# 		if is_intersecting:
# 			data_split = split_by_link(additional_information['mod_data'])

# 		else:
# 			data_split = pd.DataFrame(additional_information['mod_data']).to_json(orient='records')


# 		return {
# 			#'data' : additional_information['mod_data'].to_json(orient='records'),
# 			'data' : data_split,
# 			'selection' : [],
# 			'go' : [],
# 			'gene_highlight_active' : False, 
# 			'columns' : list(additional_information['mod_data']), 
# 			'time_points' : get_time_points(additional_information['mod_data'], "ds1"),
# 			'x_values' : get_x_values(additional_information['mod_data'], "ds1"),
# 			'cluster_count' : additional_information['cluster_count'],
# 			'ds1_min' : additional_information['min_max']['ds1_min'],
# 			'ds1_max' : additional_information['min_max']['ds1_max'],
# 			'ds2_min' : additional_information['min_max']['ds2_min'],
# 			'ds2_max' : additional_information['min_max']['ds2_max']
# 		}

# 	else:
# 		print("no genes found")

# 		return {
# 			'data' : data.to_json(orient='records'),
# 			'columns' : [], 
# 			'time_points' : 0,
# 			'x_values' : [],
# 			'cluster_count' : 0,
# 			'ds1_min' : 0,
# 			'ds1_max' : 0, 
# 			'ds2_min' : 0,
# 			'ds2_max' : 0,
# 		}


# def add_additional_columns(data):
# 	highlighted = [True] * len(data.index)
# 	data['highlighted'] = highlighted

# 	profile_selected = [False] * len(data.index)
# 	data['profile_selected'] = profile_selected

# 	return data
	

# def remove_invalid_genes(data):

# 	data.index = data.index.astype('str')

# 	return data[~data.index.str.contains('\.')]

# def valid_cluster_header(ds, file):

# 	return str(ds) in list(file)



# def valid_cluster_values(ds, file):
	
# 	cluster_values = set(file[str(ds)].unique())

# 	if ds == "ds1_cluster":
# 		valid_values = set(['ds1_1', 'ds1_2', 'ds1_3', 'ds1_4', 'ds1_5', 'ds1_6', 'nan', np.nan])

# 	if ds == "ds2_cluster":
# 		valid_values = set(['ds2_1', 'ds2_2', 'ds2_3', 'ds2_4', 'ds2_5', 'ds2_6', 'nan', np.nan])

# 	diff = 		# transcriptome_data = "./static/data/BloodCell/Transcriptome.csv"
		# proteome_data = "./static/data/BloodCell/Proteome.csv"list(cluster_values.difference(valid_values))

# 	return len(diff)==0


# def invalid_cluster_value_pos(ds, file):

# 	if ds == "ds1_cluster":
# 		valid_values = ['ds1_1', 'ds1_2', 'ds1_3', 'ds1_4', 'ds1_5', 'ds1_6', 'nan', np.nan]
	
# 	if ds == "ds2_cluster":
# 		valid_values = ['ds2_1', 'ds2_2', 'ds2_3', 'ds2_4', 'ds2_5', 'ds2_6', 'nan', np.nan]

# 	return file.index[~file[str(ds)].isin(valid_values)].tolist()





# # get gene descriptions from NCBI
# def retrieve_annotation(id_list):

#     """Annotates Entrez Gene IDs using Bio.Entrez, in particular epost (to
#     submit the data to NCBI) and esummary to retrieve the information.
#     Returns a list of dictionaries with the annotations.

# 	https://biopython.org/wiki/Annotate_Entrez_Gene_IDs
#     """
#     Entrez.email = "myname@email.com"

#     #print(",".join(id_list))
#     #request = Entrez.epost("gene", id="SCO0201,SCO0202", idtype="acc")

#     try:
#         result = Entrez.read(request)
#     except RuntimeError as e:
#         # FIXME: How generate NAs instead of causing an error with invalid IDs?
#         print("An error occurred while retrieving the annotations.")
#         print("The error returned was %s" % e)
#         sys.exit(-1)

#     webEnv = result["WebEnv"]
#     queryKey = result["QueryKey"]
#     data = Entrez.esummary(db="gene", webenv=webEnv, query_key=queryKey)
#     annotations = Entrez.read(data)

#     print("Retrieved %d annotations for %d genes" % (len(annotations), len(id_list)))

#     return annotations



# def get_mean_centroids(data_frame, cluster_column):
# 	# get unique clusters
# 	clusters = data_frame[cluster_column].unique()

# 	# dict
# 	mean_centroid = {}

# 	for cluster in clusters:
# 		tmp_df = data_frame[data_frame[cluster_column] == cluster]

# 		tmp_df.drop(columns=['experiment', 'cluster', 'mean_value', 'highlighted', 'profile_selected'], inplace=True)
		
# 		mean_centroid[cluster] = tmp_df.apply(np.mean, axis=0).tolist()

# 	# get additional column
# 	mean_centroid['x'] = list(range(1,len(mean_centroid[list(mean_centroid.keys())[0]]) + 1))

# 	mean_centroid_df = pd.DataFrame.from_dict(mean_centroid)

# 	# change column name
# 	current_cols = list(mean_centroid_df)
# 	new_cols = {}
# 	for col in current_cols:
# 		if(col != "x"):
# 			new_cols[col] = "value" + str(col)

# 	mean_centroid_df.rename(columns = new_cols, inplace=True)

# 	# wide to long
# 	mean_centroid_df_long = pd.DataFrame(pd.wide_to_long(mean_centroid_df, stubnames='value', i='x', j='cluster'))
# 	mean_centroid_df_long.reset_index(level=['x', 'cluster'], inplace=True)

# 	return mean_centroid_df_long

