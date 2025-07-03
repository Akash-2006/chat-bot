FROM denoland/deno:alpine

WORKDIR /app

COPY server.js .

RUN deno cache server.js

CMD ["run", "-A", "server.js"]

EXPOSE 8000

