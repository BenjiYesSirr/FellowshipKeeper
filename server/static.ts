import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  const publicPath = path.resolve(__dirname, "..", "client");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    // Fallback for development: serve from client root where index.html lives
    app.use(express.static(publicPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(publicPath, "index.html"));
    });
  }
}
