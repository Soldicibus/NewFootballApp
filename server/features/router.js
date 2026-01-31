import express from 'express';

const mainRouter = express.Router();

// Example routes
mainRouter.get('/status', (req, res) => {
  res.json({ status: 'API is running' });
});

export default mainRouter;