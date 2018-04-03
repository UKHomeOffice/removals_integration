FROM quay.io/ukhomeofficedigital/nodejs-base:v6.9.1

ENV DB_TYPE mysql
ENV DBNAME removals
ENV DBUSER removals
ENV DBPASS removals
ENV DBHOST 127.0.0.1
ENV DBPORT 3306
ENV NODE_ENV debug
ENV LOG_QUERIES 'true'

RUN yum install -y git which && yum clean all

RUN useradd app
USER app
ENV PATH=${PATH}:/opt/nodejs/bin
WORKDIR /home/app
RUN mkdir -p /home/app/coverage
RUN mkdir -p /home/app/.tmp

RUN git config --global url."https://".insteadOf git://

COPY package.json npm-shrinkwrap.json ./
RUN npm --production=false install --no-optional

COPY . .
RUN NODE_ENV=development npm run lint && \
    NODE_ENV=development npm test && \
    npm prune --production

ENTRYPOINT ["/home/app/entry-point.sh"]

EXPOSE 1337
CMD ["start"]
