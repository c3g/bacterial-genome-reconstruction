/*
 * schema.sql
 */



CREATE TABLE IF NOT EXISTS requests (
    id    text  primary key,
    blob  text  not null
);

-- vim:et
