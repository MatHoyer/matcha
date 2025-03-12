DROP TYPE IF EXISTS "Gender" CASCADE;
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

DROP TYPE IF EXISTS "Orientation" CASCADE;
CREATE TYPE "Orientation" AS ENUM ('Heterosexual', 'Bisexual', 'Homosexual');

DROP TABLE IF EXISTS "User" CASCADE;
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "birthDate" DATE NOT NULL,
  "gender" "Gender" NOT NULL,
  "preference" "Orientation" NOT NULL,
  "biography" VARCHAR(1000),
  "lastTimeOnline" TIMESTAMP NOT NULL DEFAULT NOW(),
  "isOnline" BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE OR REPLACE VIEW "User_v" AS 
SELECT *, EXTRACT(YEAR FROM age(CURRENT_DATE, "birthDate"))::INT AS "age" FROM "User";

DROP TABLE IF EXISTS "Tag" CASCADE;
CREATE TABLE "Tag" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS "UserTag";
CREATE TABLE "UserTag" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "tagId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("tagId") REFERENCES "Tag" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Message";
CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "receiverId" INT NOT NULL,
  "message" VARCHAR(1000) NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("receiverId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Report";
CREATE TABLE "Report" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "reportedId" INT NOT NULL,
  "reason" VARCHAR(1000) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("reportedId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Like";
CREATE TABLE "Like" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "likedId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("likedId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TYPE IF EXISTS "Type" CASCADE;
CREATE TYPE "Type" AS ENUM ('Message', 'Like', 'View', 'Match', 'Unlike');

DROP TABLE IF EXISTS "Notification";
CREATE TABLE "Notification" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "otherUserId" INT,
  "type" "Type" NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "read" BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("otherUserId") REFERENCES "User" ("id") ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Block";
CREATE TABLE "Block" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "blockedId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("blockedId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "GlobalLocation";
CREATE TABLE "GlobalLocation" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL
);

DROP TABLE IF EXISTS "Location";
CREATE TABLE "Location" (
  "id" SERIAL PRIMARY KEY,
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS "UserLocation";
CREATE TABLE "UserLocation" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "locationId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("locationId") REFERENCES "Location" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "View";
CREATE TABLE "View" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "viewerId" INT NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("viewerId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Image";
CREATE TABLE "Image" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "isProfile" BOOLEAN NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

INSERT INTO "User" ("name", "lastName", "email", "password", "birthDate", "gender", "preference", "biography") 
VALUES ('Alice', 'Smith', 'test@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1990-01-01', 'Female', 'Bisexual', NULL),
('David', 'Johnson', 'test2@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1985-05-15', 'Male', 'Heterosexual', NULL),
('Emma', 'Brown', 'test3@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1995-03-20', 'Female', 'Homosexual', NULL),
('Michael', 'Williams', 'test4@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1980-07-10', 'Male', 'Heterosexual', NULL),
('Sophia', 'Martinez', 'test5@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1992-11-25', 'Female', 'Heterosexual', NULL);

INSERT INTO "Tag" ("name") VALUES
('Sports'),
('Music'),
('Tech'),
('Art'),
('Travel');

INSERT INTO "UserTag" ("userId", "tagId") VALUES
(1, 5), -- Alice aime le voyage
(2, 1), -- David aime le sport
(2, 2), -- David aime la musique
(3, 3), -- Emma aime la tech
(4, 1), -- Michael aime le sport
(5, 4), -- Sophia aime l'art
(5, 2); -- Sophia aime la musique

INSERT INTO "Message" ("userId", "receiverId", "message") VALUES
(1, 2, 'Hey David its Alice, how are you?'),
(2, 1, 'Hi Alice im David! I am good, you?'),
(3, 4, 'Hello Michael its Emma, want to discuss tech?'),
(4, 3, 'Sure Emma its Michael, I love learning new things!');

INSERT INTO "Like" ("userId", "likedId") VALUES
(1, 2), -- Alice aime David
(2, 1), -- David aime Alice
(3, 4), -- Emma aime Michael
(4, 3); -- Michael aime Emma

INSERT INTO "Notification" ("userId", "otherUserId", "type") VALUES
(2, 1, 'View'),
(2, 1, 'Like'),
(1, 2, 'View'),
(1, 2, 'Like'),
(1, 2, 'Message'),
(3, 4, 'View'),
(3, 4, 'Like'),
(4, 3, 'View'),
(4, 3, 'Like');

INSERT INTO "Block" ("userId", "blockedId") VALUES
(4, 3); -- Michael blocked Emma

INSERT INTO "Report" ("userId", "reportedId", "reason") VALUES
(1, 3, 'Suspicious activity'); -- Alice reported Emma

INSERT INTO "View" ("userId", "viewerId") VALUES
(1, 2), -- Alice viewed David
(2, 1), -- David viewed Alice
(3, 4), -- Emma viewed Michael
(4, 3); -- Michael viewed Emma

INSERT INTO "Location" ("latitude", "longitude") 
VALUES 
(48.8566, 2.3522), -- Paris, France
(40.7128, -74.0060), -- New York, USA
(35.6895, 139.6917), -- Tokyo, Japan
(51.5074, -0.1278), -- Londres, Royaume-Uni
(40.7128, -74.0060); -- New York, USA

INSERT INTO "UserLocation" ("userId", "locationId") 
VALUES 
(1, 1), -- Alice -> Paris
(2, 2), -- David -> New York
(3, 3), -- Emma -> Tokyo
(4, 4), -- Michael -> Paris
(5, 5); -- Sophia -> New York

INSERT INTO "GlobalLocation" ("name", "latitude", "longitude") 
VALUES ('Paris', 48.8566, 2.3522),
('London', 51.5074, 0.1278),
('New York', 40.7128, -74.0060),
('Tokyo', 35.6895, 139.6917),
('Sydney', -33.8688, 151.2093),
('Rio de Janeiro', -22.9068, -43.1729),
('Cape Town', -33.9249, 18.4241),
('Moscow', 55.7558, 37.6176),
('Beijing', 39.9042, 116.4074),
('Dubai', 25.276987, 55.296249),
('Los Angeles', 34.0522, -118.2437),
('Mexico City', 19.4326, -99.1332),
('Buenos Aires', -34.6037, -58.3816),
('Rome', 41.9028, 12.4964),
('Berlin', 52.5200, 13.4050),
('Madrid', 40.4168, -3.7038),
('Lisbon', 38.7223, -9.1393),
('Amsterdam', 52.3676, 4.9041),
('Brussels', 50.8503, 4.3517),
('Vienna', 48.2082, 16.3738),
('Prague', 50.0755, 14.4378),
('Warsaw', 52.2297, 21.0122),
('Budapest', 47.4979, 19.0402),
('Athens', 37.9838, 23.7275),
('Istanbul', 41.0082, 28.9784),
('Cairo', 30.0444, 31.2357),
('Nairobi', -1.2921, 36.8219),
('Mumbai', 19.0760, 72.8777),
('Bangkok', 13.7563, 100.5018),
('Singapore', 1.3521, 103.8198),
('Kuala Lumpur', 3.1390, 101.6869),
('Jakarta', -6.2088, 106.8456),
('Manila', 14.5995, 120.9842),
('Auckland', -36.8485, 174.7633),
('Vancouver', 49.2827, -123.1207),
('San Francisco', 37.7749, -122.4194),
('Chicago', 41.8781, -87.6298),
('Toronto', 43.6511, -79.3470),
('Montreal', 45.5017, -73.5673),
('Lyon', 45.7640, 4.8357),
('Marseille', 43.2965, 5.3698),
('Toulouse', 43.6047, 1.4442),
('Nice', 43.7102, 7.2620),
('Nantes', 47.2184, -1.5536),
('Strasbourg', 48.5734, 7.7521),
('Montpellier', 43.6119, 3.8772),
('Bordeaux', 44.8378, -0.5792),
('Lille', 50.6292, 3.0573),
('Rennes', 48.1173, -1.6778);

INSERT INTO "User" ("name", "lastName", "email", "password", "birthDate", "gender", "preference", "biography") 
VALUES  ('Willey', 'Bridie', 'wbridie0@yellowbook.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1989-01-24', 'Female', 'Heterosexual', 'Nunc purus.'),
('Carlynne', 'Stockill', 'cstockill1@tamu.edu', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1964-05-30', 'Female', 'Homosexual', null),
('Natalie', 'Lambersen', 'nlambersen2@toplist.cz', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1981-01-12', 'Female', 'Heterosexual', 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.'),
('Francis', 'Mifflin', 'fmifflin3@nydailynews.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1998-11-27', 'Female', 'Heterosexual', 'Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.'),
('Myrtle', 'Blakely', 'mblakely4@ning.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1979-02-28', 'Female', 'Heterosexual', 'Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.'),
('Isahella', 'Tear', 'itear5@sakura.ne.jp', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1967-08-12', 'Female', 'Heterosexual', 'Vestibulum sed magna at nunc commodo placerat.'),
('Brigg', 'McWilliams', 'bmcwilliams6@cbsnews.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1979-07-16', 'Female', 'Homosexual', 'Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus.'),
('Doris', 'Lackmann', 'dlackmann7@cpanel.net', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1974-08-23', 'Male', 'Heterosexual', 'Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.'),
('Dulsea', 'Yarnton', 'dyarnton8@amazon.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1994-05-04', 'Female', 'Bisexual', 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio.'),
('Cart', 'Walburn', 'cwalburn9@walmart.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1983-02-21', 'Female', 'Bisexual', null),
('Lena', 'Chettoe', 'lchettoea@google.fr', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1999-11-24', 'Female', 'Heterosexual', 'Fusce posuere felis sed lacus.'),
('Web', 'Scollick', 'wscollickb@columbia.edu', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1976-11-30', 'Male', 'Heterosexual', 'Phasellus in felis.'),
('Cecil', 'Ebbrell', 'cebbrellc@xinhuanet.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1971-10-15', 'Male', 'Bisexual', 'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.'),
('Evered', 'Dorrins', 'edorrinsd@4shared.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1968-03-11', 'Male', 'Heterosexual', 'Duis mattis egestas metus.'),
('Celie', 'Burker', 'cburkere@about.me', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1999-08-30', 'Female', 'Heterosexual', 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.'),
('Meryl', 'Bickerstaff', 'mbickerstafff@archive.org', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '2004-04-18', 'Male', 'Bisexual', 'Integer ac leo.'),
('Morgen', 'Ratledge', 'mratledgeg@free.fr', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1977-12-03', 'Female', 'Bisexual', null),
('Lanna', 'Dot', 'ldoth@goodreads.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1991-03-06', 'Female', 'Homosexual', 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.'),
('Bud', 'Thripp', 'bthrippi@intel.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1964-04-21', 'Female', 'Heterosexual', null),
('Karim', 'Brason', 'kbrasonj@ted.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1983-08-30', 'Male', 'Homosexual', 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.'),
('Symon', 'Castagneto', 'scastagnetok@amazonaws.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1974-08-25', 'Female', 'Bisexual', null),
('Sydney', 'Eastway', 'seastwayl@histats.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1967-08-16', 'Male', 'Homosexual', 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.'),
('Kareem', 'Shillington', 'kshillingtonm@oaic.gov.au', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1992-11-23', 'Female', 'Homosexual', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.'),
('Randell', 'MacRury', 'rmacruryn@last.fm', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1969-12-06', 'Male', 'Homosexual', 'Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.'),
('Mattias', 'Cordeix', 'mcordeixo@virginia.edu', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1989-12-17', 'Male', 'Bisexual', 'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.'),
('Lucais', 'Lorenzetti', 'llorenzettip@domainmarket.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1986-02-09', 'Male', 'Bisexual', 'Pellentesque ultrices mattis odio. Donec vitae nisi.'),
('Lou', 'Jellico', 'ljellicoq@bbc.co.uk', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '2003-09-08', 'Male', 'Heterosexual', 'Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'),
('Gino', 'Kellet', 'gkelletr@economist.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1985-11-14', 'Female', 'Bisexual', 'Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.'),
('Cammie', 'Dagleas', 'cdagleass@e-recht24.de', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '2002-05-26', 'Female', 'Bisexual', 'Nulla suscipit ligula in lacus.'),
('Glenden', 'Drews', 'gdrewst@cornell.edu', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1976-09-01', 'Male', 'Homosexual', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.'),
('Romy', 'Backshell', 'rbackshellu@unicef.org', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '2004-11-30', 'Female', 'Bisexual', null),
('Nancey', 'Bowshire', 'nbowshirev@people.com.cn', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1981-12-31', 'Female', 'Bisexual', 'Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.'),
('Elmore', 'Payn', 'epaynw@fda.gov', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1996-05-31', 'Female', 'Heterosexual', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.'),
('Margie', 'Reinmar', 'mreinmarx@washingtonpost.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '2002-03-18', 'Male', 'Homosexual', 'In eleifend quam a odio.'),
('Raddie', 'Varran', 'rvarrany@123-reg.co.uk', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', '1968-04-29', 'Male', 'Bisexual', 'Suspendisse potenti.');

INSERT INTO "Location" ("latitude", "longitude") 
VALUES (48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778),
(48.5734, 7.7521),
(43.6119, 3.8772),
(44.8378, -0.5792),
(50.6292, 3.0573),
(48.1173, -1.6778);


INSERT INTO "UserLocation" ("userId", "locationId") 
VALUES (6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(31, 31),
(32, 32),
(33, 33),
(34, 34),
(35, 35),
(36, 36),
(37, 37),
(38, 38),
(39, 39),
(40, 40);