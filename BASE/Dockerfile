FROM node:10.13

# Create app directory
WORKDIR /usr/src/app

# Bundle app src
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 221

CMD [ "npm", "start" ]