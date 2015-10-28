FROM quay.io/ukhomeofficedigital/docker-centos-base

ENV DB_TYPE mysql
ENV DB_NAME removals
ENV DB_USER removals
ENV DB_PASS removals
ENV DB_HOST 127.0.0.1
ENV DB_PORT 3306
ENV NODE_ENV production

RUN mkdir -p /opt/nodejs /app

WORKDIR /opt/nodejs
RUN yum install -y curl git && \
    curl https://nodejs.org/dist/v4.0.0/node-v4.0.0-linux-x64.tar.gz | tar xz --strip-components=1
ENV PATH=${PATH}:/opt/nodejs/bin
WORKDIR /app

ONBUILD COPY . /app/
ONBUILD RUN rm -rf node_modules && npm install
ONBUILD RUN npm test

COPY entry-point.sh /entry-point.sh
ENTRYPOINT ["/entry-point.sh"]

EXPOSE 1337
CMD ["start"]
