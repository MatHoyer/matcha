FROM node:22

WORKDIR /app

COPY . ./client

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]