# OmicsTIDE Tutorial
This tutorial will guide the user through OmicsTIDE from the data loading, over the customized analysis to the final data export.

## Data 
OmicsTIDE comma- or tab-separated text files following given formats. Detailed information on the data formats used by OmicsTIDE is [provided](DATAFORMATS.md).

## Data Loading (Home Tab)
The user has two options for data loading. Either between two and four [abundance data files](DATAFORMATS.md/###-Abundance-Data) can be loaded to determine and compare trends and to subsequenty explore the trend comparison. Alternatively, an already created trend comparisons in form of a custom [PTCF](DATAFORMATS.md/###-Pairwise-Trend-Comparison-Format-(PTCF)) can directly be loaded and explored.

### First option: Loading up to four abundance files for pairwise trend comparisons
The user can select between two and four abundance data files to compute the pairwise trend comparisons. 

If required, the data set can be filtered by adjusting the **range slider** to keep only a given percentile range of genes to e.g. remove low-variant genes. The removal of low-variant genes will speed up the downstream analysis steps, as the number of genes decreases. 

By adjusting the **slider** for the initial clusters, the user can determine the further k-Means clustering step. 

Examples files can be found [here](../static/data/) (see [1], [2]). This data can also directly be loaded via the "test data" drop-down menu. 

### Second option: Loading a PTCF file to explore a pairwise trend comparison
The user can directly upload one PTCF file and explore the trend comparisons. 

An example file can be found [here](../static/data/).

<p align="center">
  <img src="../images/Loading_.png" />
</p>

## Choose your pairwise trend comparison (comparison Tab)

Once the data is loaded, the user is presented an overview of the analysis, containing the chosen parameter and the basic informations of the derived trend comparison. This includes an horizontal stacked bar chart which shows the number of genes following a concordant or discordant trend. Furthermore, also the genes are shown that are only found in one two files in the explored comparison. 

The interactive table provides information on the files selected for the pairwise trend comparison. Hovering the single rows in the table will highlight the corresponding bar chart. Furthermore, a preview of the trend comparison visualization is created. If the user clicks the cell corresponding to the intersecting genes or the non-intersecting genes, the first-level analysis will be started.

<p align="center">
  <img src="../images/Overview-.png" />
</p>

## Explore pairwise trend comparison (1st Level Analysis Tab)

If the pairwise comparison on the intersecting genes was chosen, the user can hover the single nodes and links of the Sankey diagram which will lead to only those diagrams corresponding to the currently hovered genes being highlighted. The diagrams adjacent to the Sankey will be updated with the data corresponding to the node or linked hovered and will be reconstituted if the node or linked is unhovered. For the non-intersecting genes, only adjacent diagrams are shown.

In the controls section on the right, the user can choose three different types of **diagrams** to study the data in more detail. The unfiltered data is studied best using the default activated centroid diagrams the box plots. Depending on the number of genes in the corresponding graph, unfiltered single profile diagrams might be to overloaded.

The user can customize the analysis - and thereby reducing the number of genes - by performing **filtering** either based on the variance or base on the median abundance of the genes. Both, Sankey diagrams and the adjacent diagrams are updated after the handle is released. If the non-intersecting genes are studied, the filtering of the abundance is performed on each data set individually. *NOTE* that the abundance filtering step should be done prior to the sub selection in the workflow. Activating the abundance filtering will clear the current selection table.

In the most cases, the user might have already a given gene or a bundle of genes of interest in mind. Hence, the **gene highlighting** section allows to highlight one or more genes by either using a text search, where single gene IDs can be added in a comma-separated fashion or by uploading a text file containing gene IDs separated by line breaks. The highlighting can also be turned off by clicking the button again.

An example text files for known reguatory bundles of genes in *Streptomyces coelicolor* (respiration.txt) is [provided](../static/data/). The gene list is based on [a recent study in Streptomyces coelicolor](https://www.nature.com/articles/s41598-020-65087-w).

Once a given trend or pattern of interest was found by filtering and hovering the data, a click on the corresponding node or link will adds the genes corresponding to the clicked element to the **current selection table**. Another click on an already selected element will remove it from the selection again. If the non-intersecting genes are studied, diagrams can be directly clicked to add the respective genes to the current selection table.

If the user wants to retrieve the current analysis in the form of a PTCF, the file can be **downloaded** in the first-level analysis. This file can later be loaded directly in OmicsTIDE by choosing the corresponding option in the home tab.

If an selection of a subset of genes is done, a **new analysis tab** can be opened by clicking the corresponding tab and the **2nd Level analysis** is activated. 

<p align="center">
  <img src="../images/First_.png" />
</p>

## Explore subselection (2nd Level Analysis Tab)
The current selection will appear as profile diagrams. Note, that if the analysis is based on the non-intersecting genes, one diagrams of the two diagrams might be empty, depending on the chosen selection. The genes in the subselection are shown on the top right in a **detailed selection table**. By **hovering** the single profiles, the corresponding genes are highlighted and marked with a tool tip that shows the gene ID. For more detailed information, a click on the currently hovered profile will open the corresponding entry on the **NCBI** home page.

Finding the similarities within a given selection can be done e.g. by performing a **GO enrichment**. Here, the user has to select the species of the current analysis in the drop-down menu, representing all currently [supported genomes (Panther API)](http://pantherdb.org/services/oai/pantherdb/supportedgenomes). The selection of a given species will send a request to Panther. The resulting data of the request will be plotted in horizontal bar charts showing the ten most significant hits for the three main categories, respectively. Hovering the bar charts will show more detailed information on the given GO terms in a tool tip.

The **data export** section allows the user to download a zip-compressed folder containing the two profile diagrams as PDF, the current selection in PTCF as a CSV file and - if chosen - the results of the GO term enrichment ordered by the main category and by the significance of the hits as a CSV file. 

<p align="center">
  <img src="../images/Second-.png" />
</p>



---
[1] Hoogendijk, Arie J., et al. "Dynamic transcriptome-proteome correlation networks reveal human myeloid differentiation and neutrophil-specific programming." Cell reports 29.8 (2019): 2505-2519. --> https://www.sciencedirect.com/science/article/pii/S2211124719314044

Data: https://ars.els-cdn.com/content/image/1-s2.0-S2211124719314044-mmc2.csv (The FPKM and LQF values were used for transcriptome and proteome, respectively. We used the mean value across all biological replicates per transcriptome and proteome --> [see here](../static/data/BloodCell))


[2] Sulheim, Snorre, et al. "Enzyme-constrained models and omics analysis of Streptomyces coelicolor reveal metabolic changes that enhance heterologous production." Iscience 23.9 (2020): 101525. --> https://www.sciencedirect.com/science/article/pii/S2589004220307173

Data: https://ars.els-cdn.com/content/image/1-s2.0-S2589004220307173-mmc4.xlsx (The data were normalized and the replicates were combined by using the mean value per time point and per strain)
