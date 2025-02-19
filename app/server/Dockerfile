FROM node:22

WORKDIR /app/server

COPY package*.json .

RUN npm i

EXPOSE 3000

CMD ["npm", "run", "dev"]