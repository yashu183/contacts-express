FROM node
WORKDIR /usr/src/app
COPY . .
RUN npm i
CMD ["node", "app"]
EXPOSE 5555
