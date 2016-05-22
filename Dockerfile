FROM node:6.2.0

COPY package.json /tmp
COPY main.js /tmp

RUN npm install -g electron-prebuilt

CMD ["electron /tmp"]
