FROM node:23

WORKDIR /app/server

COPY ./app/server/ /app/server/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]