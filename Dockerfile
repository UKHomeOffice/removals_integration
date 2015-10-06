FROM quay.io/ukhomeofficedigital/nodejs-base:v1.0.0

RUN npm install

CMD npm start
