1) build the docker image:
docker build -t ho:ri .

2) run the container:
docker run -d -w /webapp -p 8888:8888 ho:ri node /webapp/node/index.js
