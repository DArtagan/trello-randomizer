# trello-randomizer

Return a random card from a Trello board.

A stateless web app that picks a random card from the first (leftmost) list on a Trello board and returns its title as plain text.

## Setup

### Trello API Credentials

You need both an API key and a token:

1. Go to https://trello.com/power-ups/admin and create/select a Power-Up
2. Navigate to the **API Key** tab to get your key
3. Use the key to generate a token by visiting:
   ```
   https://trello.com/1/authorize?expiration=never&scope=read&response_type=token&key=YOUR_API_KEY
   ```

### Run from GitHub Container Registry

A pre-built image is published to GitHub Packages on every push to `main`:

```sh
docker run -p 8080:8080 \
  -e TRELLO_API_KEY=your_key \
  -e TRELLO_TOKEN=your_token \
  ghcr.io/dartagan/trello-randomizer:latest
```

### Run with Docker Compose

```sh
docker compose up --build
```

Credentials are read from the environment. With devenv, add them to `.envrc.local` (gitignored):

```sh
export TRELLO_API_KEY=your_key
export TRELLO_TOKEN=your_token
```

### Run with Deno

Deno is provided via devenv. Enter the environment, then:

```sh
deno run --allow-net --allow-env main.ts
```

## Usage

```sh
curl http://localhost:8080/My%20Board%20Name
```

Returns a random card title from the first list on that board, as plain text.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TRELLO_API_KEY` | Yes | Trello API key |
| `TRELLO_TOKEN` | Yes | Trello API token |
| `PORT` | No | Server port (default: `8080`) |
