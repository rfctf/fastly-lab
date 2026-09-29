const http = require("node:http");
const { randomUUID } = require("node:crypto");

const PRICE = 100;

const server = http.createServer((req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const requestId = randomUUID();
  const generatedAt = new Date().toISOString();

  console.log(`${generatedAt} ${req.method} ${path} ${requestId}`);

  res.setHeader("X-Origin-Request-ID", requestId);

  if (path === "/product") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600"
    );

    res.end(JSON.stringify({
      product: "Demo headphones",
      price: PRICE,
      generatedAt,
      originRequestId: requestId
    }, null, 2));
    return;
  }

  if (path === "/account") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "private, no-store");

    res.end(JSON.stringify({
      message: "Simulated account data. No real personal information.",
      generatedAt,
      originRequestId: requestId
    }, null, 2));
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "private, no-store");

  res.end(`
    <h1>My Fastly Learning Lab</h1>
    <p><a href="/product">View public product information</a></p>
    <p><a href="/account">View simulated account information</a></p>
    <p>Origin generated this page at ${generatedAt}</p>
  `);
});

server.listen(process.env.PORT || 3000, "0.0.0.0");
