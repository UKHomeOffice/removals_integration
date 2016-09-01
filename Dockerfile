FROM node:4-slim
RUN apt-get update && apt-get install -y git
ENV DB_TYPE mysql
ENV DBNAME removals
ENV DBUSER removals
ENV DBPASS removals
ENV DBHOST 127.0.0.1
ENV DBPORT 3306
ENV LOG_QUERIES 'true'

RUN mkdir -p /app/coverage /app/.tmp
WORKDIR /app

RUN git config --global url."https://".insteadOf git://

COPY . .

RUN npm --production=false -q install --no-optional \
  && npm run lint \
  && npm test \
  && npm prune --production

ENTRYPOINT ["./entry-point.sh"]
ENV NODE_ENV production

EXPOSE 1337
CMD ["start"]
