import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  const { navLinkService } = require('../services/NavLinkService');

  res.render('index', { navLinks: navLinkService.getNavLinks() });
});

router.get('/status', async function(req: Request, res: Response, next: NextFunction) {
  const { agentService } = require('../services/AgentService');

  const status = await agentService.getStatus();
  res.status(200).json({ status: status ? 'up' : 'down' });
});

export default router;
