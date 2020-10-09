# Welcome to OmicsTIDE!
The ***Omics** **T**rend-comparing **I**nteractive **D**ata **E**xplorer* (OmicsTIDE) is a web-based application to study the similarities and the differences in the regulatory trends between omics data sets. OmicsTIDE combines the benefits of data- and hypothesis-driven data analysis by using partitioning algorithms to detect regulatory trends across two data sets on the one hand and by allowing the user to contribute with prior knowledge to the analysis in an interactive and exploratory way on the other hand. 

## Installation Guide


### 1) Basic Requirements
Python and pip version should be >= 3.6.10 and >= 20.1.1, respectively.

```console
user@example:~$ python --version
Python 3.6.10
user@example:~$ pip --version
pip 20.1.1
```

### 2) Setting up a Virtual Environment (venv) in Python
cd to the directory where the venv should be located and create the venv
```console
user@example:~$ cd <path/to/venv-parent-dir>
user@example:~/path/to/venv-parent-dir$ python -m venv <your-venv>
```

### 3) Required Python packages
Install required Python packages by referring to the requirements.txt-file.
```console
user@example:~$ . <your-venv>/bin/activate
(<your-venv>) user@example:~$ pip install -r <path/to/OmicsTIDE>/requirements.txt
```

## Running OmicsTIDE
Activate venv and run OmicsTIDE.py which will open the web application in a new browser window. 
```console
user@example:~$ . <your-venv>/bin/activate
(<your-venv>) user@example:~$ python <path/to/omicsTIDE>/OmicsTIDE.py
```
OmicsTIDE requires a stable internet connection to load the front-end frameworks (D3, Bootstrap, jQuery) and to request data from NCBI (https://www.ncbi.nlm.nih.gov/) and Panther (http://www.pantherdb.org/). 
