/*Drop tables in case they already exist*/
DROP TABLE IF EXISTS example_table;
DROP TABLE IF EXISTS "driver" CASCADE;
DROP TABLE IF EXISTS "rider" CASCADE;
DROP TABLE IF EXISTS "past_rides" CASCADE;
DROP TABLE IF EXISTS "current_rides" CASCADE;
DROP TABLE IF EXISTS "tab" CASCADE;


CREATE TABLE example_table(
  id SERIAL PRIMARY KEY,
  foo TEXT NOT NULL
);

/*create test tables*/
CREATE TABLE IF NOT EXISTS "driver"(
    "driver_id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rating" FLOAT DEFAULT 5.0,
    "special_instructions" TEXT,
    "birthday" DATE,
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "is_active" BOOLEAN DEFAULT true,
    "carpool" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS "rider"(
    "rider_id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rating" FLOAT DEFAULT 5.0,
    "special_instructions" TEXT,
    "birthday" DATE,
    "is_active" BOOLEAN DEFAULT true,
    "wants_ride" BOOLEAN DEFAULT false,
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "location" POINT DEFAULT '0,0'
);

CREATE TABLE IF NOT EXISTS "past_rides"(
    "past_rides_id" SERIAL PRIMARY KEY,
    "d_id" INTEGER REFERENCES "driver"("driver_id"),
    "driver_name" TEXT DEFAULT 'John Doe', 
    "r_id" INTEGER REFERENCES "rider"("rider_id"),
    "rider_name" TEXT DEFAULT 'John Doe',
    "special_instructions" TEXT ,
    "start" POINT NOT NULL DEFAULT '0,0', 
    "end" POINT NOT NULL DEFAULT REFERENCES "awaiting_rides"("end"),
    "finish_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rofd" VARCHAR(100),
    "driver_rating" FLOAT DEFAULT 4.5,
    "rofr" VARCHAR(100),
    "rider_rating" FLOAT DEFAULT 4.5,
    "r_response" VARCHAR(100),
    "d_response" VARCHAR(100),
    "carpool" BOOLEAN DEFAULT false,
    "passengers" INTEGER DEFAULT 1
);

/*This table houses riders that are looking for rides,
 this is more efficient than searching the entire 
 riders DB every time a driver wants to find a new rider*/
CREATE TABLE IF NOT EXISTS "awaiting_rides"(
    "awaiting_rides_id" SERIAL PRIMARY KEY,
    "r_id" INTEGER REFERENCES "rider"("rider_id"),
    "rider_name" TEXT DEFAULT "rider"("name"),
    "rider_rating" FLOAT REFERENCES "rider"("rating"),
    "special_instructions" TEXT REFERENCES "rider"("special_instructions"),
    "start" POINT NOT NULL REFERENCES "rider"("location"),
    "end" POINT NOT NULL DEFAULT REFERENCES "rider"("location")
);

/*This table STRICTLY exists as a limbo for rides,
if the ride is completed then its added to past rides,
if its cancled early its deleted from this table*/
CREATE TABLE IF NOT EXISTS "current_rides"(
    "current_rides_id" SERIAL PRIMARY KEY,
    "driver_id" INTEGER REFERENCES "driver"("driver_id"),
    "d_name" TEXT DEFAULT 'John Doe', 
    "rider_id" INTEGER REFERENCES "rider"("rider_id"),
    "r_name" TEXT DEFAULT 'John Doe',
    "s_instructions" TEXT,
    "start" POINT NOT NULL DEFAULT '0,0',
    "end" POINT NOT NULL DEFAULT REFERENCES "awaiting_rides"("end"), 
    "time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "carpool" BOOLEAN DEFAULT false,
    "passengers" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "tab"(
    "tab_id" SERIAL PRIMARY KEY,
    "billed_id" INTEGER,
    "name" TEXT NOT NULL,
    "charge" FLOAT DEFAULT 0.0,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)