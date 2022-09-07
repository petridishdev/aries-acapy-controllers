import express, { NextFunction, Request, Response } from 'express'
import { check, validationResult } from 'express-validator'
import { agentService } from '../services/AgentService'
const router = express.Router()

router.get('/', handleWalletGet)

router.post('/', [
  check('name')
    .notEmpty()
    .withMessage('Wallet name is required'),
  check('key')
    .notEmpty()
    .withMessage('Wallet key is required'),
  check('label')
    .notEmpty()
    .withMessage('Wallet label is required')
], handleNewWalletPost, handleWalletGet)

async function handleWalletGet (req: Request & { errors?: any }, res: Response, next: NextFunction): Promise<void> {
  if (req.errors) {
    res.status(422)
  }

  res.render('wallet', {
    errors: req.errors || null,
    wallet: req.session.wallet
  })
}

async function handleNewWalletPost (req: Request & { errors?: any }, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.errors = errors.array()
    req.session.wallet = req.body
    return next()
  }

  const wallet = await agentService.createWallet({
    label: req.body.label,
    wallet_name: req.body.name,
    wallet_key: req.body.key,
    wallet_dispatch_type: 'default',
    key_management_mode: 'managed',
    wallet_type: 'indy',
    wallet_webhook_urls: [
            `http://host.docker.internal:${process.env.PORT ?? '3000'}/webhooks`
    ]
  })
  req.session.wallet = wallet
  req.session.save()
  next()
}

export default router
