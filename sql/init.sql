CREATE DATABASE matcha;

\c matcha;

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
  "lastTimeOnline" TIMESTAMP
);

DROP TABLE IF EXISTS "Tag" CASCADE;
CREATE TABLE "Tag" (
  "id" SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS "UserTag";
CREATE TABLE "UserTag" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "tagId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("tagId") REFERENCES "Tag" ("id")
);

DROP TABLE IF EXISTS "Message";
CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "receiverId" INT NOT NULL,
  "message" VARCHAR(1000) NOT NULL,
  "date" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("receiverId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Report";
CREATE TABLE "Report" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "reportedId" INT NOT NULL,
  "reason" VARCHAR(1000) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("reportedId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Like";
CREATE TABLE "Like" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "likedId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("likedId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Notification";
CREATE TABLE "Notification" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "message" VARCHAR(1000) NOT NULL,
  "date" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Block";
CREATE TABLE "Block" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "blockedId" INT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("blockedId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Location";
CREATE TABLE "Location" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "View";
CREATE TABLE "View" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "viewerId" INT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id"),
  FOREIGN KEY ("viewerId") REFERENCES "User" ("id")
);

DROP TABLE IF EXISTS "Image";
CREATE TABLE "Image" (
  "id" SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "isProfile" BOOLEAN NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id")
);
