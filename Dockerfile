FROM node

RUN npm install -g http-server

WORKDIR /diploma-hub-client

COPY package*.json ./

RUN npm install

COPY . .

#RUN pwd && ls
#RUN echo "$PWD"
#
#RUN npm run build

#EXPOSE 3000
#CMD [ "http-server", "dist" ]
CMD ["npm", "run", "start"]