
-- Create table "users"

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create table "lists"

CREATE TABLE lists (
    list_id SERIAL PRIMARY KEY,
    list_title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id);
);

-- Create table "tasks"

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    list_id INT NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists(list_id);
);

-- Edit table (ALTER)

ALTER TABLE lists ADD completed BOOLEAN DEFAULT FALSE;

-- Add an user

INSERT INTO users (email, password) VALUES ('test@test.ru', 'pass123');

-- Add an user and return "id"

INSERT INTO users (email, password) VALUES ('test@test.ru', 'pass123') RETURNING _id;

-- Get an user data 

SELECT *  FROM users WHERE _id = 1;

-- Add a list and return "id"

INSERT INTO lists (list_title, user_id) VALUES ('Shopping', 1) RETURNING _id;

-- Add a few tasks and select all strings

INSERT INTO tasks (title, list_id)
VALUES  ('Milk', 1),
        ('Bread', 1),
        ('Cheese', 1);

SELECT * FROM tasks WHERE list_id = 1;

-- Chooose from 2 tables (users and lists)

SELECT users._id AS userid, lists._id AS listid, lists.list_title AS title
FROM users
RIGHT JOIN lists ON users._id = lists.user_id
WHERE users._id = 1;

-- Chooose from 3 tables (users, lists and tasks)

SELECT users._id AS userid, lists._id AS listid, lists.list_title AS title, tasks._id AS taskid, tasks.task
FROM users
RIGHT JOIN lists ON users._id = lists.user_id
RIGHT JOIN tasks ON lists._id = tasks.list_id
WHERE users._id = 1;
-- !!! Подумать как сгруппировать


-- Delete list by id and his tasks
DELETE FROM table_name WHERE condition;

-- Exampl
DELETE FROM tasks WHERE list_id = 1;
DELETE FROM lists WHERE _id = 1;








