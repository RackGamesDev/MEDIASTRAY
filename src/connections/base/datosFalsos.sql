-- Inserción de datos falsos para el modo development

DELETE FROM USUARIOS; --CUIDADO solo para el testing

INSERT INTO USUARIOS (username, email, password_hash, first_name, last_name) VALUES
('john.doe', 'john.doe@example.com', '$2a$10$examplehashedpassword1', 'John', 'Doe'),
('jane.smith', 'jane.smith@example.com', '$2a$10$anotherhashedpassword2', 'Jane', 'Smith'),
('peter.jones', 'peter.jones@example.com', '$2a$10$yetanotherhash3', 'Peter', 'Jones'),
('mary.brown', 'mary.brown@example.com', '$2a$10$hashedpassword4', 'Mary', 'Brown'),
('david.wilson', 'david.wilson@example.com', '$2a$10$hash5', 'hola', 'Wilson'),
('linda.garcia', 'linda.garcia@example.com', '$2a$10$hash6', 'Linda', 'Garcia'),
('michael.rodriguez', 'michael.rodriguez@example.com', '$2a$10$hash7', 'Michael', 'Rodriguez'),
('sarah.williams', 'sarah.williams@example.com', '$2a$10$hash8', 'Sarah', 'Williams'),
('kevin.martinez', 'kevin.martinez@example.com', '$2a$10$hash9', 'Kevin', 'Martinez'),
('laura.anderson', 'laura.anderson@example.com', '$2a$10$hash10', 'Laura', 'Anderson'),
('thomas.taylor', 'thomas.taylor@example.com', '$2a$10$hash11', 'Thomas', 'Taylor'),
('jennifer.thomas', 'jennifer.thomas@example.com', '$2a$10$hash12', 'Jennifer', 'Thomas'),
('christopher.jackson', 'christopher.jackson@example.com', '$2a$10$hash13', 'Christopher', 'Jackson'),
('ashley.white', 'ashley.white@example.com', '$2a$10$hash14', 'hola', 'White'),
('daniel.harris', 'daniel.harris@example.com', '$2a$10$hash15', 'Daniel', 'Harris'),
('nicole.martin', 'nicole.martin@example.com', '$2a$10$hash16', 'Nicole', 'Martin'),
('brian.thompson', 'brian.thompson@example.com', '$2a$10$hash17', 'Brian', 'Thompson'),
('deborah.garner', 'deborah.garner@example.com', '$2a$10$hash18', 'Deborah', 'Garner'),
('paul.moore', 'paul.moore@example.com', '$2a$10$hash19', 'Paul', 'Moore'),
('cynthia.walker', 'cynthia.walker@example.com', '$2a$10$hash20', 'Cynthia', 'Walker'),
('gary.clark', 'gary.clark@example.com', '$2a$10$hash21', 'Gary', 'Clark'),
('margaret.lewis', 'margaret.lewis@example.com', '$2a$10$hash22', 'hola', 'Lewis'),
('robert.hall', 'robert.hall@example.com', '$2a$10$hash23', 'Robert', 'Hall'),
('sherry.young', 'sherry.young@example.com', '$2a$10$hash24', 'Sherry', 'Young'),
('anthony.king', 'anthony.king@example.com', '$2a$10$hash25', 'Anthony', 'King'),
('betty.wright', 'betty.wright@example.com', '$2a$10$hash26', 'Betty', 'Wright'),
('steven.scott', 'steven.scott@example.com', '$2a$10$hash27', 'Steven', 'Scott'),
('dorothy.green', 'dorothy.green@example.com', '$2a$10$hash28', 'Dorothy', 'Green'),
('donald.baker', 'donald.baker@example.com', '$2a$10$hash29', 'hola', 'Baker'),
('elizabeth.nelson', 'elizabeth.nelson@example.com', '$2a$10$hash30', 'Elizabeth', 'Nelson');

