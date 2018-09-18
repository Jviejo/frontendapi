FROM node:8.9.1 AS build-env
WORKDIR /app
ADD package-lock.json /app
ADD package.json /app
RUN npm i
ADD app.js /app
ADD public /app/public
ADD storage /app/storage



FROM gcr.io/distroless/nodejs
COPY --from=build-env /app /app
WORKDIR /app
ENV NODE_ENV=production
CMD ["/app/app.js"]
