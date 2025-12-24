FROM ubuntu:latest

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y apache2 python3 python3-pip \
 && pip3 install --no-cache-dir --break-system-packages uwsgi Beaker

COPY . /var/www/html/

EXPOSE 80

CMD ["uwsgi", "--http", "0.0.0.0:80", "--wsgi-file", "/var/www/html/app.py", "--callable", "application"]