FROM denoland/deno:latest AS build
WORKDIR /app
COPY main.ts .
RUN deno compile --allow-net --allow-env --output /app/trello-randomizer main.ts

FROM denoland/deno:distroless
COPY --from=build /app/trello-randomizer /trello-randomizer
EXPOSE 8080
ENTRYPOINT ["/trello-randomizer"]
