DROP TABLE IF EXISTS critiques;
DROP TABLE IF EXISTS attraction;
DROP TABLE IF EXISTS users;
CREATE TABLE attraction (
  attraction_id int auto_increment,
  primary key(attraction_id),
  nom varchar(255) not null,
  description varchar(255) not null,
  difficulte int,
  visible bool default true
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
  note INT,
  texte TEXT NOT NULL,
  FOREIGN KEY (attraction_id) REFERENCES attraction(attraction_id) ON DELETE CASCADE
);