DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS critiques;
DROP TABLE IF EXISTS attraction;
DROP TABLE IF EXISTS users;
CREATE TABLE attraction (
  attraction_id int auto_increment,
  primary key(attraction_id),
  nom varchar(255) not null,
  localisation varchar(255) not null,
  constructeur varchar(255) not null,
  modele varchar (255) not null,
  classement int,
  visible bool default true,
  image_url varchar(255)
);
CREATE TABLE users (
  users_id int auto_increment,
  primary key(users_id),
  name varchar(255) not null,
  password varchar(255) not null
);
CREATE TABLE critiques (
  critique_id INT AUTO_INCREMENT PRIMARY KEY,
  attraction_id INT NOT NULL,
  nom VARCHAR(255) DEFAULT 'Anonyme',
  prenom VARCHAR(255) DEFAULT 'Anonyme',
  note INT CHECK (
    note BETWEEN 1
    AND 5
  ),
  texte TEXT NOT NULL,
  FOREIGN KEY (attraction_id) REFERENCES attraction(attraction_id) ON DELETE CASCADE
);
CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attraction_id INT NOT NULL,
  image_url TEXT NOT NULL,
  FOREIGN KEY (attraction_id) REFERENCES attraction(attraction_id) ON DELETE CASCADE
);