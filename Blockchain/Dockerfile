# get baseimage and set node version and use alphine becouse of alphine create small image.
FROM node:16-alpine
# set working directory so over deta store this ditrctory
WORKDIR /BLOCKCHAIN
# push package.json to docker directory root>BLOCKCHAIN>
COPY package.json .
# fist copy package.json and then write npm i comand so npm i note run every time buil image it used cresed data and if we change package.json then it run it.
RUN npm install

# push deta to docker directory root>BLOCKCHAIN>
COPY . .



# mapping port local 3000 to docker 3001. 
# docker container run -d -p 3000:3001 blockchain
EXPOSE 3000

# below comand use start server but is open new terminal 
# CMD npm start

# we use bellow comand to start server becouse this comand not open new terminal
CMD [ "npm","run","node_1"]

# then we build our doker image

