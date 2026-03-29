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

### Run with Docker

```sh
docker build -t trello-randomizer .

docker run -p 8080:8080 \
  -e TRELLO_API_KEY=your_key \
  -e TRELLO_TOKEN=your_token \
  trello-randomizer
```

### Run with Deno

```sh
TRELLO_API_KEY=your_key TRELLO_TOKEN=your_token deno run --allow-net --allow-env main.ts
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
