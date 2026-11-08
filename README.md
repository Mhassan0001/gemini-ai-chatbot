# Gemini Chat API

**A small Node.js backend that turns a chat message into a Gemini reply.**
Send a prompt to the API; get a clean JSON response back.

## What it does

- Generates replies with Google's **Gemini 3.5 Flash-Lite** model.
- Exposes a `POST /api/chat` endpoint.
- Rejects empty or invalid messages before calling Gemini.
- Limits requests to **100 per 15 minutes** per client.
- Connects to MongoDB before starting the server.

## Get started

You will need Node.js, a MongoDB connection string, and a Gemini API key to
run the backend locally.

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   MONGO_URI=your_mongodb_connection_string
   PORT=9000
   ```

   `PORT` is optional; the server defaults to `9000`. Keep `.env` private and
   never commit real credentials.

3. Start the development server:

   ```bash
   npm run dev
   ```

   The API starts after it connects to MongoDB. If the database connection
   fails, the server exits with an error.

## Run with Docker Compose

Docker Compose starts the backend and MongoDB together. Create a `.env` file
in the project root with your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The Compose configuration supplies the MongoDB connection string for the
backend. The `.env` file is still required by Compose and should not be
committed.

Build and start the services:

```bash
docker compose up --build
```

The API is available at `http://localhost:9000`. MongoDB data is stored in the
`mongo_data` Docker volume and is retained when the services are stopped.
Stop the services with:

```bash
docker compose down
```

## API routes

### `GET /`

Health check. Returns a short message when the server is running:

```json
{
  "msg": "Server Running Successfully....."
}
```

### `POST /api/chat`

Generate a Gemini reply. Send JSON with a non-empty `message`:

```bash
curl -X POST http://localhost:9000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Give me one idea for a tiny weekend project.\"}"
```

On success, the API responds with **200 OK**:

```json
{
  "success": true,
  "reply": "..."
}
```

An empty or non-string `message` returns **400 Bad Request**. If Gemini cannot
generate a reply, the API returns **500 Internal Server Error**. Requests are
limited to 100 per 15 minutes per client.

## Project map

```text
src/
├── config/        # MongoDB connection and rate limit
├── controller/    # Chat request validation and response
├── middleware/    # Error handling helpers
├── routes/        # API route definitions
├── service/       # Gemini response generation
└── index.js       # Express app setup and server startup
```

## Notes

- The frontend CORS origin is currently set to `http://localhost:5173`.
- `npm test` is not configured yet.
