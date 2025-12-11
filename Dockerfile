FROM ubuntu:latest

MAINTAINER Grupo Docente de Aplicaciones con Tecnología Internet UCV

RUN apt-get update -y && DEBIAN_FRONTEND=noninteractive apt-get install -y apache2 net-tools

EXPOSE 80

COPY . /var/www/html/

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]