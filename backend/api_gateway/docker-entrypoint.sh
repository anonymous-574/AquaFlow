#!/bin/sh
set -eu

: "${AUTH_SERVICE_HOST:=auth_service}"
: "${SUPPLIER_SERVICE_HOST:=supplier_service}"
: "${BOOKING_SERVICE_HOST:=booking_service}"
: "${GAMIFICATION_SERVICE_HOST:=gamification_service}"
: "${IOT_ANALYTICS_SERVICE_HOST:=iot_analytics_service}"

envsubst '${AUTH_SERVICE_HOST} ${SUPPLIER_SERVICE_HOST} ${BOOKING_SERVICE_HOST} ${GAMIFICATION_SERVICE_HOST} ${IOT_ANALYTICS_SERVICE_HOST}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
