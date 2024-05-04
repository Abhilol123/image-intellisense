FROM docker.io/nginx:1.19.1-alpine

COPY ./public /usr/share/nginx/html/
COPY ./deploy/nginx.conf.template /etc/nginx/conf.d/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
