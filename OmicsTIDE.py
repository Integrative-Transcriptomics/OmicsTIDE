from flask import Flask, jsonify, render_template, request, session, redirect, url_for, send_from_directory, send_file, Response
from jinja2 import Template
from werkzeug import secure_filename
import csv
import pandas as pd
import numpy as np
import json
import sys
import copy
import os
from sklearn.cluster import KMeans
from scipy import stats
from itertools import combinations
from Bio import SeqIO, Entrez
from enum import Enum
from pathlib import Path
import cairosvg
from zipfile import ZipFile
from datetime import datetime

# set enum
class Ptcf_file(Enum):
	I_PTCF = "i_ptcf"
	NI_PTCF = "ni_ptcf"

# set enum
class ComparisonType(Enum):
	INTERSECTING = "intersecting"
	NON_INTERSECTING = "non_intersecting"


# global variables
files = {}


# create instace of application 
app = Flask(__name__)

#if not os.path.exists('./tmp_files_OmicsTIDE'):

if not os.path.exists(os.path.join('.', 'tmp_files_OmicsTIDE')):

	#os.mkdir('./tmp_files_OmicsTIDE')
    os.mkdir(os.path.join('.', 'tmp_files_OmicsTIDE'))

#app.config['UPLOAD_FOLDER'] = './tmp_files_OmicsTIDE'
app.config['UPLOAD_FOLDER'] = os.path.join('.', 'tmp_files_OmicsTIDE')



def get_intersecting_ptcf_from_ptcf(ptcf):
	"""Intersecting genes subset from PTCF format dataframe

	Parameters:
	argument1 (Obj)


	"""

	return extract_from_ptcf(Ptcf_file.I_PTCF, ptcf)


def get_non_intersecting_ptcf_from_ptcf(ptcf):
	return extract_from_ptcf(Ptcf_file.NI_PTCF, ptcf)	


def extract_from_ptcf(ptcf_file, ptcf):

	if not isinstance(ptcf_file, Ptcf_file):
		raise TypeError('ptcf_file must either be I_PTCF or NI_PTCF')

	if ptcf_file == Ptcf_file.I_PTCF:
		intersecting_genes = ptcf[~ptcf.isnull().any(1)]
		intersecting_genes = intersecting_genes.sort_values(['exp1_cluster', 'exp2_cluster'])
		return intersecting_genes

	else:
		non_intersecting_genes = ptcf[ptcf.isnull().any(1)]
		non_intersecting_genes = non_intersecting_genes.sort_values(['exp1_cluster', 'exp2_cluster'])
		return  non_intersecting_genes


def combine_to_ptcf(i_ptcf, ni_ptcf, file1_colnames, file2_colnames):
	combined = pd.concat([i_ptcf, ni_ptcf], axis = 0)

	return clustered_to_ptcf(combined, file1_colnames, file2_colnames)


def has_equal_number_of_timepoints(data):

	return get_time_points(data, "exp1") == get_time_points(data, "exp2")


def get_min_max_values(data, col1, col2):
	
	return {
		'exp1_min' : data[col1].min(),
		'exp1_max' : data[col1].max(),
		'exp2_min' : data[col2].min(),
		'exp2_max' : data[col2].max()
	}


def extract_additional_information(data):
	tmp_exp1_median = get_median_values(data, "exp1")
	tmp_exp2_median = get_median_values(data, "exp2")

	data['exp1_median'] = tmp_exp1_median
	data['exp2_median'] = tmp_exp2_median

	cluster_count = get_cluster_count(data)

	# consider that min and max could be equal if only one gene occurs

	# consider that one experiment could contain NO genes!

	min_max = get_min_max_values(data, "exp1_median", "exp2_median")

	return {
		'mod_data' : data,
		'cluster_count' : cluster_count,
		'min_max' : min_max
	}


def ptcf_to_json(data):

	if len(data.index) > 0:

		data['gene'] = data.index

		additional_information = extract_additional_information(data)

		return {
			'data' : additional_information['mod_data'].to_json(orient='records'),
			'selection' : [],
			'go' : [],
			'columns' : list(additional_information['mod_data']), 
			'time_points' : get_time_points(additional_information['mod_data'], "exp1"),
			'x_values' : get_x_values(additional_information['mod_data'], "exp1"),
			'cluster_count' : additional_information['cluster_count'],
			'exp1_min' : additional_information['min_max']['exp1_min'],
			'exp1_max' : additional_information['min_max']['exp1_max'],
			'exp2_min' : additional_information['min_max']['exp2_min'],
			'exp2_max' : additional_information['min_max']['exp2_max']
		}

	else:
		print("no genes found")

		return {
			'data' : data.to_json(orient='records'),
			'columns' : [], 
			'time_points' : 0,
			'x_values' : [],
			'cluster_count' : 0,
			'exp1_min' : 0,
			'exp1_max' : 0, 
			'exp2_min' : 0,
			'exp2_max' : 0,
		}


def add_additional_columns(data):
	highlighted = [True] * len(data.index)
	data['highlighted'] = highlighted

	profile_selected = [False] * len(data.index)
	data['profile_selected'] = profile_selected

	return data
	

def remove_invalid_genes(data):

	data.index = data.index.astype('str')

	return data[~data.index.str.contains('\.')]


def get_k_from_ptcf(data):

	exp1_cluster = data['exp1_cluster'].dropna().unique()
	exp2_cluster = data['exp2_cluster'].dropna().unique()

	print(exp1_cluster)
	print(exp2_cluster)

	exp1_cluster_number_only = [x.split("_")[1] for x in exp1_cluster]
	exp2_cluster_number_only = [x.split("_")[1] for x in exp2_cluster]

	return len(list(set(exp1_cluster_number_only + exp2_cluster_number_only)))



def load_and_modify(file, from_file):

	if from_file:
		init = pd.read_csv(file, index_col='gene')

	else: 
		init = file

	if not has_equal_number_of_timepoints(init):
		raise Exception("number of conditions/time points in exp1 and exp2 has to be identical")

	k = get_k_from_ptcf(init)

	init = remove_invalid_genes(init)

	ptcf = add_additional_columns(init)

	i_ptcf = get_intersecting_ptcf_from_ptcf(ptcf)
	ni_ptcf = get_non_intersecting_ptcf_from_ptcf(ptcf)

	intersecting_genes = ptcf_to_json(i_ptcf)
	non_intersecting_genes = ptcf_to_json(ni_ptcf)

	data = {}

	info = get_info("file_1", "file_2", file, file, i_ptcf, ni_ptcf)

	data['file_1_file_2'] = {
		'intersecting' : intersecting_genes,
		'nonIntersecting' : non_intersecting_genes,
		'info' : info,
		'k' : k,
	}

	return data


def get_median_values(data, exp):

	values = data[[x for x in list(data) if x.startswith(exp) & (x!="exp1_cluster") & (x!="exp2_cluster") & (x!="gene")]]

	return values.median(axis=1)


def get_time_points(data, exp):
	return len([x for x in list(data) if x.startswith(exp) & (x!="exp1_cluster") & (x!="exp2_cluster") & (x!="gene") & (x!="exp1_median") & (x!="exp2_median")])


def get_x_values(data, exp):
	return [x for x in list(data) if x.startswith(exp) & (x!="exp1_cluster") & (x!="exp2_cluster") & (x!="gene") & (x!="exp1_median") & (x!="exp2_median")]


def get_cluster_count(data):

	exp1_cluster = [x.split("_")[1] for x in data.exp1_cluster.unique() if not pd.isna(x)]
	exp2_cluster = [x.split("_")[1] for x in data.exp2_cluster.unique() if not pd.isna(x)]

	combined_cluster = exp1_cluster + exp2_cluster

	return len(list(set(combined_cluster)))




def median_centroids(data_frame, cluster_column_exp1, cluster_column_exp2):

	# get unique clusters:
	exp1_clusters = data_frame[cluster_column_exp1].unique()
	exp2_clusters = data_frame[cluster_column_exp2].unique()

	

def preprocess_file(file):
	"""Loads file as pandas DataFrame and removes NA rows
	:param file: filename (str)
	:return modified filename (DataFrame)
	"""

	# load data 
	file = pd.read_csv(file, index_col='gene')

	# remove columns with dot
	file = remove_invalid_genes(file)

	# drop NA
	file.dropna(inplace=True)

	return file



def get_genes_subset(file1, file2, comparison_type):

	if not isinstance(comparison_type, ComparisonType):
		raise TypeError('comparison_tye must either be INTERSECTING or NON_INTERSECTING')


	file1_index = list(file1.index)
	file2_index = list(file2.index)

	if comparison_type == ComparisonType.INTERSECTING:

		genes_in_both_exp = [x for x in file1_index if x in file2_index]

		file1 = file1[file1.index.isin(genes_in_both_exp)]
		file2 = file2[file2.index.isin(genes_in_both_exp)]

	if comparison_type == ComparisonType.NON_INTERSECTING:

		file1_only = [x for x in file1_index if x not in file2_index]
		file2_only = [x for x in file2_index if x not in file1_index]

		file1 = file1[file1.index.isin(file1_only)]
		file2 = file2[file2.index.isin(file2_only)]

	file1['experiment'] = 1
	file2['experiment'] = 2

	# general col list while clustering
	tmp_col_list = list(range(1, len(list(file1))))
	tmp_col_list.append("experiment")

	file1.columns = tmp_col_list
	file2.columns = tmp_col_list

	combined = file1.append(file2)


	return combined



def run_k_means(data, k):
	"""
	runs k-means on data with given k
	:param data (DataFrame)
	:param k number of clusters (int)
	:return data with assigned clusters (DataFrame)
	"""

	try: 
		km = KMeans(n_clusters=k)
		y_km = km.fit_predict(data)
		data['cluster'] = km.labels_

		return data

	except ValueError:
		print("Empty Input!!!")



def clustered_to_ptcf(combined, file1_colnames, file2_colnames):

	combined.reset_index(level=0, inplace=True)

	combined_pivot = combined.pivot(index='gene', columns='experiment')

	# https://stackoverflow.com/questions/24290297/pandas-dataframe-with-multiindex-column-merge-levels
	combined_colnames = ["exp" + str(entry[1]) + "_" + str(entry[0]) for entry in combined_pivot.columns]

	combined_pivot.columns = combined_pivot.columns.droplevel(0)
	combined_pivot.columns = combined_colnames

	cluster_columns = combined_pivot[['exp1_cluster', 'exp2_cluster']]

	combined_pivot.drop(['exp1_cluster', 'exp2_cluster'], axis= 1, inplace=True)

	combined_pivot_reorder = combined_pivot.reindex(sorted(combined_pivot.columns), axis = 1)
	combined_pivot_reorder = pd.concat([combined_pivot_reorder, cluster_columns], axis = 1)

	# cluster as int
	combined_pivot_reorder.exp1_cluster = combined_pivot_reorder.exp1_cluster.astype('Int64') + 1
	combined_pivot_reorder.exp2_cluster = combined_pivot_reorder.exp2_cluster.astype('Int64') + 1

	# add "exp" to cluster id if not NA
	combined_pivot_reorder.exp1_cluster = "exp1_" + combined_pivot_reorder.exp1_cluster.astype(str);
	combined_pivot_reorder.exp2_cluster = "exp2_" + combined_pivot_reorder.exp2_cluster.astype(str);

	# replace
	combined_pivot_reorder = combined_pivot_reorder.replace(to_replace='<NA>', value=np.nan, regex=True)

	# sort
	combined_pivot_reorder = combined_pivot_reorder.sort_values(['exp1_cluster', 'exp2_cluster'])

	# colnames
	colnames_exp1 = ["exp1_" + x for x in file1_colnames]
	colnames_exp2 = ["exp2_" + x for x in file2_colnames]
	colnames_rest = ["exp1_cluster", "exp2_cluster"]

	new_colnames = colnames_exp1 + colnames_exp2 + colnames_rest

	combined_pivot_reorder.columns = new_colnames

	return combined_pivot_reorder


def cluster_intersecting(filename1, filename2, cluster):

	return cluster(filename1, filename2, cluster, ComparisonType.INTERSECTING)


def cluster_non_intersecting(filename1, filename2, cluster):

	return cluster(filename1, filename2, cluster, ComparisonType.NON_INTERSECTING)


def cluster(file1, file2, cluster, comparison_type):

	if not isinstance(comparison_type, ComparisonType):
		raise TypeError('comparison_tye must either be INTERSECTING or NON_INTERSECTING')

	# get intersecting or non-intersecting genes only - depending on comparison_type parameter
	combined = get_genes_subset(file1, file2, comparison_type)

	#run kmeans
	combined = run_k_means(combined, cluster)

	return combined


def filter_variance(data, lower, upper):
	data['row_variance'] = data.var(axis=1);

	lower_quantile = data['row_variance'].quantile(round(lower/100, 1))
	upper_quantile = data['row_variance'].quantile(round(upper/100, 1))

	quantile_filtered = data[data['row_variance'].gt(lower_quantile) & data['row_variance'].lt(upper_quantile)]

	quantile_filtered.drop(columns=['row_variance'], inplace=True)

	return quantile_filtered

	
		


@app.route('/load_k', methods=['GET', 'POST'])
def load_k():
	if request.method == 'POST':
		data = {}

		k = int(request.form.to_dict()['k'])
		lower_variance_percentile = int(request.form.to_dict()['lowerVariancePercentage'])
		upper_variance_percentile = int(request.form.to_dict()['upperVariancePercentage'])

		# outsource this to function #
		for combination in list(combinations(list(files.keys()), 2)):

			tmp_file1 = str(combination[0])
			tmp_file2 = str(combination[1])
			
			print(files[tmp_file1])

			# get file without NA
			exp1_file = preprocess_file(os.path.join(app.config['UPLOAD_FOLDER'], files[tmp_file1]))
			exp2_file = preprocess_file(os.path.join(app.config['UPLOAD_FOLDER'], files[tmp_file2]))

			# initial colnames
			exp1_colnames = list(exp1_file)
			exp2_colnames = list(exp2_file)

			print("before filtering: " + str(len(exp1_file.index)))
			print("before filtering: " + str(len(exp2_file.index)))

			# variance filtering
			exp1_file = filter_variance(exp1_file, lower_variance_percentile, upper_variance_percentile)
			exp2_file = filter_variance(exp2_file, lower_variance_percentile, upper_variance_percentile)


			print("after filtering: " + str(len(exp1_file.index)))
			print("after filtering: " + str(len(exp2_file.index)))

			# zscore
			exp1_file = exp1_file.T.apply(stats.zscore).T
			exp2_file = exp2_file.T.apply(stats.zscore).T


			clustering_intersecting = cluster(exp1_file, exp2_file, k, ComparisonType.INTERSECTING)
			clustering_non_intersecting = cluster(exp1_file, exp2_file, k, ComparisonType.NON_INTERSECTING)

			ptcf = combine_to_ptcf(clustering_intersecting, clustering_non_intersecting, exp1_colnames, exp2_colnames)


			### could be outsourced to function

			ptcf = add_additional_columns(ptcf)

			i_ptcf = get_intersecting_ptcf_from_ptcf(ptcf)
			ni_ptcf = get_non_intersecting_ptcf_from_ptcf(ptcf)

			intersecting_genes = ptcf_to_json(i_ptcf)
			non_intersecting_genes = ptcf_to_json(ni_ptcf)

			info = get_info(tmp_file1, tmp_file2, files[tmp_file1], files[tmp_file2], i_ptcf, ni_ptcf)

			data[combination[0] + "_" + combination[1]] = {
				'intersecting' : intersecting_genes,
				'nonIntersecting' : non_intersecting_genes,
				'info' : info,
				'k' : k
			}

		return data

	else:
		return render_template('index.html')


def get_info(file1, file2, filename1, filename2, i_ptcf, ni_ptcf):

	info = {}

	info[file1] = { 'filename' : filename1 }
	info[file2] = { 'filename' : filename2 }
	info[file1]['genes'] = list(ni_ptcf[~ni_ptcf['exp1_cluster'].isna()].index) + list(i_ptcf.index)
	info[file2]['genes'] = list(ni_ptcf[~ni_ptcf['exp2_cluster'].isna()].index) + list(i_ptcf.index)
	info['intersecting_genes'] = {'genes' : list(i_ptcf.index)}
	info[file1 + '_only'] = {'genes' : list(ni_ptcf[~ni_ptcf['exp1_cluster'].isna()].index)}
	info[file2 + '_only'] = {'genes' : list(ni_ptcf[~ni_ptcf['exp2_cluster'].isna()].index)}

	return info


def remove_tmp_files():

	filelist = os.listdir(app.config['UPLOAD_FOLDER'])

	for f in filelist:
		os.remove(os.path.join(app.config['UPLOAD_FOLDER'], f))




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

			# exp1_file = preprocess_file(files[tmp_file1])
			# exp2_file = preprocess_file(files[tmp_file2])
			
			counter += 1

		return "test"

	else:

		return render_template('index.html')
				

@app.route('/data')
def data():
	return render_template('data.html')


@app.route('/clustered_data')
def clustered_data():
	return render_template('clustered_data.html')


@app.route('/non_intersecting')
def non_intersecting():
	return render_template('non_intersecting.html')

@app.route('/selection_intersecting')
def selection_intersecting():
	return render_template('selection_intersecting.html')

@app.route('/selection_non_intersecting')
def selection_non_intersecting():
	return render_template('selection_non_intersecting.html')

@app.route('/send_svg/<path:filename>', methods=['GET', 'POST'])
def send_svg(filename):
	if request.method == 'POST':

		print("POST!")

		path1 = os.path.join(app.config['UPLOAD_FOLDER'], 'dataset1.pdf')
		path2 = os.path.join(app.config['UPLOAD_FOLDER'], 'dataset2.pdf')
		path_selection = os.path.join(app.config['UPLOAD_FOLDER'], 'selection.csv')
		path_go = os.path.join(app.config['UPLOAD_FOLDER'], 'go.csv')


		# path1 = 'home/julian/Desktop/dataset1.pdf'
		# path2 = 'home/julian/Desktop/dataset2.pdf'

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

			mol_func.sort_values(by = 'fdr', inplace=True)
			bio_proc.sort_values(by = 'fdr', inplace=True)
			cell_comp.sort_values(by = 'fdr', inplace=True)

			go = pd.concat([mol_func, bio_proc])
			go = pd.concat([go, cell_comp])
			go.drop(columns=['term'], inplace=True)

		except:
			print("no go found")

		#remove unneccessary column
		selection.drop(columns=['highlighted', 'profile_selected', 'exp1_median', 'exp2_median'], inplace=True)

		cairosvg.svg2pdf(dataset1, write_to=path1)
		cairosvg.svg2pdf(dataset2, write_to=path2)
		selection.to_csv(path_selection)

		try:
			go.to_csv(path_go)

		except:
			print("no go found")

		time_id = str(datetime.now())
		time_id = time_id.replace(" ", "_")
		time_id = time_id.split(".")[0]

		zipObj = ZipFile(os.path.join(app.config['UPLOAD_FOLDER'], filename + "_" + time_id), 'w')

		zipObj.write(path1)
		zipObj.write(path2)
		zipObj.write(path_selection)

		try:
			zipObj.write(path_go)

		except:
			print("no go found")

		zipObj.close()

		# get current selection

		# get current go enrichment (row bound, ordered by fdr)

		timestamp_name = filename + "_" + time_id

		return send_from_directory(app.config['UPLOAD_FOLDER'], timestamp_name, as_attachment=True)

		#return send_from_directory()

		#return send_file(zipObj, mimetype="application/zip", as_attachment=True, attachment_filename = filename + "_" + time_id + ".zip") 



@app.route('/upload', methods=['GET','POST'])
def uploaded_file():
	if request.method == 'POST':

		remove_tmp_files()
		
		files.clear()

		if len(list(request.files.to_dict().keys())) > 0:

			file = request.files['form_clustered']
			filename = secure_filename(file.filename)

			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			server_data = load_and_modify(os.path.join(app.config['UPLOAD_FOLDER'], filename), True)

			return server_data

		else:
			return render_template('index.html')



if __name__ == '__main__':
	app.run(debug=False)






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

