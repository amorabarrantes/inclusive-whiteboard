/* General database */

CREATE DATABASE whiteboard_db;

CREATE TABLE cards (
	id SERIAL PRIMARY KEY,
	id_state INT NOT NULL,
	FOREIGN KEY (id_state) REFERENCES states,
	text VARCHAR NOT NULL
)

CREATE TABLE states (
	id SERIAL PRIMARY KEY,
	id_workflow INT NOT NULL,
	FOREIGN KEY (id_workflow) REFERENCES workflows,
	category VARCHAR NOT NULL
)

CREATE TABLE workflows (
	id SERIAL PRIMARY KEY,
	id_user INT NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users,
	name VARCHAR NOT NULL,
	description VARCHAR NOT NULL,
	creation_date DATE NOT NULL DEFAULT CURRENT_DATE
)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL
);


/* TRIGGER DEFAUT STATES */

/* First create the function */
CREATE FUNCTION addDefaultStatesProcedure()
RETURNS trigger
as $$
DECLARE
    id_workflow integer := (SELECT max(id) FROM workflows);
BEGIN
  	insert into states (id_workflow, category) values (id_workflow, 'to do');
	insert into states (id_workflow, category) values (id_workflow, 'in progress');
  	insert into states (id_workflow, category) values (id_workflow, 'completed');
	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

/* Second bind the trigger */
CREATE TRIGGER addDefaultStates AFTER INSERT ON workflows EXECUTE PROCEDURE addDefaultStatesProcedure()

