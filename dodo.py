"""
Doit file for data compendium.

If you are a user of this compendium, run `doit` to generate files and results rather than running this script.

If you are developing this compendium, you can use this script to generate documentation or encrypt private files.
"""
import os
import subprocess
import re
from collections import namedtuple, defaultdict
from os import mkdir
from pathlib import Path
import logging
from typing import Iterable, List, Tuple, Optional, NamedTuple, Dict

from doit.action import CmdAction
from doit import get_var
from doit.tools import run_once

from compendium.compendium import Compendium


def task_install():
    """Install python/R dependencies as needed"""
    compendium = Compendium()
    if compendium.pyenv:
        yield {
            'name': f"Install python environment and dependencies",
            'targets': [compendium.pyenv],
            'uptodate': [run_once],
            'actions': [compendium.install_python_task],
            'verbosity': 2
        }


def task_decrypt():
    """Decrypt private files from raw-private-encrypted (provide passphrase with `doit passphrase="Your secret"`)"""
    passphrase = get_var('passphrase')
    compendium = Compendium()
    files = list(compendium.folders.DATA_ENCRYPTED.glob("*"))
    for inf in files:
        outf = compendium.folders.DATA_PRIVATE/inf.name
        yield {
            'name': outf,
            'targets': [outf],
            'actions': [(compendium.decrypt_file_task, (passphrase, inf, outf))],
            'uptodate': [outf.exists]
        }


def task_process():
    """Create tasks for the processing scripts in src/data-processing"""
    compendium = Compendium()
    for action in compendium.get_actions():
        result = dict(
            basename=f"process:{action.file.name}",
            targets=action.targets,
            actions=[action.action],
        )
        if 'DESCRIPTION' in action.headers:
            result['doc'] = action.headers['DESCRIPTION']
        if action.inputs:
            result['file_dep'] = action.inputs
        else:
            result['uptodate'] = [True]  # task is up-to-date if target exists
        yield result




