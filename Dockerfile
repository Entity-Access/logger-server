# Version 1
FROM node:20-alpine3.19
VOLUME /var/lib/clamav
VOLUME /data
WORKDIR /app
COPY package*.json ./
COPY dist ./dist
COPY src ./src
COPY index.js ./
RUN npm install --omit=dev
ENV HOST 0.0.0.0
ENV PORT 80
ENV SELF_HOST true
EXPOSE 80 443 25
ENTRYPOINT ["/sbin/tini", "--", "npm", "start"]