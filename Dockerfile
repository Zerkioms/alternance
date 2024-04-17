FROM docker-proxy.dsi-registry.univ-lr.fr/node:14@sha256:a97048059988c65f974b37dfe25a44327069a0f4f81133624871de0063b98075

WORKDIR /linx-backend
COPY app app
COPY server.js .
COPY package.json .
RUN npm install
CMD ["node", "server.js"]
