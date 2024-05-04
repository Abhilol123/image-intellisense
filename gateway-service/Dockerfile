FROM docker.io/node:20.4.0-alpine

WORKDIR /app

COPY . .
RUN cd ./APIHelper && npm i && cd ../
RUN npm i

ENV PGHOST="postgres-db"
ENV REDIS_HOST="redis-db"
ENV UPLOAD_SERVICE_HOST="upload-service"
ENV ML_SERVICE_HOST="ml-service"

CMD ["node", "index.js"]
