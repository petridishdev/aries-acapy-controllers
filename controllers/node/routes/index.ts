import express, { NextFunction, Request, Response } from 'express'
import { navLinkService } from '../services/NavLinkService'
import { agentService } from '../services/AgentService'
const router = express.Router()

/* GET home page. */
router.get('/', async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  res.render('index', { navLinks: navLinkService.getNavLinks() })
})

router.get('/status', async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const status = await agentService.getStatus()
  res.status(200).json({ status: status ? 'up' : 'down' })
})

export default router
