FROM debian:jessie
MAINTAINER Jonathan Pagel <pagel@pobox.com>

RUN apt-get update \
    && apt-get install -y --force-yes \
        build-essential \
        curl \
        rlwrap \
        git

RUN curl https://deb.nodesource.com/node/pool/main/n/nodejs/nodejs_0.10.30-1nodesource1~wheezy1_amd64.deb > node.deb \
    && dpkg -i node.deb \
    && rm node.deb

RUN mkdir /webapp
ADD ./ /webapp/ 
ENV PATH /webapp/node_modules/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin

