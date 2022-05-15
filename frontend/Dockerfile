FROM node:latest
WORKDIR /code/frontend/
COPY . .
RUN npm install --save-dev -g @angular/cli
RUN npm install --save-dev @angular-devkit/build-angular
RUN npm install
RUN ng update