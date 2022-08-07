FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm i
EXPOSE 5555
CMD ["node", "app"]
