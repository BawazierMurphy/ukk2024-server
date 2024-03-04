FROM node:20-alpine
# Create app directory
WORKDIR /usr/src/app/edgeFunctions

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install\
    && npm install typescript -g

COPY . .

RUN tsc

CMD [ "npm", "start" ]
