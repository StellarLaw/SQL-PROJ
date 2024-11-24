const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY, 
    username TEXT, 
    password TEXT,
    account_number TEXT,
    balance REAL
  )`);

  db.run(`INSERT INTO users (id, username, password, account_number, balance) VALUES 
    (1, 'admin', 'password123', 'ACC123456', 1000.50),
    (2, 'user', 'userpass', 'ACC654321', 250.75),
    (3, 'test', 'test123', 'ACC987654', 500.00)`);
});

app.post("/vulnerable-login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(`<h2>Database error.</h2><p>Query: ${query}</p>`);
    } else if (rows.length > 0) {
      res.redirect(`/account/${rows[0].username}`);
    } else if (username.includes("' OR '1'='1")) {
      db.all("SELECT * FROM users", [], (err, allRows) => {
        if (err) {
          res.status(500).send("Database error during injection.");
        } else {
          res.send(
            `<h2>SQL Injection Successful</h2>
             <p>All User Data Retrieved: <code>${JSON.stringify(allRows)}</code></p>`
          );
        }
      });
    } else {
      res.send(
        `<h2>Login Failed</h2>
         <p>Query Executed: <code>${query}</code></p>`
      );
    }
  });
});

app.post("/secure-login", (req, res) => {
  const { username, password } = req.body;

  const sqlInjectionRegex = /(\b(SELECT|UNION|INSERT|DELETE|UPDATE|DROP|;|--|\|\|)\b|'|"|=|OR|AND|--)/i;

  if (sqlInjectionRegex.test(username) || sqlInjectionRegex.test(password)) {
    return res.status(400).send(`
      <h2>Invalid Input Detected</h2>
      <p>Your input contains potential SQL Injection patterns and has been rejected.</p>
      <a href="/mitigation.html">Go Back</a>
    `);
  }

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.all(query, [username, password], (err, rows) => {
    if (err) {
      res.status(500).send("<h2>Database error.</h2>");
    } else if (rows.length > 0) {
      res.redirect(`/account/${rows[0].username}`);
    } else {
      res.send(
        `<h2>Login Failed</h2>
         <p>Invalid username or password.</p>`
      );
    }
  });
});

app.get("/account/:username", (req, res) => {
  const username = req.params.username;
  const query = `SELECT username, account_number, balance FROM users WHERE username = ?`;

  db.get(query, [username], (err, row) => {
    if (err) {
      res.status(500).send("<h2>Database error.</h2>");
    } else if (row) {
      res.send(`
        <h2>Welcome, ${row.username}!</h2>
        <p>Account Number: ${row.account_number}</p>
        <p>Balance: $${row.balance.toFixed(2)}</p>
        <a href="/">Log Out</a>
      `);
    } else {
      res.send("<h2>Account not found.</h2>");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
