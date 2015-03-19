#!/bin/sh
#after docker build -t ho/removals
docker run -t -d -p 3000:3000 -e "DB_USER=root" -e "DB_PASSWORD=ntiyttls" -e "DB_HOST=localhost" -e "DB_NAME=dt_removal_development" homo/removals /webapp/bin/www
