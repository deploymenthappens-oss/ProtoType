const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[warning] SUPABASE_URL and/or SUPABASE_ANON_KEY are not set. " +
    "Set them in Railway → Variables, or the site won't be able to reach your database."
  );
}

function renderPage(fileName) {
  const filePath = path.join(__dirname, "public", fileName);
  let html = fs.readFileSync(filePath, "utf8");
  html = html
    .replace(/__SUPABASE_URL__/g, SUPABASE_URL)
    .replace(/__SUPABASE_ANON_KEY__/g, SUPABASE_ANON_KEY);
  return html;
}

// Railway/uptime health check
app.get("/healthz", (req, res) => res.status(200).send("ok"));

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(renderPage("index.html"));
});

app.get(["/admin", "/admin.html"], (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(renderPage("admin.html"));
});

// Any other static assets you add later (images, favicon, etc.)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
