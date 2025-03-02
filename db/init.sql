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
  "age" INT NOT NULL,
  "gender" "Gender" NOT NULL,
  "preference" "Orientation" NOT NULL,
  "biography" VARCHAR(1000),
  "lastTimeOnline" DATE NOT NULL DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS "Tag" CASCADE;
CREATE TABLE "Tag" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS "UserTag";
CREATE TABLE "UserTag" (
  "userId" INT NOT NULL,
  "tagId" INT NOT NULL,
  PRIMARY KEY ("userId", "tagId"),
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("tagId") REFERENCES "Tag" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Message";
CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "receiverId" INT NOT NULL,
  "message" VARCHAR(1000) NOT NULL,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
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
  "userId" INT NOT NULL,
  "likedId" INT NOT NULL,
  PRIMARY KEY ("userId", "likedId"),
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("likedId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Notification";
CREATE TABLE "Notification" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "otherId" INT,
  "message" VARCHAR(1000) NOT NULL,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "read" BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "Block";
CREATE TABLE "Block" (
  "userId" INT NOT NULL,
  "blockedId" INT NOT NULL,
  PRIMARY KEY ("userId", "blockedId"),
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
  "date" DATE NOT NULL DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS "UserLocation";
CREATE TABLE "UserLocation" (
  "userId" INT NOT NULL,
  "locationId" INT NOT NULL,
  PRIMARY KEY ("userId", "locationId"),
  FOREIGN KEY ("userId") REFERENCES "User" ("id")  ON DELETE CASCADE,
  FOREIGN KEY ("locationId") REFERENCES "Location" ("id")  ON DELETE CASCADE
);

DROP TABLE IF EXISTS "View";
CREATE TABLE "View" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "viewerId" INT NOT NULL,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
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

INSERT INTO "User" ("name", "lastName", "email", "password", "age", "gender", "preference", "biography") 
VALUES ('Alice', 'Smith', 'test@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', 25, 'Female', 'Bisexual', NULL),
('David', 'Johnson', 'test2@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', 35, 'Male', 'Heterosexual', NULL),
('Emma', 'Brown', 'test3@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', 29, 'Female', 'Homosexual', NULL),
('Michael', 'Williams', 'test4@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', 42, 'Male', 'Heterosexual', NULL),
('Sophia', 'Martinez', 'test5@mail.com', '094513168d4401c9dc5d693b3fbb9382ce68e54bafbd180f990bdf193f7c0948', 31, 'Female', 'Heterosexual', NULL);

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

INSERT INTO "Notification" ("userId", "otherId", "message") VALUES
(2, 1, 'Alice viewed your profile'),
(2, 1, 'Alice liked your profile'),
(1, 2, 'David viewed your profile'),
(1, 2, 'David liked your profile'),
(1, 2, 'You have a new message from David'),
(3, 4, 'Michael viewed your profile'),
(3, 4, 'Michael liked your profile'),
(4, 3, 'Emma viewed your profile'),
(4, 3, 'Emma liked your profile');

INSERT INTO "Block" ("userId", "blockedId") VALUES
(4, 3); -- Michael blocked Emma

INSERT INTO "Report" ("userId", "reportedId", "reason") VALUES
(1, 3, 'Suspicious activity'); -- Alice reported Emma

INSERT INTO "View" ("userId", "viewerId") VALUES
(1, 2), -- Alice viewed David
(2, 1), -- David viewed Alice
(3, 4), -- Emma viewed Michael
(4, 3); -- Michael viewed Emma

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

INSERT INTO "Location" ("latitude", "longitude", "date") 
VALUES 
(48.8566, 2.3522, CURRENT_DATE), -- Paris, France
(40.7128, -74.0060, CURRENT_DATE), -- New York, USA
(35.6895, 139.6917, CURRENT_DATE), -- Tokyo, Japan
(51.5074, -0.1278, CURRENT_DATE), -- Londres, Royaume-Uni
(40.7128, -74.0060, CURRENT_DATE); -- New York, USA

INSERT INTO "UserLocation" ("userId", "locationId") 
VALUES 
(1, 1), -- Alice -> Paris
(2, 2), -- David -> New York
(3, 3), -- Emma -> Tokyo
(4, 4), -- Michael -> Paris
(5, 5); -- Sophia -> New York