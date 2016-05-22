FROM node:6.2.0

# Add packages required to run electron
RUN apt-get update && \
    apt-get install -y libgtk2.0-0 libxtst6 libgconf-2-4 libnss3 libasound2

RUN npm install -g electron-prebuilt

COPY package.json /tmp
COPY main.js /tmp

ENTRYPOINT ["/usr/local/bin/electron", "/tmp"]
