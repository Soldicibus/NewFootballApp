import express from "express";
import db from "./db.js";
import mainRouter from "./features/router.js"

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req,res,next)=>{ console.log(req.method, req.originalUrl); next(); });

// Public auth endpoints must be accessible without a Bearer token.
//app.use("/api/auth", authRoutes);

// Everything else under /api requires authentication.
app.use("/api", mainRouter);

app.listen(5000, '0.0.0.0', () => {
  db.start();
  console.log('API running to get beer on all local interfaces');
  console.log(`Server is running to get some beer on port ${PORT}`);
  console.log(`Local instances can be accessed at: http://localhost:${PORT}/api`);
});