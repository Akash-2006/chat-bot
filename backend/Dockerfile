FROM denoland/deno:alpine

WORKDIR /app

COPY server.js .

RUN deno cache server.js

CMD ["run", "-A", "server.js"]

EXPOSE 8000

ENV OPENROUTER_API_KEY=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