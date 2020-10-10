# OmicsTIDE Tutorial
This tutorial gives some basic information

## Background: Data formats

### Abundance Data
The fundament of the most algorithms and tools dealing with omics data is a well-structured abundance matrix with non-negative integers or floats where the rows corresponding to the single records (e.g. genes) and the columns corresponding to the respective observation (e.g. condition) of the given record. The record requires an additional column as identifier (ID). 

<p align="center">
  <img src="qnorm-log2.png" />
</p>

OmicsTIDE uses abundance data as one of its input options. The user should have already adapted the data by adapting the raw data e.g. using quantile-normalization or log2-transformation. **NOTE: If the adapted abundance data is directly loaded to OmicsTIDE for trend comparison it should not be z-score normalized, since the normalization is part the calculation.**



### ***P**airwise **T**rend **C**omparison **F**ormat* (PTCF)
<p align="center">
  <img src="ptcf.png" />
</p>



## Data Loading (Home Tab)

### Option 1: Loading up to four files for running and exploring pairwise trend comparisons

### Option 2: Loading a PTCF file to explore a pairwise trend comparison


## Choose your pairwise trend comparison (Data Matrix Tab)

### hover trend comparison

### toggle non-intersecting




## Explore pairwise trend comparison (1st Level Analysis Tab)

### First impression

### Change Diagrams

### Apply abundance filters

### find genes

### create subselection




## Explore subselection (2nd Level Analysis Tab)

### Browse subselection
hover genes, go to NCBI

### GO Enrichment

### Export Results


