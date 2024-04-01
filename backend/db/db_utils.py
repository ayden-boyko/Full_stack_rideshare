import os
import psycopg2

conn = psycopg2.connect(
    host='localhost',
    database='rideshare',
    user=os.environ['ayden'],
    password=os.environ['M0nkeyb0y81'],
    port=os.environ['5432']
)

def connect():
    return psycopg2.connect(dbname=os.environ['database'],
                            user=os.environ['user'],
                            password=os.environ['password'],
                            host=os.environ['host'],
                            port=os.environ['port'])

def exec_sql_file(path):
    full_path = os.path.join(os.path.dirname(__file__), f'../../{path}')
    conn = connect()
    cur = conn.cursor()
    with open(full_path, 'r') as file:
        cur.execute(file.read())
    conn.commit()
    conn.close()

def exec_get_one(sql, args={}):
    conn = connect()
    cur = conn.cursor()
    cur.execute(sql, args)
    one = cur.fetchone()
    conn.close()
    return one

def exec_get_all(sql, args={}):
    conn = connect()
    cur = conn.cursor()
    cur.execute(sql, args)
    # https://www.psycopg.org/docs/cursor.html#cursor.fetchall

    list_of_tuples = cur.fetchall()
    conn.close()
    return list_of_tuples

def exec_commit(sql, args={}):
    conn = connect()
    cur = conn.cursor()
    result = cur.execute(sql, args)
    conn.commit()
    conn.close()
    return result
