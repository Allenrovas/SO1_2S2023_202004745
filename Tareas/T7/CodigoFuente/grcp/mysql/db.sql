CREATE DATABASE IF NOT EXISTS tarea7;

USE tarea7;

CREATE TABLE IF NOT EXISTS nota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carnet BIGINT NOT NULL,
    anio INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    curso VARCHAR(35) NOT NULL,
    nota INT NOT NULL,
    semestre VARCHAR(5) NOT NULL
);

SELECT * from nota;