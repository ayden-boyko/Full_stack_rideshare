import sys
from .db_utils import *
import csv, json
from datetime import datetime
from math import fsum
from flask import jsonify
import math

# to print to console do sys.stderr.write(string)

def create_tables():
    """drops, and then creates the sql and adds data to the sql tables"""
    try:
        exec_sql_file("init_test_schema.sql")
    except FileNotFoundError:
        print("sql files not found")

def db_connect():
    """connects to the database"""
    conn = connect()
    cur = conn.cursor()
    return conn, cur   

def db_disconnect(conn):
    """disconnects from database"""
    try:
        conn.commit()
        conn.close()
    except ConnectionError:
        print("could not disconnect")
        return False

def add_data_CSV(file):
    """adds data from a csv file into driver or rider tables"""
    conn, cur = db_connect()
    try:
        with open(file) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=",")
            next(csv_reader)
            for row in csv_reader:
                statement = """INSERT INTO {} (name, birthday) VALUES (%s, %s)""".format(row[1])
                cur.execute(statement, [row[0], row[2]])
        db_disconnect(conn)
        print("\n ***** CSV Data Entered ***** \n")
        return 0
    except FileNotFoundError:
        print("\n ***** CSV file not found ***** \n")
        db_disconnect(conn)
        return None
    
def add_data_JSON(data):
    """adds data from a JSON file into driver or rider tables"""
    conn, cur = db_connect()
    try:
        with open(data) as data:
            users = json.load(data)
            for users in users:
                statement = """INSERT INTO {} (name, birthday) VALUES (%s, %s)""".format(users["riderordriver"])
                cur.execute(statement, [ users["name"], users["joiningDate"]])
            db_disconnect(conn)
            print("\n ***** JSON Data Entered ***** \n")
            return 0
    except FileNotFoundError:
        print("\n ***** JSON file not found ***** \n")
        db_disconnect(conn)
        return None
        
def get_riders():
    """returns all riders"""
    conn, cur = db_connect()

    riders = """SELECT rider_id, name FROM rider"""
    cur.execute(riders)
    result1 = cur.fetchall()

    db_disconnect(conn)

    return jsonify({'riders': result1})

def get_drivers():
    """returns all drivers"""
    conn, cur = db_connect()

    drivers = """SELECT driver_id, name FROM driver"""
    cur.execute(drivers)
    result1 = cur.fetchall()

    db_disconnect(conn)

    return jsonify({'drivers': result1})

def get_driver(id):
    """returns driver based on their id"""
    conn, cur = db_connect()
    
    drivers = """SELECT driver_id, name, rating, special_instructions,
                        birthday::VARCHAR(10), zipcode, is_active
                        FROM driver WHERE driver_id = %s"""

    cur.execute(drivers, (id,))
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def get_rider(id):
    """returns rider based on their id"""
    conn, cur = db_connect()

    riders = """SELECT rider_id, name, rating, special_instructions,
                        birthday::VARCHAR(10), is_active,
                        zipcode, location FROM rider WHERE rider_id = %s"""

    cur.execute(riders, (id,))
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def get_past_rides():
    """returns all past rides"""
    conn, cur = db_connect()

    rides = """SELECT past_rides_id, driver_id, driver_name,
                    rider_id, rider_name, special_instructions,
                    start, finish_time::VARCHAR(21), rofd,
                    driver_rating, rofr, rider_rating, 
                    r_response, d_response, passengers FROM past_rides """

    cur.execute(rides)
    result = cur.fetchall()
    db_disconnect(conn)
    return jsonify(result)

def get_past_rides_taken(id, name):
    """returns past rides taken"""
    conn, cur = db_connect()

    rides = """SELECT * FROM past_rides WHERE rider_id = %s AND rider_name = %s"""

    cur.execute(rides, [id, name])
    result = cur.fetchall()
    db_disconnect(conn)
    return jsonify(result)

def get_past_rides_given(id, name):
    conn, cur = db_connect()

    rides = """SELECT * FROM past_rides WHERE driver_id = %s AND driver_name = %s"""

    cur.execute(rides, [id, name]) 
    result = cur.fetchall()
    db_disconnect(conn)
    return jsonify(result)

def get_rating(id, role):
    """returns rating"""
    conn, cur = db_connect()
    if role == "driver":
        rating = """SELECT rating FROM driver WHERE driver_id = %s"""
    else:
        rating = """SELECT rating FROM rider WHERE rider_id = %s"""

    cur.execute(rating, [id])
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def get_instructions(id, role):
    """returns special instructions"""
    conn, cur = db_connect()
    if role == "driver":
        rating = """SELECT special_instructions FROM driver WHERE driver_id = %s"""
    else:
        rating = """SELECT special_instructions FROM rider WHERE rider_id = %s"""

    cur.execute(rating, [id])
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def create_account(role, name, date):
    """creates an account"""
    conn, cur = db_connect()
    if role == "driver":
        statement = """INSERT INTO driver (name, birthday) Values (%s, %s) RETURNING driver_id"""
    else:
        statement = """INSERT INTO rider (name, birthday) Values (%s, %s) RETURNING rider_id"""
    cur.execute(statement, [name, date])
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def change_account_status(role, id): #needs fixing
    """deactivates an account"""
    conn, cur = db_connect()
   
    if (role=='rider'):
        statement = """SELECT is_active FROM rider WHERE rider_id = %s"""
        cur.execute(statement, [ id])
        is_active = cur.fetchone()
        if (is_active[0] == False): 
            is_active='True' 
        else: 
            is_active='False'

        statement = """UPDATE rider SET is_active = %s WHERE rider_id = %s"""
        cur.execute(statement, [ is_active, id])

    elif (role=='driver'):
        statement = """SELECT is_active FROM driver WHERE driver_id = %s"""
        cur.execute(statement, [ id])
        is_active = cur.fetchone()
        
        if (is_active[0] == False): 
            is_active='True' 
        else: 
            is_active='False'

        statement = """UPDATE driver SET is_active = %s WHERE driver_id = %s"""
        cur.execute(statement, [ is_active, id])

    db_disconnect(conn)
    return is_active

def update_instructions(role, id, instructions):
    """updates the special instructions of the accounts"""
    conn, cur = db_connect()

    if role == "driver":
        statement = """UPDATE driver SET special_instructions = %s WHERE driver_id = %s"""
        cur.execute(statement, [instructions, id])
    
    elif role == "rider":
        statement = """UPDATE rider SET special_instructions = %s WHERE rider_id = %s"""
        cur.execute(statement, [instructions, id])

    db_disconnect(conn)
    return True

def update_zipcode(role, id, zipcode):
    """updates the zipcode of the account"""
    conn, cur = db_connect()

    if role == "driver":
        statement = """SELECT zipcode FROM driver WHERE driver_id = %s"""
        cur.execute(statement, [id])
        pre = cur.fetchone()
    
        statement = """UPDATE driver SET zipcode = %s WHERE driver_id = %s"""
        cur.execute(statement, [zipcode, id])

        statement = """SELECT zipcode FROM driver WHERE driver_id = %s"""
        cur.execute(statement, [id])
        post = cur.fetchone()
    
    elif role == "rider":
        statement = """SELECT zipcode FROM rider WHERE rider_id = %s"""
        cur.execute(statement, [id])
        pre = cur.fetchone()

        statement = """UPDATE rider SET zipcode = %s WHERE rider_id = %s"""
        cur.execute(statement, [zipcode, id])

        statement = """SELECT zipcode FROM rider WHERE rider_id = %s"""
        cur.execute(statement, [id])
        post = cur.fetchone()

    db_disconnect(conn)
    return jsonify({'Old_zip': pre, 'New_zip' : post})
# Maybe change by adding map api and changing address -> to points/float? 
# which are then translated back into drivers map as destination?
def get_next_ride(id, start, end, socket):
    """inserts rider into awaiting rides table and converts start and end into points"""
    conn, cur = db_connect()
    rider = get_rider(id)
    rider = rider.get_json()
    convert = """SELECT CAST(%s AS POINT)"""
    cur.execute(convert, [start])
    start = cur.fetchone()[0]
    cur.execute(convert, [end])
    end = cur.fetchone()[0]
    statement = """INSERT INTO awaiting_rides (rider_id, rider_name, rider_rating, special_instructions, start, "end", socket_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"""

    cur.execute(statement, [id, rider[1], rider[2], rider[3], start, end, socket])
    db_disconnect(conn)
    return True

def update_rating(role, id, rating):
    """updates the average rating of the accounts"""
    conn, cur = db_connect()
    rating = float(rating)
    

    if role == "driver":
        statement = """SELECT rating FROM driver WHERE driver_id = %s"""
        cur.execute(statement, [id])
        pre = cur.fetchall()
        val = sum(map(sum, pre))
        rating += val
        
        rating = rating / len(pre)
    
        statement = """UPDATE driver SET rating = %s WHERE driver_id = %s"""
        cur.execute(statement, [str(rating), id])
    
    elif role == "rider":
        statement = """SELECT rating FROM rider WHERE rider_id = %s"""
        cur.execute(statement, [id])
        pre = cur.fetchall()
        val = sum(map(sum, pre))
        rating += val
        
        rating = rating / len(pre)
    
        statement = """UPDATE rider SET rating = %s WHERE rider_id = %s"""
        cur.execute(statement, [str(rating), id])

    db_disconnect(conn)
    return True

def new_ride(d_id, d_name, rider_id, start = '0,0', end = '0,0'):
    """Adds a new ride to current rides"""
    conn, cur = db_connect()
    statement = """WITH inserted_rides AS (INSERT INTO current_rides (driver_id, d_name, rider_id, r_name, s_instructions, start, "end") 
                SELECT %s, %s, %s, rider_name, special_instructions, %s, %s 
                FROM awaiting_rides
                WHERE NOT EXISTS (SELECT rider_id FROM current_rides WHERE rider_id = %s)
                RETURNING current_rides_id)
                SELECT inserted_rides.current_rides_id, awaiting_rides.socket_id
                FROM inserted_rides, awaiting_rides
                WHERE awaiting_rides.rider_id = %s"""
    cur.execute(statement, [d_id, d_name, rider_id, start, end, rider_id, rider_id])
    row = cur.fetchone()
    statement = """DELETE FROM awaiting_rides WHERE rider_id = %s"""
    cur.execute(statement, [rider_id])
    db_disconnect(conn)
    cost = math.floor(math.hypot(float(end[1]) - float(start[1]), float(end[3]) - float(start[3])))
    return jsonify(row, cost)

def cancel_ride(role, id, name):
    """removes ride from current_rides list this list is for upcoming or ongoing rides"""
    conn, cur = db_connect()
    
    if (role == "driver"):
        statement = """DELETE FROM current_rides WHERE rider_id = %s"""
        cur.execute(statement, [id])

        statement = """SELECT * FROM current_rides WHERE rider_id = %s"""
        cur.execute(statement, [id])
        post = cur.fetchone()
        
    elif (role == "rider"):
        statement = """DELETE FROM awaiting_rides WHERE rider_id = %s AND rider_name = %s"""
        post = cur.execute(statement, [id, name])

        statement = """SELECT * FROM awaiting_rides WHERE rider_id = %s AND rider_name = %s"""
        post = cur.execute(statement, [id, name])
    
    else:
        return jsonify('Error')

    db_disconnect(conn)
    return jsonify(post)

##get rider from wants ride table
def get_new_rider(zipcode):
    """stricly for driver, driver enters their zipcode, all riders in their zipcode are shown"""
    conn, cur = db_connect()

    statement = """SELECT rider_id, name, location, rating FROM rider WHERE zipcode = %s AND wants_ride = true AND is_active = true"""
    cur.execute(statement, [zipcode])
    result = cur.fetchall()
    db_disconnect(conn)
    result = result[0]
    (id, name, start, rating) = result
    return jsonify({'r_id' : id, 'name' : name, 'start' : start, 'rating' : rating})

def get_new_drivers(zipcode):
    """rider enters their zipcode, then all availabe drivers are shown"""
    conn, cur = db_connect()

    statement = """SELECT driver_id, name, rating FROM driver WHERE zipcode = %s AND is_active = true"""
    cur.execute(statement, [zipcode])
    result = cur.fetchall()
    db_disconnect(conn)
    result = result[0]
    (id, name, rating) = result
    return jsonify({'driver_id' : id, 'name' : name, 'rating' : rating})

def rider_finish_ride(id, rating_of_driver=4.5, review_of_driver="they were good"):
    """finishes the riders current ride and adds ride to past rides"""
    conn, cur = db_connect()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    statement2 = """WITH closest_ride AS (
        SELECT past_rides_id
        FROM past_rides
        WHERE rider_id = %s
        ORDER BY ABS(EXTRACT(EPOCH FROM (finish_time - %s)))
        LIMIT 1
    )
    UPDATE past_rides
    SET rofd = %s, driver_rating = %s
    WHERE past_rides_id = (SELECT past_rides_id FROM closest_ride);
                """
    cur.execute(statement2, [ id, timestamp, review_of_driver, rating_of_driver])

    #updates the driver rating
    statement = """SELECT (driver_id, rider_name) FROM past_rides WHERE rider_id = %s"""
    cur.execute(statement, [id])
    result = cur.fetchone()
    result = result[0]
    result = str(result).split(",")
    d_id = str(result[0])
    update_rating("driver", int(d_id[1:]), rating_of_driver)

    db_disconnect(conn)
    return True

def driver_finish_ride(id, rid, rating_of_rider=4.5, review_of_rider="they were good", cost = 5.0):
    """driver ends the ride and leaves a rating of the rider"""
    conn, cur = db_connect()

    statement = """SELECT * FROM current_rides WHERE rider_id = %s"""
    cur.execute(statement, [rid])
    info = cur.fetchone()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print('ride info: ', info)
    print('review: ', review_of_rider, rating_of_rider)
    print('timestamp: ', timestamp)
    
    # cast info[6 & 7] to sql point type
    convert = """SELECT CAST(%s AS POINT)"""
    cur.execute(convert, [info[6]])
    start = cur.fetchone()[0]
    cur.execute(convert, [info[7]])
    end = cur.fetchone()[0]

    if info != None:
        statement2 = """ INSERT INTO past_rides (driver_id, driver_name, rider_id, rider_name, special_instructions, start, "end", finish_time, rofr, rider_rating) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cur.execute(statement2, [info[1], info[2], info[3], info[4], info[5], start, end, timestamp, review_of_rider, rating_of_rider])
        
        statement = """DELETE FROM current_rides WHERE rider_id = %s"""
        cur.execute(statement, [info[3]]) 

        charge(id, info[4], cost, timestamp)

    #updates the rider rating
    statement = """SELECT (rider_id, rider_name) FROM past_rides WHERE driver_id = %s"""
    cur.execute(statement, [id])
    result = cur.fetchone()
    result = result[0]
    result = str(result).split(",")
    d_id = str(result[0])
    update_rating("rider", int(d_id[1:]), rating_of_rider)

    db_disconnect(conn)
    return True

def get_current_ride(id):
    """gets the info on the current ride of the rider"""
    conn, cur = db_connect()

    statement = """SELECT * FROM current_rides WHERE rider_id = %s """
    cur.execute(statement, [id])   
    result = cur.fetchone()

    db_disconnect(conn)
    return jsonify(result)

def respond(id, role, review):
    """Allows the rider or driver to leave a response the the rating/review given to them"""
    conn, cur = db_connect()

    if role == "driver":
        statement = """UPDATE past_rides SET d_response = %s WHERE past_rides_id = %s"""
        cur.execute(statement, [review, id])
    else:
        statement = """UPDATE past_rides SET r_response = %s WHERE past_rides_id = %s"""
        cur.execute(statement, [review, id])
    db_disconnect(conn)
    return True

def get_reviews(id, role):
    conn, cur = db_connect()

    if role == "driver":
        statement = """SELECT rofd, d_response, rofr, r_response FROM past_rides WHERE driver_id = %s """
    else:
        statement = """SELECT rofd, d_response, rofr, r_response FROM past_rides WHERE rider_id = %s"""
    
    cur.execute(statement, [id])
    result = cur.fetchall()
    db_disconnect(conn)
    return jsonify(result)

def charge(id, name, amount, timestamp):
    """adds a charge to a list of bills"""
    conn, cur = db_connect()

    statement = """INSERT INTO tab (billed_id, name, charge, timestamp) VALUES (%s, %s, %s, %s)"""
    cur.execute(statement, [id, name, amount, timestamp])
    db_disconnect(conn)
    return True

def get_bills(id, name, start = datetime(1, 1, 1), end = datetime(9999, 12, 31)):

    """returns all bills associated with an account"""
    conn, cur = db_connect()

    statement = """SELECT billed_id, name, charge, timestamp FROM tab WHERE billed_id = %s AND name = %s AND timestamp > %s AND timestamp < %s"""
    cur.execute(statement, [id, name, start, end])
    result = cur.fetchall()

    db_disconnect(conn)
    return jsonify(result)

def get_owed(id):

    """returns all owed amounts associated with a driver"""
    conn, cur = db_connect()

    statement = """SELECT DISTINCT T.name, T.charge, T.timestamp FROM tab T INNER JOIN past_rides P ON T.name = P.rider_name WHERE P.driver_id = %s"""
    cur.execute(statement, [id])
    result = cur.fetchall()

    db_disconnect(conn)
    return jsonify(result)


def full_ride_info(date):
    """displays all rides within one day of given date"""
    conn, cur = db_connect()
    statement = """SELECT (%s)::date"""
    cur.execute(statement, [date])
    date = cur.fetchone()

    statement = """SELECT driver_id, driver_name, array_agg(rider_name), avg(driver_rating) FROM past_rides WHERE (finish_time)::date = %s GROUP BY driver_id, driver_name ORDER BY driver_id, driver_name"""
    cur.execute(statement, [date[0]])
    result = cur.fetchone()

    db_disconnect(conn)
    return jsonify(result)

def fare_times(timestamp):
    """provides all bills charged within the time given"""
    conn, cur = db_connect()

    #trys to turn date into timestamp by adding hour to it
    statement = """SELECT %s - interval '1 hour'"""
    cur.execute(statement, [timestamp])
    starttime = cur.fetchone()
    statement = """SELECT %s + interval '1 hour'"""
    cur.execute(statement, [timestamp])
    endtime = cur.fetchone()

    #uses the bounds to serch for all bills within constraints
    statement = """SELECT date_part('hour',TIMESTAMP %s)::Integer, AVG(charge) FROM tab WHERE timestamp >= %s AND timestamp <= %s"""
    cur.execute(statement, [timestamp, starttime, endtime])
    result = cur.fetchall()

    db_disconnect(conn)
    return jsonify(result)

def get_rider_id(name):
    """returns rider id based on their name"""
    conn, cur = db_connect()

    rider = """SELECT rider_id FROM rider WHERE name = %s"""
    cur.execute(rider, [name])
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def get_driver_id(name):
    """returns driver id based on their name"""
    conn, cur = db_connect()

    driver = """SELECT driver_id 
                FROM driver 
                WHERE name = %s"""
    cur.execute(driver, [name])
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)

def get_available_riders():
    conn, cur = db_connect()
    driver = "SELECT * FROM awaiting_rides"
    cur.execute(driver)
    result = cur.fetchone()
    db_disconnect(conn)
    return jsonify(result)


