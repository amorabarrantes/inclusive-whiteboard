/* General database */

CREATE DATABASE whiteboard_db;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL
);

CREATE TABLE workflows (
	id SERIAL PRIMARY KEY,
	id_user INT NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users ON DELETE CASCADE,
	name VARCHAR NOT NULL,
	description VARCHAR NOT NULL,
	creation_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE states (
	id SERIAL PRIMARY KEY,
	id_workflow INT NOT NULL,
	FOREIGN KEY (id_workflow) REFERENCES workflows ON DELETE CASCADE,
	category VARCHAR NOT NULL,
	counter INT not null
);

CREATE TABLE cards (
	id SERIAL PRIMARY KEY,
	id_state INT NOT NULL,
	FOREIGN KEY (id_state) REFERENCES states ON DELETE CASCADE,
	text VARCHAR NOT NULL
);


/* TRIGGER DEFAUT STATES */

/* First create the function */
CREATE FUNCTION addDefaultStatesProcedure()
RETURNS trigger
as $$
DECLARE
    id_workflow integer := (SELECT max(id) FROM workflows);
BEGIN
      insert into states (id_workflow, category, counter) values (id_workflow, 'to do', 0);
    insert into states (id_workflow, category, counter) values (id_workflow, 'in progress', 1);
      insert into states (id_workflow, category, counter) values (id_workflow, 'completed', 2);
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';


/* Second bind the trigger */
CREATE TRIGGER addDefaultStates AFTER INSERT ON workflows EXECUTE PROCEDURE addDefaultStatesProcedure();




/* TRIGGER UPDATE STATES */
CREATE FUNCTION updateStatesCounter()
RETURNS trigger
as $$
DECLARE
    inserted_state_id integer := (SELECT max(id) FROM states);
    inserted_workflow_id integer := (select id_workflow from states where id = inserted_state_id);
    inserted_state_counter integer := (select counter from states where id = inserted_state_id);
BEGIN
    UPDATE states SET counter = counter + 1 WHERE id_workflow = inserted_workflow_id and id != inserted_state_id and counter >= inserted_state_counter;
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

/* Second bind the trigger */
CREATE TRIGGER updateStatesCounterTrigger AFTER INSERT ON states EXECUTE PROCEDURE updateStatesCounter();