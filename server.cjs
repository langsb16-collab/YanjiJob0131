const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./posts.db");

db.run(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  titleCN TEXT,
  category TEXT NOT NULL,
  location TEXT,
  description TEXT,
  descriptionCN TEXT,
  contact TEXT,
  createdAt TEXT,
  status TEXT DEFAULT 'active',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
)
`);

// 게시글 목록
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "조회 실패" });
    }
    res.json(rows);
  });
});

// 게시글 등록
app.post("/api/posts", (req, res) => {
  const { title, titleCN, category, location, description, descriptionCN, contact } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: "필수값 누락" });
  }

  const createdAt = new Date().toLocaleDateString();

  db.run(
    `INSERT INTO posts (title, titleCN, category, location, description, descriptionCN, contact, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, titleCN || "", category, location || "", description || "", descriptionCN || "", contact || "", createdAt],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "DB 저장 실패" });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 게시글 삭제
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  
  db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "삭제 실패" });
    }
    res.json({ success: true });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API 서버 실행 http://localhost:${PORT}`);
});
