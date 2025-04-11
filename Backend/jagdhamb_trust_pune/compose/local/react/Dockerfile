# Use the latest LTS version of Node.js
FROM node:23-alpine

ARG BUILD_ENVIRONMENT=local
ARG APP_HOME=/app
ENV BUILD_ENV=${BUILD_ENVIRONMENT}
 
# Copy the rest of your application files
COPY . ${APP_HOME}

# Set the working directory inside the container
WORKDIR ${APP_HOME}/front-end/jagdhamb

RUN rm -rf node_modules
RUN npm install --force

# Expose the port your app runs on
EXPOSE 3000

COPY ./compose/local/react/start /start

RUN sed -i 's/\r$//g' /start
RUN chmod +x /start