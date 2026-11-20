# Build E-Solutions: The Clean Architecture Guide

A step-by-step companion book explaining every single concept, line of code, and architectural decision we made while building the modular E-Solutions API from scratch.

---

## Table of Contents

1. [Why We Started Over: The Maintainability Problem](#chapter-1-why-we-started-over-the-maintainability-problem)
2. [Project Identity: `package.json`](#chapter-2-project-identity-packagejson)
3. [Understanding Versions: SemVer](#chapter-3-understanding-versions-semver)
4. [Connecting Code with ES Modules: `"type": "module"`](#chapter-4-connecting-code-with-es-modules-typemodule)
5. [The Development Tools: TypeScript, tsx, and @types/node](#chapter-5-the-development-tools-typescript-tsx-and-typesnode)
6. [Demystifying `"scripts"`: Terminal Speed-Dial](#chapter-6-demystifying-scripts-terminal-speed-dial)
7. [TypeScript vs JavaScript: The Safety Checker](#chapter-7-typescript-vs-javascript-the-safety-checker)
8. [Configuring the Checker: `tsconfig.json`](#chapter-8-configuring-the-checker-tsconfigjson)
9. [Separation of Concerns: The 3 Jobs of a Backend](#chapter-9-separation-of-concerns-the-3-jobs-of-a-backend)
10. [The Data Layer: `src/data/services.ts`](#chapter-10-the-data-layer-srcdataservicests)
11. [The Route Layer: `src/routes/services.ts`](#chapter-11-the-route-layer-srcroutesservicests)
12. [JSON & HTTP Headers: How Browsers Understand Data](#chapter-12-json--http-headers-how-browsers-understand-data)
13. [The Server Dispatcher: `src/server.ts`](#chapter-13-the-server-dispatcher-srcserverts)
14. [The Lifecycle of a Request: The Phone Call Analogy](#chapter-14-the-lifecycle-of-a-request-the-phone-call-analogy)
15. [Why `return;` Matters: Preventing Double Answers](#chapter-15-why-return-matters-preventing-double-answers)
16. [Git & GitHub: Snapshots, `.gitignore`, and Repositories](#chapter-16-git--github-snapshots-gitignore-and-repositories)
17. [URL Query Parameters & Search Params](#chapter-17-url-query-parameters--search-params)
18. [Case-Insensitive & Partial Matching (`.toLowerCase()` and `.includes()`)](#chapter-18-case-insensitive--partial-matching-tolowercase-and-includes)
19. [Filter Chaining: Sieve Pipeline Architecture](#chapter-19-filter-chaining-sieve-pipeline-architecture)
20. [Plucking a Single Record: `.find()` vs `.filter()`](#chapter-20-plucking-a-single-record-find-vs-filter)
21. [Creating Data with `POST`: Modern Async Streams & Persistence](#chapter-21-creating-data-with-post-modern-async-streams--persistence)
22. [SQLite Database Persistence & `DELETE` Operations](#chapter-22-sqlite-database-persistence--delete-operations)

---

## Chapter 1: Why We Started Over: The Maintainability Problem

In our earlier experiment, `server.ts` grew into 138 lines containing:
- Fixed test data
- Data validation
- Multiple URL decoders
- Startup price loops
- Function declarations
- Route checks
- HTTP listening

When everything is in one file:
- Variables accidentally leak across different parts of the code.
- You can't change the way services are stored without risking breaking the HTTP server.
- Errors become confusing because it is unclear *which* layer caused them.

**The Solution:** Build modular software from day one where each file has **one job and one job only**.

---

## Chapter 2: Project Identity: `package.json`

Every Node.js project starts with a single file: `package.json`.

```json
{
  "name": "CodingLiveExcersice",
  "version": "1.0.0",
  "private": true
}
```

### Read each line:
- `{` starts a JSON object.
- `"name": "CodingLiveExcersice"`: The project identifier.
- `"version": "1.0.0"`: The starting version label.
- `"private": true`: Tells npm **never** to publish this project publicly to the npm package registry. It is a safety lock for your private code.
- `}` ends the JSON object.

> [!NOTE]
> JSON is strict: keys and strings must use double quotes `""`, and you cannot put a comma after the final property.

---

## Chapter 3: Understanding Versions: SemVer

Software version numbers follow **Semantic Versioning (SemVer)** formatted as `MAJOR.MINOR.PATCH`:

$$\text{Version} = \text{Major} \,.\, \text{Minor} \,.\, \text{Patch}$$

```
 1  .  0  .  0
 │     │     └── PATCH: Small bug fixes (nothing new added, nothing breaks)
 │     └──────── MINOR: New features added (backwards-compatible)
 └────────────── MAJOR: Breaking changes (old code or clients may break)
```

- When you start a brand new project, you begin at `1.0.0`.
- If you fix a typo in a service price: `1.0.1`.
- If you add a new route `/bookings`: `1.1.0`.
- If you completely rewrite how clients talk to the API: `2.0.0`.

---

## Chapter 4: Connecting Code with ES Modules: `"type": "module"`

By default, Node.js uses an older module system called **CommonJS** (`require` / `module.exports`).

Modern JavaScript and TypeScript use **ECMAScript Modules (ES Modules)** (`import` / `export`).

Adding this line to `package.json`:
```json
"type": "module"
```
tells Node.js: *"Treat all files in this project as modern ES modules."*

This allows us to write clean statements like:
```ts
import { createServer } from "node:http";
import { services } from "../data/services";
```

---

## Chapter 5: The Development Tools: TypeScript, tsx, and @types/node

We installed three development packages:
```powershell
npm install --save-dev typescript tsx @types/node
```

### Why `--save-dev`?
- **Runtime dependencies** are tools needed to run the software in production (like a database driver).
- **Development dependencies** (`--save-dev`) are tools you only need on your machine while programming (the compiler, the test runner, type definitions).

### The Three Tools Explained:

| Tool | Purpose |
|---|---|
| `typescript` | The official TypeScript compiler (`tsc`). It checks your code for mistakes and validates types. |
| `tsx` | "TypeScript Execute". Node.js cannot run `.ts` files on its own. `tsx` strips the TypeScript checks on the fly and immediately runs the code with Node. |
| `@types/node` | A dictionary of definitions that explains Node's built-in features (like `http`, `process`, and `console`) to TypeScript. |

---

## Chapter 6: Demystifying `"scripts"`: Terminal Speed-Dial

In `package.json`, we created:
```json
"scripts": {
    "dev": "tsx watch src/server.ts"
}
```

### What is `"scripts"` really?
It is simply a list of **shortcuts (speed-dial buttons)** for terminal commands.

Without this script, every time you want to start your server, you would have to remember and type:
```powershell
npx tsx watch src/server.ts
```

With the script configured, running:
```powershell
npm run dev
```
causes `npm` to look inside `package.json`, find `"dev"`, and run `tsx watch src/server.ts`.

### What does `watch` do?
The `watch` flag tells `tsx`: *"Keep running. Whenever Peter edits and saves any file in `src/`, automatically restart the server with the new changes."*

---

## Chapter 7: TypeScript vs JavaScript: The Safety Checker

- **JavaScript (`.js`)** is the language computers actually run.
- **TypeScript (`.ts`)** is JavaScript with a **compile-time safety net**.

### Practical E-Solutions Example:

In plain JavaScript:
```js
function calculateTotal(price) {
    return price + 10;
}

calculateTotal("two hundred");
// Runs without warning! Produces "two hundred10" and customer is billed incorrectly.
```

In TypeScript:
```ts
function calculateTotal(price: number) {
    return price + 10;
}

calculateTotal("two hundred");
// ❌ Red squiggly line in your editor immediately:
// "Argument of type 'string' is not assignable to parameter of type 'number'."
```

TypeScript catches the bug while you are typing before any customer ever touches your website.

---

## Chapter 8: Configuring the Checker: `tsconfig.json`

`tsconfig.json` configures how TypeScript examines your code:

```json
{
    "compilerOptions": {
        "strict": true
    },
    "exclude": [
        "node_modules"
    ]
}
```

### What each setting means:
- `"strict": true`: Turns on the strictest level of type safety. It prevents variables from unexpectedly being `null` or `undefined` and requires valid types across your codebase.
- `"exclude": ["node_modules"]`: Tells TypeScript to ignore the installed library files. We didn't write `node_modules`, and checking millions of lines of third-party code would needlessly slow down your editor.

---

## Chapter 9: Separation of Concerns: The 3 Jobs of a Backend

To keep code maintainable, we broke the project into 3 distinct jobs:

```
src/
├── data/services.ts      ← JOB 1: Holds and manages data
├── routes/services.ts    ← JOB 2: Handles customer HTTP requests for services
└── server.ts             ← JOB 3: Starts the server and directs traffic (dispatcher)
```

When a real database (PostgreSQL, SQLite, D1) is added later:
- `data/services.ts` connects to the database.
- `routes/services.ts` remains mostly unchanged.
- `server.ts` does not care where data comes from — its only job is answering the network.

---

## Chapter 10: The Data Layer: `src/data/services.ts`

```ts
export const services = [
    { name: "service1", price: 25, category: "Category1" },
    { name: "service2", price: 50, category: "Category2" },
    ...
];
```

### Key Concepts:

1. **`export` keyword**: In modern ES Modules, variables inside a file are private to that file by default. Writing `export` puts the variable in the "public window" so other files can bring it in with `import`.
2. **Array `[ ... ]` vs Object `{ ... }`**:
   - An **Object** `{ a: 1, b: 2 }` is a dictionary of specific keys.
   - An **Array** `[ { ... }, { ... } ]` is an ordered list.
   - Because services are a collection that we need to count (`.length`), loop through (`for ... of`), and filter by price, an **Array of Objects** is the correct data structure.

---

## Chapter 11: The Route Layer: `src/routes/services.ts`

```ts
import { services } from "../data/services";

export function handleServicesRoute(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(services));
}
```

### Read each line:
1. `import { services } from "../data/services"`: 
   - `..` moves up one folder (from `src/routes` into `src`).
   - `/data/services` moves into `src/data/services.ts`.
2. `export function handleServicesRoute(req, res)`:
   - Exports a dedicated function that accepts the incoming request (`req`) and the outgoing response tool (`res`).
3. `res.setHeader(...)`: Explains the format of the data to the browser.
4. `res.end(...)`: Sends the data and finishes the conversation.

---

## Chapter 12: JSON & HTTP Headers: How Browsers Understand Data

### Why can't we do `res.end(services)`?
Node's `res.end()` only understands **text (strings)** or binary streams (`Buffer`). If you pass a raw JavaScript object or array, Node throws:
```text
TypeError: The "chunk" argument must be of type string or an instance of Buffer
```

To convert our JavaScript array into a readable text format, we use:
```ts
JSON.stringify(services)
```
This turns `[{ name: "service1", price: 25 }]` into the string `'[{"name":"service1","price":25}]'`.

### What does the header do?
```ts
res.setHeader("Content-Type", "application/json");
```
By default, browsers assume server responses are plain text or HTML. This header tells the browser: *"This text is formatted as JSON data — parse and colorize it accordingly."*

---

## Chapter 13: The Server Dispatcher: `src/server.ts`

```ts
import { createServer } from "node:http";
import { handleServicesRoute } from "./routes/services";

const server = createServer((req, res) => {
    let pathName = req.url;
    console.log("Request received for path: " + pathName + " " + req.method);

    if (pathName === "/") {
        res.setHeader("Content-Type", "text/plain");
        res.end("Welcome to E-Solutions API");
        return;
    }

    if (pathName === "/services") {
        handleServicesRoute(req, res);
        return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>404 Not Found</h1>");
});

server.listen(3000, "127.0.0.1", () => {
    console.log("E-Solutions API is running on http://127.0.0.1:3000");
});
```

### The Three Steps to Any Server:
1. **Import the factory**: `import { createServer } from "node:http";`
2. **Build the server**: `const server = createServer(...)`
3. **Turn it on**: `server.listen(3000, "127.0.0.1", callback)`

---

## Chapter 14: The Lifecycle of a Request: The Phone Call Analogy

Think of an HTTP server like a company telephone switchboard:

1. **The Call Arrives (`req`)**: A customer dials your number and asks for `/services`.
2. **The Switchboard (`server.ts`)**: Looks at the requested extension (`req.url`).
3. **The Transfer (`handleServicesRoute`)**: Passes the customer directly to the Services department.
4. **Hanging Up (`res.end()`)**: 
   - If you do not call `res.end()`, the customer stays on hold forever (the browser tab spins endlessly).
   - Once `res.end()` is called, the conversation is complete.

---

## Chapter 15: Why `return;` Matters: Preventing Double Answers

In JavaScript, finishing a response with `res.end()` **does not stop the function from executing subsequent lines of code**.

Look at this trap:
```ts
if (pathName === "/services") {
    handleServicesRoute(req, res);
    // Without return, JavaScript keeps reading downwards!
}

res.end("<h1>404 Not Found</h1>"); // 💥 CRASH!
```

If JavaScript reaches the second `res.end`, Node crashes with:
```text
ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client
```

Adding `return;` immediately exits the callback:
```ts
if (pathName === "/services") {
    handleServicesRoute(req, res);
    return; // 🛑 Stop here! We are finished with this request.
}
```

---

## Chapter 16: Git & GitHub: Snapshots, `.gitignore`, and Repositories

### What is Git?
Git takes timestamped snapshots (commits) of your project so you can review changes or rewind mistakes.

### Why `.gitignore` is Essential:
We created `.gitignore` containing:
```
node_modules/
```
`node_modules` can contain tens of thousands of installed files. It must never be committed to Git because:
1. It is gigantic.
2. Anyone who clones your code can rebuild `node_modules` instantly by running `npm install`.

### Organizations on GitHub:
- Personal accounts: `github.com/meriapetermeria-bit/<repo>`
- Organization accounts: `github.com/PECAB-LTD/<repo>`

We transferred our repository to your organization **PECAB-LTD**:
🔗 **[https://github.com/PECAB-LTD/CodingLiveExcersice](https://github.com/PECAB-LTD/CodingLiveExcersice)**

---

## Chapter 17: URL Query Parameters & Search Params

When visitors request data from a web API, they often want to customize what they see without changing the base path:

```
http://127.0.0.1:3000/services?budget=75&category=Jewelery
                      ▲       ▲
                      │       └── Query Parameters: Starts with '?'
                      └────────── Path Name: The resource requested
```

### Reading Parameters in Node.js
Using the standard `new URL(req.url, "http://127.0.0.1:3000")`:
- `address.pathname`: Extracts the pure path (`"/services"`), stripping away all queries.
- `address.searchParams.get("key")`: Retrieves the value of a specific parameter.
  - If present: returns the text (e.g. `"75"`).
  - If missing: returns `null`.
  - Automatically decodes URL encodings (like `%20` or `+` into spaces `" "`).

---

## Chapter 18: Case-Insensitive & Partial Matching (`.toLowerCase()` and `.includes()`)

Real human customers do not search with perfect capitalization or exact full titles:
- A customer might type `category=jewelry` or `category=JEWELRY`.
- A customer might type `name=phone` expecting to find `"Iphone 18 Pro"`.

### 1. Case-Insensitive Matching
By converting **both** sides of a comparison to lowercase, case differences disappear:
```ts
service.category.toLowerCase() === categoryText.toLowerCase()
```

### 2. Partial Search with `.includes()`
The `.includes()` string method checks if a substring exists anywhere inside another string:
```ts
service.name.toLowerCase().includes(serviceNameText.toLowerCase())
```
- Searching `"phone"` matches `"Iphone 18 Pro"`.
- Searching `"ring"` matches `"Gold Ring"`.

---

## Chapter 19: Filter Chaining: Sieve Pipeline Architecture

A major trap when writing multiple filters is putting `res.end()` and `return;` inside every `if` block:

```ts
// ❌ TRAP: Whichever if matches first exits the function immediately!
if (categoryText !== null) { ... res.end(); return; }
if (budgetText !== null)   { ... res.end(); return; }
```
When written with early returns, querying `?category=Jewelery&budget=130` will **only** run the category filter and completely ignore the budget!

### The Solution: The Sieve Pipeline
Instead of returning immediately, we maintain a mutable `results` variable that starts with all records and is progressively narrowed down by each active filter:

```ts
let results = services;

// Sieve 1: Narrow down by category
if (categoryText !== null) {
    results = results.filter(s => s.category.toLowerCase() === categoryText.toLowerCase());
}

// Sieve 2: Narrow down surviving results by budget
if (budgetText !== null) {
    const budget = Number(budgetText);
    results = results.filter(s => s.price <= budget);
}

// Sieve 3: Narrow down surviving results by name search
if (serviceNameText !== null) {
    results = results.filter(s => s.name.toLowerCase().includes(serviceNameText.toLowerCase()));
}

// Single Response: Send the final survivors
res.end(JSON.stringify(results));
return;
```

---

## Chapter 20: Plucking a Single Record: `.find()` vs `.filter()`

Every database item should have a unique, permanent identifier (`id`).

| Tool | Purpose | What it Returns |
|---|---|---|
| **`.filter(...)`** | Searches the whole collection for all matches. | Always an **Array** `[ { ... } ]`, even if only 1 item matches. |
| **`.find(...)`** | Stops at the first match and plucks that item. | The **Single Object** `{ ... }` directly (or `undefined`). |

### The Emergency Door Pattern for ID Lookups:
Because `.find()` returns a single object rather than an array, subsequent `.filter()` calls will crash (`TypeError: results.filter is not a function`).

Therefore, single-item lookups require an immediate exit door:
```ts
if (serviceIdText !== null) {
    const serviceId = Number(serviceIdText);
    const item = services.find(s => s.id === serviceId);

    if (item) {
        res.end(JSON.stringify(item));
        return; // 🚪 Send item and exit immediately
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Service not found" }));
        return; // 🚪 Send 404 and exit immediately
    }
}
```

---

## Chapter 21: Creating Data with `POST`: Modern Async Streams & Persistence

So far, our API has only read existing data (`GET`). Real applications also need to accept submissions from clients—such as booking an appointment or creating a new service item (`POST`).

### 1. `GET` vs `POST`: Where Data Travels
- In a **`GET`** request, parameters travel in the public URL bar (`?budget=75`).
- In a **`POST`** request, data travels inside the **HTTP Request Body** (the payload parcel).

### 2. Modern Asynchronous Body Streaming (`for await...of`)
Older Node.js patterns relied on callback event listeners (`req.on("data")` and `req.on("end")`). Modern JavaScript (ES2022+) provides clean async iteration:

```ts
export async function handleServicesRoute(req, res) {
    if (req.method === "POST") {
        let body = "";
        
        // Asynchronously stream the incoming payload chunks
        for await (const chunk of req) {
            body += chunk;
        }

        // Reconstruct the text into a JavaScript object
        const newService = JSON.parse(body);

        // Assign a unique ID and store in memory
        newService.id = services.length + 1;
        services.push(newService);

        // Respond with HTTP 201 Created
        res.statusCode = 201;
        res.end(JSON.stringify(newService));
        return;
    }
}
```

### 3. Two-Way JSON Translation
- **`JSON.stringify(object)`**: Converts internal code objects into text strings to transmit over the network to browsers or clients.
- **`JSON.parse(string)`**: Converts raw network text back into an executable JavaScript object whose properties (`newService.name`, `newService.price`) can be accessed.

### 4. Memory (RAM) vs Database Persistence
When a service is added to the in-memory `services` array:
- It is immediately queryable by any subsequent `GET` request.
- However, variables reside in temporary system memory (RAM). When the server process restarts, the array resets back to its hardcoded file defaults.
- This distinction defines why real-world production backends connect to databases (PostgreSQL, SQLite, Cloudflare D1) to persist state to disk.

---

## Chapter 22: SQLite Database Persistence & `DELETE` Operations

### 1. From Ephemeral RAM to Disk Persistence
Storing items in an in-memory array (`const services = [...]`) means any server restart or process crash wipes newly added data.

A database solves this by recording operations to a durable file on the hard drive. We used **`better-sqlite3`**:
- **Zero server overhead:** The database is a single local file (`src/data/esolutions.db`).
- **Standard SQL:** The exact same SQL dialects used in Cloudflare D1 and production relational databases.

### 2. Initializing & Seeding Schema (`src/data/db.ts`)
```ts
import Database from "better-sqlite3";

export const db = new Database("src/data/esolutions.db");

// Auto-create table schema if absent
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
  )
`);
```
- `INTEGER PRIMARY KEY AUTOINCREMENT`: SQLite manages unique incremental ID assignment automatically upon insertion.

### 3. Inserting Data with Prepared Statements (`POST`)
To prevent security vulnerabilities (like SQL Injection), database values are never glued with string concatenation. Instead, we use parameterized prepared statements with `?` placeholders:

```ts
const insertStmt = db.prepare("INSERT INTO services (name, price, category) VALUES (?, ?, ?)");
const info = insertStmt.run(newService.name, newService.price, newService.category);

// Retrieve the database-generated ID
newService.id = Number(info.lastInsertRowid);
```

### 4. Reading Fresh Records (`GET`)
To ensure queries always return current live state without stale in-memory caching:
```ts
let results = db.prepare("SELECT * FROM services").all();
```

### 5. Deleting Records (`DELETE`)
When removing an item, the client specifies the target record via query parameter (`DELETE /services?id=11`).

We execute the deletion and inspect `info.changes` to verify if a record was actually removed:
```ts
if (req.method === "DELETE") {
    const address = new URL(req.url, "http://127.0.0.1:3000");
    const serviceIdText = address.searchParams.get("id");

    if (serviceIdText === null) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Please provide a service ID to delete" }));
        return;
    }

    const serviceId = Number(serviceIdText);
    const deleteStmt = db.prepare("DELETE FROM services WHERE id = ?");
    const info = deleteStmt.run(serviceId);

    // 0 changes means the record never existed in the database
    if (info.changes === 0) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Service not found" }));
        return;
    }

    // Successfully deleted
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Service deleted successfully", id: serviceId }));
    return;
}
```

### 6. Summary of the Complete REST CRUD Matrix

| Operation | HTTP Method | SQL Command | Success Code | Missing Code |
|---|---|---|---|---|
| **Create** | `POST /services` | `INSERT INTO services ...` | `201 Created` | — |
| **Read (All/Filter)** | `GET /services` | `SELECT * FROM services` | `200 OK` | `[]` (Empty) |
| **Read (Single)** | `GET /services?id=1` | `.find()` | `200 OK` | `404 Not Found` |
| **Delete** | `DELETE /services?id=1` | `DELETE FROM services WHERE id = ?` | `200 OK` | `404 Not Found` |
| **Invalid Method** | `PUT / PATCH` | — | `405 Method Not Allowed` | — |

---

*This guide belongs to the PECAB-LTD / E-Solutions training series. Update it whenever new concepts are introduced.*
