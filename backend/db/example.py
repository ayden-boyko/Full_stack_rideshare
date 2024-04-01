import os
from .db_utils import *

def rebuild_tables():
    exec_sql_file('backend/db/schema.sql')
    exec_sql_file('backend/db/test_data.sql')
