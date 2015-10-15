FROM quay.io/ukhomeofficedigital/nodejs:v1.0.0

ENV DB_TYPE mysql
ENV DB_NAME removals
ENV DB_USER removals
ENV DB_PASS removals
ENV DB_HOST 127.0.0.1
ENV DB_PORT 3306
ENV NODE_ENV production

RUN npm test

CMD ["npm start"]
