FROM node:10
WORKDIR /usr/src/node
COPY package.json ./
COPY ./ ./
RUN ls -la
RUN pwd
RUN npm i
EXPOSE 3000
CMD ["node", "app.js"]