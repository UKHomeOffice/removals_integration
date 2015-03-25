FROM ubuntu
MAINTAINER Jonathan Pagel <pagel@pobox.com>

RUN apt-get update &&  apt-get install aptitude -y
RUN aptitude update && aptitude install build-essential curl rlwrap git -y

RUN curl https://deb.nodesource.com/node/pool/main/n/nodejs/nodejs_0.10.30-1nodesource1~wheezy1_amd64.deb > node.deb \
    && dpkg -i node.deb \
    && rm node.deb

RUN mkdir /webapp
ADD ./ /webapp/
RUN cd /webapp/express/removals; npm install; node bin/compile_templates.js
ENV PATH /webapp/express/removals/node_modules/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin
