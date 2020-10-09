# Welcome to OmicsTIDE!

## Installation

### 1) Basic Requirements
Python and pip version should be >= 3.6.10 and >= 20.1.1, respectively.

```console
user@example:~$ python --version
Python 3.6.10
user@example:~$ pip --version
pip 20.1.1
```

### 2) Clone Repository
cd to the directory where OmicsTIDE should be located and clone repository
```console
user@example:~$ cd <path/to/OmicsTIDE-parent-dir>
user@example:~/path/to/OmicsTIDE-parent-dir$ git clone https://github.com/julian-fra/OmicsTIDE.git
```

### 3) Setting up Virtual Environment (venv)
cd to the directory where the venv should be located and create venv
```console
user@example:~$ cd <path/to/venv-parent-dir>
user@example:~/path/to/venv-parent-dir$ python -m venv <your-venv>
```
Install required Python packages by using pip install.
```console
user@example:~$ pip install -r <path/to/OmicsTIDE>/requirements.txt
```

## Running OmicsTIDE
Activate venv and run OmicsTIDE.py

```console
user@example:~$ . <your-venv>/bin/activate
user@example:~$ python <path/to/omicsTIDE>/OmicsTIDE.py
```
