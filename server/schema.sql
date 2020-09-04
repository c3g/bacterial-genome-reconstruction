/*
 * schema.sql
 */



CREATE TABLE settings (
    key    varchar(100) primary key,
    value  text         not null
);
INSERT INTO settings (key, value) VALUES
    ('password', '"$2b$10$9atLhFED4kZaWIl7/o89rON/gfqW3ElL4sSqOIOLW.PJ9L4Aoh4pW"'); -- "secret"
INSERT INTO settings (key, value) VALUES
    ('defaultTasks', '[]');

CREATE TABLE members (
    id          integer     primary key autoincrement,
    firstName   text        not null,
    lastName    text        not null,
    country     text        null,
    photo       text        null,
    isPermanent integer     null,
    startDate   integer     null,
    endDate     integer     null
);

CREATE TABLE categories (
    id       integer     primary key autoincrement,
    name     text        not null,
    color    text        not null
);

CREATE TABLE tasks (
    id         integer   primary key autoincrement,
    categoryId integer   not null,
    name       text      not null
);

CREATE TABLE runs (
    id        integer primary key autoincrement,
    taskId    integer not null,
    membersId text    not null,
    date      integer not null,
    isAM      integer default 1,
    notes     text    default ''
);


-- Bootstrap data


-- Mock data

INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Eric', 'Delorimier', 'CAN', 1, null, null);
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Camille', 'F', 'CHE', 1, null, null);
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Romain', 'Gregoire', 'CAN', 0, date('2020-07-11'), date('2020-07-31'));
INSERT INTO members (firstName, lastName, country, isPermanent, startDate, endDate)
    VALUES ('Claire', 'Hanny', 'CAN', 0, date('2020-07-11'), date('2020-07-19'));

INSERT INTO categories (name, color) VALUES ('Production',   '#3366CC');
INSERT INTO categories (name, color) VALUES ('Construction', '#DC3912');

INSERT INTO tasks (categoryId, name) VALUES (1, 'Seed Collecting');
INSERT INTO tasks (categoryId, name) VALUES (1, 'Planting');
INSERT INTO tasks (categoryId, name) VALUES (1, 'Weeding');



/* INSERT INTO users (id, "googleID", token, name, email, password) VALUES (
 *     nextval('users_id_seq'),
 *     null,
 *     null,
 *     'System',
 *     null,
 *     'Gr4nts'
 * ); */

-- vim:et
