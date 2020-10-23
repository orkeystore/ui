FROM node:alpine

COPY ./ /orkeystore-ui/
WORKDIR /orkeystore-ui/

RUN npm install
EXPOSE 3000

CMD ["npm", "run", "bootstrap"]