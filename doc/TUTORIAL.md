# OmicsTIDE Tutorial
This tutorial gives some basic information

## Background: Data formats
Detailed information on the data formats used in OmicsTIDE can be found [here](DATAFORMATS.md).

## Available Data
Test data is available [here](../static/test_data).

## Data Loading (Home Tab)

### Option 1: Loading up to four files for running and exploring pairwise trend comparisons
The user can select between two and four [abundance files](DATAFORMATS.md) for pairwise comparisons. The number of files is restricted to four to ensure a clear overview in the Data Matrix tab with max. BINOM(4,2) = 6 comparisons. If required, the data set can be filtered by adjusting the **range slider** to keep only a given percentile range of genes to e.g. remove low-variant genes. The removal of low-variant genes will speed up the downstream analysis steps, as the number of genes decreases. By adjusting the **slider** for the initial clusters, the user can determine the further k-Means clustering step. 

### Option 2: Loading a PTCF file to explore a pairwise trend comparison
The user can select a previously custome-generated [PTCF](DATAFORMATS.md) file.

<p align="center">
  <img src="../images/home.png" />
</p>

## Choose your pairwise trend comparison (Data Matrix Tab)
Hovering the single comparisons in this tab will put color to the greyscaled graphs to allow the focus on one single pairwise comparison. Per default, the tab corresponding to the trend comparison of the **intersecting genes** is activated. The user can click on the **non-Intersecting** tab to show the trend comparison of the non-intersecting genes, alternatively. 

Once the user wants to study a given pairwise comparison in more detail, a click on the respective comparison will open the clicked graph in a 1st level analysis tab (LINK!) that allows the user to interact with graph and to select sub sets of the data. 
<p align="center">
  <img src="../images/One.svg" />
</p>

## Explore pairwise trend comparison (1st Level Analysis Tab)

If the pairwise comparison on the intersecting genes was chosen, the user can hover the single nodes and links of the Sankey diagram which will lead to only those diagrams highlighted corresponding to the currently hovered genes. The diagrams adjacent to the Sankey will be updated with the corresponding node or linked hovered and be reconstituted if the node or linked is unhovered. For the non-intersecting genes, only adjacent diagrams but not the Sankey diagram is shown.

In the controls section on the right, the user can choose three different types of **diagram** to study the data in more detailed. The unfiltered data is studied best using the centroid diagrams activated by default or the box plots. Depending on the number of genes in the corresponding graph, unfiltered single profile diagrams might be to overloaded.

The user can customize the analysis - and thereby reducing the number of genes - by performing **abundance filtering**. Both, Sankey diagrams and the adjacent diagrams are updated after the handle is released. If the non-intersecting genes are studied, the filtering of the abundance is performed on each data set indivudually. *NOTE* that the abundance filtering step should be done prior to the sub selection in the workflow. Activating the abundance filtering will empty the current selection table.

In the most cases, the user might have already a given gene or a bundle of genes in the mind. Hence, the **gene search** allows to highlight one or more genes by either using a text search, where single gene IDs can be simply concatenated by commas or by uploading a text file containing gene IDs separated by line breaks. Example text files for known reguatory bundles of genes in *Streptomyces coelicolor* are provided [here](../static/test_data/genelist_Streptomyces_coelicolor). The gene lists are taken from (LINK)

Once a given trend or pattern of interest was found by filtering and hovering the data, a click on the corresponding node or link will add the genes corresponding to the clicked element to the **current selection table**. If the non-intersecting genes are studied, a the diagram can be directly clicked to add the respective genes to the current selection table.

If an selection of a subset of genes is done, a **new analysis tab** can be opened by clicking the corresponding tab and the **2nd level analysis** is activated. 
<p align="center">
  <img src="../images/Two.svg" />
</p>

## Explore subselection (2nd Level Analysis Tab)
The current selection will appear as profile diagrams. Note, that if the analysis is based on the non-intersecting genes, one diagrams might be empty if no corresponding data was chosen. The genes in the subselection are shown on the top right in a **detailed selection table**. By **hovering** the single profiles, the corresponding genes are highlighted and marked with a tool tip. For more detailed information, a click on the currently hovered profile will open the corresponding entry on the **NCBI** home page.

Finding the similarities within a given selection can be done e.g. by performing a **GO enrichment**. Here, the user has to select the species of the current analysis in the drop-down menu, representing all currently [supported genomes (Panther API)](http://pantherdb.org/services/oai/pantherdb/supportedgenomes). the selection of a given species with send a request and the resulting data of the request will be plotted in horizontal bar charts of the 10 most significant hits for the three main categories. Hovering the bar charts will give more detailed information on the given GO terms. 

The **data export** will allow the user to download a zip folder containing the two profile diagrams, the current selection in PTCF and - if chosen - the results of the GO term enrichment ordered by the main category and by the significance of the hits. 

<p align="center">
  <img src="../images/Three.svg" />
</p>
