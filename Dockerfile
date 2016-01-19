FROM quay.io/ukhomeofficedigital/centos-base

ENV DB_TYPE mysql
ENV DB_NAME removals
ENV DB_USER removals
ENV DB_PASS removals
ENV DB_HOST 127.0.0.1
ENV DB_PORT 3306
ENV NODE_ENV production

RUN rpm --rebuilddb && yum update -y && yum install -y curl git && yum clean all

RUN mkdir -p /opt/nodejs
WORKDIR /opt/nodejs
RUN curl https://nodejs.org/dist/v4.2.2/node-v4.2.2-linux-x64.tar.gz | tar xz --strip-components=1

RUN useradd app
USER app
ENV PATH=${PATH}:/opt/nodejs/bin
WORKDIR /home/app
COPY . .
RUN rm -rf node_modules
RUN npm --production=false install --no-optional
RUN NODE_ENV=development npm test
RUN npm prune --production

USER app
COPY entry-point.sh /entry-point.sh
ENTRYPOINT ["/entry-point.sh"]

EXPOSE 1337
CMD ["start"]
