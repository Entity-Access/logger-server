# Version 1
FROM node:20-alpine3.19
RUN apk add --no-cache tini
VOLUME /var/lib/clamav
VOLUME /data
WORKDIR /app
COPY index.js ./
COPY src ./src
COPY package*.json ./
COPY dist ./dist
RUN npm install --omit=dev
ENV HOST 0.0.0.0
ENV PORT 80
ENV SELF_HOST true
EXPOSE 80
ENTRYPOINT ["/sbin/tini", "--", "npm", "start"]