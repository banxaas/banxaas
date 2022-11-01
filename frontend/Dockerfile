FROM node:14.18.0
WORKDIR /frontend/
COPY package*.json ./
RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install
COPY . ./