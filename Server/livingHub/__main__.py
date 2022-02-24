"""
AmCAT4 REST API
"""

import logging
import sys
import os, io
import csv

import random
from datetime import datetime

from livingHub import auth
from livingHub.auth import Role, User
from livingHub.db import initialize_if_needed
from livingHub.elastic import setup_elastic, upload_documents
from livingHub.api import app
from livingHub.index import create_index, Index

defIndex = "living_hub_dataset"


def upload_test_data() -> Index:

    csv.field_size_limit(sys.maxsize)
    my_path = os.path.abspath(os.path.dirname(__file__))
    path = os.path.join(my_path, "../data_living_hub.csv")
    with open(path, newline='') as f:
        csvfile = csv.DictReader(f)
        # creates the index info on the sqlite db
        index = create_index(defIndex)

        docs = [dict(id=row['_id'],
                     title="Research Record",
                     date="2021-01-01",
                     text="Lorem Lipsum",
                     url="vu.livingHub.nl",
                     doi=row['doi'],
                     language=row['language'],
                     method=row['method'],
                     method2=row['method2'],
                     measurement=row['measurement'],
                     validation=row['validation'])
                for row in csvfile]
        columns = {"id" : "keyword","doi": "keyword", "language": "keyword","method": "keyword","method2": "keyword","measurement": "keyword","validation": "keyword"}

    upload_documents(defIndex, docs, columns)
    logging.info("created livingHub system index: {}".format(defIndex))
    return index


import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--create-test-index', action='store_true')
args = parser.parse_args()

logging.basicConfig(format='[%(levelname)-7s:%(name)-15s] %(message)s', level=logging.INFO)
# connect to elastic, create sysIndex if needed
setup_elastic()
# create databases and tables
initialize_if_needed()
es_logger = logging.getLogger('elasticsearch')
es_logger.setLevel(logging.WARNING)
if not User.select().where(User.email == "admin").exists():
    logging.warning("**** No user detected, creating superuser admin:admin ****")
    auth.create_user("admin", "admin", Role.ADMIN)
if (args.create_test_index or True):

    if (not Index.select().where(Index.name == defIndex)):
        logging.info("**** Creating test index {} ****".format(defIndex))
        admin = User.get(User.email == "admin")
        upload_test_data().set_role(admin, Role.ADMIN)
app.run(debug=True, port=5001)
