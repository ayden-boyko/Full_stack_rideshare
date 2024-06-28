/*Drop tables in case they already exist*/
DROP TABLE IF EXISTS example_table;
DROP TABLE IF EXISTS "driver" CASCADE;
DROP TABLE IF EXISTS "rider" CASCADE;
DROP TABLE IF EXISTS "awaiting_rides" CASCADE;
DROP TABLE IF EXISTS "current_rides" CASCADE;
DROP TABLE IF EXISTS "past_rides" CASCADE;
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
    "is_active" BOOLEAN DEFAULT true,
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "carpool" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS "rider"(
    "rider_id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rating" FLOAT DEFAULT 5.0,
    "special_instructions" TEXT DEFAULT 'I dont care',
    "birthday" DATE,
    "is_active" BOOLEAN DEFAULT true,
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "location" POINT DEFAULT '0,0'
);

/*This table houses riders that are looking for rides,
 this is more efficient than searching the entire 
 riders DB every time a driver wants to find a new rider*/
CREATE TABLE IF NOT EXISTS "awaiting_rides"(
    "awaiting_rides_id" SERIAL PRIMARY KEY,
    "rider_id" INTEGER REFERENCES "rider"("rider_id"),
    "rider_name" TEXT,
    "rider_rating" FLOAT,
    "special_instructions" TEXT,
    "start" POINT NOT NULL,
    "end" POINT NOT NULL,
    "socket_id" VARCHAR(20) NOT NULL
);


/* This table STRICTLY exists as a limbo for rides,
   if the ride is completed then it's added to past rides,
   if it's canceled early it's deleted from this table */
CREATE TABLE IF NOT EXISTS "current_rides"(
    "current_rides_id" SERIAL PRIMARY KEY,
    "driver_id" INTEGER REFERENCES "driver"("driver_id"),
    "d_name" TEXT, 
    "rider_id" INTEGER REFERENCES "rider"("rider_id"),
    "r_name" TEXT,
    "s_instructions" TEXT,
    "start" POINT,
    "end" POINT, 
    "time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    "zipcode" CHAR(5) DEFAULT '94131' CHECK ("zipcode" ~ '[0-9-]+' AND length("zipcode") = 5),
    "carpool" BOOLEAN DEFAULT false,
    "passengers" INTEGER DEFAULT 1
);

/* This table records past rides */
CREATE TABLE IF NOT EXISTS "past_rides"(
    "past_rides_id" SERIAL PRIMARY KEY,
    "driver_id" INTEGER REFERENCES "driver"("driver_id"),
    "driver_name" TEXT, 
    "rider_id" INTEGER REFERENCES "rider"("rider_id"),
    "rider_name" TEXT,
    "special_instructions" TEXT,
    "start" POINT, 
    "end" POINT,
    "finish_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(2),
    "rofd" VARCHAR(100) DEFAULT 'OKAY',
    "driver_rating" FLOAT DEFAULT 4.5,
    "rofr" VARCHAR(100) DEFAULT 'OKAY',
    "rider_rating" FLOAT DEFAULT 4.5,
    "r_response" VARCHAR(100),
    "d_response" VARCHAR(100),
    "carpool" BOOLEAN DEFAULT false,
    "passengers" INTEGER DEFAULT 1
);

/* This table records billing information */
CREATE TABLE IF NOT EXISTS "tab"(
    "tab_id" SERIAL PRIMARY KEY,
    "ride_id" INTEGER REFERENCES "past_rides"("past_rides_id"),
    "billed_id" INTEGER REFERENCES "rider"("rider_id"),
    "name" TEXT,
    "charge" FLOAT DEFAULT 0.0,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2)
);