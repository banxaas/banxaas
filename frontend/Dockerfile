FROM node:latest
WORKDIR /frontend/
COPY package*.json ./
RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install
COPY . ./