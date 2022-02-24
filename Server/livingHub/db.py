import logging

from peewee import *
import sys

# IF we're running nose tests, we want an in-memory db
if 'nose' in sys.modules.keys():
    logging.warning("I think you're unit testing: using in-memory db")
    db = SqliteDatabase(':memory:', pragmas={'foreign_keys': 1})
else:
    db = SqliteDatabase('livingHub.db', pragmas={'foreign_keys': 1})


def initialize_if_needed():
    from livingHub.auth import User
    from livingHub.index import Index, IndexRole
    db.create_tables([User, Index, IndexRole])
