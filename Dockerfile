FROM quay.io/ukhomeofficedigital/centos-base

ENV DB_TYPE mysql
ENV DBNAME removals
ENV DBUSER removals
ENV DBPASS removals
ENV DBHOST 127.0.0.1
ENV DBPORT 3306
ENV NODE_ENV production
ENV LOG_QUERIES 'true'

RUN rpm --rebuilddb && yum update -y && yum install -y curl git which && yum clean all && rm -rf /var/cache/yum/ /var/lib/rpm/__db*

RUN mkdir -p /opt/nodejs
WORKDIR /opt/nodejs
RUN curl https://nodejs.org/dist/v4.4.7/node-v4.4.7-linux-x64.tar.gz | tar xz --strip-components=1

RUN useradd app
USER app
ENV PATH=${PATH}:/opt/nodejs/bin
WORKDIR /home/app
RUN mkdir -p /home/app/coverage
RUN mkdir -p /home/app/.tmp


ADD package.json package.json
ADD npm-shrinkwrap.json npm-shrinkwrap.json
RUN npm --production=false install --no-optional

COPY . .
RUN NODE_ENV=development npm run lint
RUN NODE_ENV=development npm test
RUN npm prune --production

USER app
COPY entry-point.sh /entry-point.sh
ENTRYPOINT ["/entry-point.sh"]

EXPOSE 1337
CMD ["start"]
