FROM csighub.tencentyun.com/sysauditor/nginx:1.17.6-alpine
COPY docker/sysauditor.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/html
EXPOSE 8052
