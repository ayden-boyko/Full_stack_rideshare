-- We specify our primary key here to be as repeatable as possible
INSERT INTO example_table(id, foo) VALUES
  (1, 'hello, world!');

-- Restart our primary key sequences here so inserting id=DEFAULT won't collide
ALTER SEQUENCE example_table_id_seq RESTART 1000;

--drivers
INSERT INTO "driver" ("name", "rating", "special_instructions", "birthday", "zipcode", "awaiting_rider") VALUES
    ('Ray Magliozzi', 3.2, 'Dont drive like my brother.', '1995-10-16', '94131', true),
    ('Tom Magliozzi', 3.4, 'Dont drive like my brother.', '1995-10-15', '30301', true);

--riders
INSERT INTO "rider" ("name", "rating", "birthday") VALUES
    ('Mike Easter', 4.3, '1994-5-27'),
    ('Ayden Boyko', 4.5, '2003-11-24');

--awaiting rides
INSERT INTO "awaiting_rides" ("r_id", "rider_name", "rider_rating", "special_instructions", "start", "end") VALUES
    (2, 'Ayden Boyko', 4.5, 'I dont care', '0,0', '7,9');

--past_rides
INSERT INTO "past_rides" ("d_id", "driver_name", "r_id", "rider_name", "rofd") VALUES
    (1, 'Ray Magliozzi', 1, 'Mike Easter', 'Hes a good driver'),
    (1, 'Ray Magliozzi', 1, 'Mike Easter', 'Just as good as always'),
    (2, 'Tom Magliozzi', 1, 'Ray Magliozzi', 'He drove better than his brother, haha');
    
--finished rides
INSERT INTO "tab" ("billed_id", "name", "charge") VALUES
    (1, 'Mike Easter', 5.00),
    (1, 'Mike Easter', 4.50);