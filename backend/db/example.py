import os
from db_utils import *

def rebuild_tables():
    exec_sql_file('backend/db/schema.sql')
    exec_sql_file('backend/db/test_data.sql')

def list_examples():
    return {
        'name':'ayden',
        'age': 20,
        'favorite animal': 'cat'
    }