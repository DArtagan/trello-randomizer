const TRELLO_BASE = "https://api.trello.com";

const apiKey = Deno.env.get("TRELLO_API_KEY");
const token = Deno.env.get("TRELLO_TOKEN");

if (!apiKey || !token) {
  console.error("TRELLO_API_KEY and TRELLO_TOKEN environment variables are required");
  Deno.exit(1);
}

const authParams = `key=${apiKey}&token=${token}`;

interface TrelloBoard {
  id: string;
  name: string;
}

interface TrelloList {
  id: string;
  pos: number;
}

interface TrelloCard {
  name: string;
}

async function trelloFetch<T>(path: string, signal?: AbortSignal | null): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${TRELLO_BASE}${path}${sep}${authParams}`;
  const res = await fetch(url, { signal: signal ?? undefined });
  if (!res.ok) {
    throw new Error(`trello API error: ${res.status}`);
  }
  return await res.json();
}

async function findBoard(name: string, signal?: AbortSignal | null): Promise<string> {
  const boards = await trelloFetch<TrelloBoard[]>("/1/members/me/boards?fields=name", signal);
  const board = boards.find((b) => b.name.toLowerCase() === name.toLowerCase());
  if (!board) {
    throw new NotFoundError(`board not found: ${name}`);
  }
  return board.id;
}

async function getFirstList(boardId: string, signal?: AbortSignal | null): Promise<string> {
  const lists = await trelloFetch<TrelloList[]>(`/1/boards/${boardId}/lists?filter=open`, signal);
  if (lists.length === 0) {
    throw new NotFoundError("board has no lists");
  }
  lists.sort((a, b) => a.pos - b.pos);
  return lists[0].id;
}

async function getCards(listId: string, signal?: AbortSignal | null): Promise<string[]> {
  const cards = await trelloFetch<TrelloCard[]>(`/1/lists/${listId}/cards?fields=name`, signal);
  if (cards.length === 0) {
    throw new NotFoundError("no cards in first list");
  }
  return cards.map((c) => c.name);
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const boardName = decodeURIComponent(url.pathname.slice(1));

  if (!boardName) {
    return new Response("board name required: use GET /{board-name}\n", { status: 400 });
  }

  if (req.method !== "GET") {
    return new Response("method not allowed\n", { status: 405 });
  }

  try {
    const boardId = await findBoard(boardName, req.signal);
    const listId = await getFirstList(boardId, req.signal);
    const cards = await getCards(listId, req.signal);
    const pick = cards[Math.floor(Math.random() * cards.length)];
    return new Response(pick + "\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return new Response(err.message + "\n", { status: 404 });
    }
    console.error(err);
    const message = err instanceof Error ? err.message : "unexpected error";
    return new Response(message + "\n", { status: 502 });
  }
}

const port = Number(Deno.env.get("PORT") || "8080");
console.log(`Listening on :${port}`);
Deno.serve({ port }, handler);
