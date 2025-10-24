import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const apiPath = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (apiPath.startsWith("/api")) {
      console.log(`${req.method} ${apiPath} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

let routesRegistered = false;

async function setupRoutes() {
  if (!routesRegistered) {
    await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    routesRegistered = true;
  }
}

export default async function handler(req: any, res: any) {
  await setupRoutes();
  return app(req, res);
}
