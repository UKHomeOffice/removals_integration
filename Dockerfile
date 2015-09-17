FROM quay.io/ukhomeofficedigital/nodejs:v1.0.0

ENV DB_HOST localhost
ENV DB_NAME removals
ENV DB_USER admin
ENV DB_PASSWORD rdspassword
ENV DB_PORT 3306

RUN cd /app/express/removals; bin/compile_templates.js
WORKDIR /app/express/removals
CMD ["/opt/nodejs/bin/node", "bin/www", "--build-data=y"]
