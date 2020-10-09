# Welcome to OmicsTIDE!
OmicsTIDE is a web-based application for the exploration of trend comparisons in omics data sets.  

## Installation


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
Activate venv and run OmicsTIDE.py which will open the program in your browser. 
```console
user@example:~$ . <your-venv>/bin/activate
(<your-venv>) user@example:~$ python <path/to/omicsTIDE>/OmicsTIDE.py
```
OmicsTIDE requires a stable internet connection to load the front-end frameworks (D3, Bootstrap, jQuery) and to request data from NCBI (https://www.ncbi.nlm.nih.gov/) and Panther (http://www.pantherdb.org/). 
