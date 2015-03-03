1) build the docker image:
docker build -t ho:ri .

2) run the container:
docker run -e "DB_USER=me" -e "DB_PASSWORD=swordfish" -e "DB_NAME=ri_env" -e "DB_HOST=localhost" -d -w /webapp -p 8888:8888 ho:ri node /webapp/node/index.js
