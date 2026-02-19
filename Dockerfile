# syntax=docker/dockerfile:1
FROM node:lts as angular
WORKDIR /ng-app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=angular /ng-app/dist/pmmcs-frontend/browser /usr/share/nginx/html
EXPOSE 80
