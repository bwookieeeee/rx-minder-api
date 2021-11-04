-- Run this file to create a database with the required tables and user
-- API v. 1.1.0

CREATE DATABASE rxminder;
CREATE ROLE rxminder LOGIN PASSWORD "password";

CREATE TABLE users (
  id              UUID    NOT NULL PRIMARY KEY,
  username        TEXT    NOT NULL UNIQUE,
  passwdhash      TEXT    NOT NULL,
  apikey          TEXT    NOT NULL,
  email           TEXT    NOT NULL,
  firstname       TEXT    NOT NULL,
  lastname        TEXT,
  linkedrxs       TEXT[],
  linkedreminders TEXT[]
);

GRANT SELECT, UPDATE, INSERT, DELETE ON users TO rxminder;

CREATE TABLE scrips (
  id            UUID          NOT NULL PRIMARY KEY,
  rxnum         TEXT          NOT NULL,
  name          TEXT          NOT NULL,
  strength      TEXT,
  stock         NUMERIC(6,2),
  instructions  TEXT,
  warnings      TEXT[]
);

GRANT SELECT, UPDATE, INSERT, DELETE ON scrips TO rxminder;

CREATE TABLE reminders (
  id        UUID   NOT NULL PRIMARY KEY,
  userid    UUID   NOT NULL,
  interval  TEXT,
  nextfire  TEXT,
  scrips    TEXT[],
  doses     JSON
);

GRANT SELECT, UPDATE, INSERT, DELETE ON reminders TO rxminder;