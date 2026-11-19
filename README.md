# CodingLiveExcersice - E-Solutions API

A clean, modular backend built with Node.js and TypeScript.

## Project Structure

```
CodingLiveExcersice/
├── src/
│   ├── data/
│   │   └── services.ts      # Services dataset (exported array)
│   ├── routes/
│   │   └── services.ts      # Route handler for /services
│   └── server.ts            # HTTP server & routing dispatcher
├── .gitignore
├── package.json
└── tsconfig.json
```

## Running the Server

```powershell
npm run dev
```

Visit:
- `http://127.0.0.1:3000/services` - List all services as JSON
- `http://127.0.0.1:3000/` - Welcome route
