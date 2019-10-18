#!/usr/bin/env bash

cd python-contestant || exit
python3 setup.py html

sudo sed -i 's/80/8081/g' /etc/apache2/ports.conf
sudo mv /var/www/html /var/www/html_old
sudo sudo ln -s /home/coder/project/python-contestant/docs_html /var/www/html
sudo apache2ctl start
dumb-init code-server -p "${CODE_SERVER_PORT:-8080}" --auth password
