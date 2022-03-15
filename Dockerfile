FROM node:16.14.0-alpine3.15
RUN npm i togame -g
CMD [ "togame" ]