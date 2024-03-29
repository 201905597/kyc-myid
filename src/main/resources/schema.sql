-- SCHEMA

DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS ORGANIZACIONES;
DROP TABLE IF EXISTS DOCUMENTOS;
DROP TABLE IF EXISTS USUARIOSCIRBE;

CREATE TABLE USUARIOS (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    USER_NAME VARCHAR(255) NOT NULL,
    DNI VARCHAR(255) NOT NULL,
    USER_DATA VARCHAR(255) NOT NULL,
    USER_PWD VARCHAR(255) NOT NULL,
    USER_EMAIL VARCHAR(255) NOT NULL
);

CREATE TABLE ORGANIZACIONES (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    ORG_NAME VARCHAR(255) NOT NULL,
    ORG_PWD VARCHAR(255) NOT NULL
);

CREATE TABLE DOCUMENTOS (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    DNI VARCHAR(255) NOT NULL,
    DOCHASH VARCHAR(255) NOT NULL,
    DOCUMENT_DATA BLOB
);

CREATE TABLE USUARIOSCIRBE (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    DNI VARCHAR(255) NOT NULL,
    DEUDA INTEGER NOT NULL
);

CREATE TABLE USUARIOSASNEF (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    DNI VARCHAR(255) NOT NULL
);

CREATE TABLE HACIENDA (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    DNI VARCHAR(255) NOT NULL,
    DOCHASH VARCHAR(255) NOT NULL
);

CREATE TABLE DNIS (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    DNI VARCHAR(255) NOT NULL,
    DNIHASH VARCHAR(255) NOT NULL
);

CREATE TABLE AEB (
    ID INTEGER IDENTITY NOT NULL PRIMARY KEY,
    ORG_NAME VARCHAR(255) NOT NULL,
    ORG_CODE VARCHAR(255) NOT NULL
);