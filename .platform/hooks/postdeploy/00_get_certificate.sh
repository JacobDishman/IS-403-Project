#!/usr/bin/env bash
# .platform/hooks/postdeploy/00_get_certificate.sh
sudo certbot -n -d http://cal-endure.is404.net/ --nginx --agree-tos --email nblake1@byu.edu