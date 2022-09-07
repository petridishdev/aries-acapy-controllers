import express, { NextFunction, Request, Response } from 'express'

import { check, validationResult } from 'express-validator'

import { navLinkService } from '../services/NavLinkService'
import { agentService } from '../services/AgentService'

const router = express.Router()

router.use(function (req: Request, res: Response, next: NextFunction) {
  navLinkService.registerCustomLinks([
    { label: 'Active', url: '/connections/active' },
    { label: 'Pending', url: '/connections/pending' },
    { label: 'New', url: '/connections/new' },
    { label: 'Accept', url: '/connections/accept' }
  ])
  navLinkService.clearLinkClasses()
  navLinkService.setNavLinkActive('/connections')
  next()
})

router.use(function (req: Request, res: Response, next: NextFunction) {
  const { wallet } = req.session
  if (!wallet?.token) {
    res.redirect('/wallets')
  } else {
    // console.log(wallet?.token);
    next()
  }
})

router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  res.redirect('/connections/active')
})

router.get('/active', async function (req: Request, res: Response, next: NextFunction) {
  const allConnections = await agentService.getConnections(req.session.wallet.token)
  const connections = allConnections.filter((connection: any) => connection.state === 'active' || connection.state === 'request')

  navLinkService.setCustomNavLinkActive('/connections/active')
  res.render('connection', {
    navLinks: navLinkService.getNavLinks(),
    customNavLinks: navLinkService.getCustomNavLinks(),
    connections
  })
})

router.get('/pending', async function (req: Request, res: Response, next: NextFunction) {
  const allConnections = await agentService.getConnections(req.session.wallet.token)
  const connections = allConnections.filter((connection: any) => connection.state === 'invitation')

  navLinkService.setCustomNavLinkActive('/connections/pending')
  res.render('connection', {
    navLinks: navLinkService.getNavLinks(),
    customNavLinks: navLinkService.getCustomNavLinks(),
    connections
  })
})

router.get('/new', handleNewConnectionGet)

router.post('/new', handleNewConnectionPost, handleNewConnectionGet)

router.get('/accept', handleAcceptConnectionGet)

router.post('/accept', [
  check('invitation_obj_str')
    .notEmpty()
    .withMessage('Invitation object string is required'),
  check('invitation_obj_str')
    .custom((value: string) => {
      try {
        JSON.parse(value)
        return true
      } catch (error: any) {
        throw new Error(`Invalid object: ${error.message as string}`)
      }
    })
], handleAcceptConnectionPost, handleAcceptConnectionGet)

router.get('/:id/remove', async function (req: Request, res: Response, next: NextFunction) {
  const connectionId = req.params.id
  const state = req.query.state ?? ''

  if (connectionId) {
    await agentService.removeConnection(connectionId, req.session.wallet.token)
  }

  const redirectUrl = `/connections/${state === 'invitation' ? 'pending' : 'active'}`
  res.redirect(redirectUrl)
})

async function handleNewConnectionGet (req: Request & { invitation?: any }, res: Response, next: NextFunction): Promise<void> {
  navLinkService.setCustomNavLinkActive('/connections/new')
  res.render('new_connection', {
    navLinks: navLinkService.getNavLinks(),
    customNavLinks: navLinkService.getCustomNavLinks(),
    invitation: req.invitation
  })
}

async function handleNewConnectionPost (req: Request & { invitation?: any }, res: Response, next: NextFunction): Promise<void> {
  const invitation = await agentService.createInvitation(req.session.wallet.token)
  if (invitation) {
    invitation.invitation = JSON.stringify(invitation.invitation, null, 4)
  }
  req.invitation = invitation
  next()
}

async function handleAcceptConnectionGet (req: Request & { invitation?: any, errors?: any }, res: Response, next: NextFunction): Promise<void> {
  navLinkService.setCustomNavLinkActive('/connections/accept')

  if (req.errors) {
    res.status(422)
  }

  res.render('accept_connection', {
    navLinks: navLinkService.getNavLinks(),
    customNavLinks: navLinkService.getCustomNavLinks(),
    errors: req.errors || null,
    invitation: (req.errors && req.invitation) || null
  })
}

async function handleAcceptConnectionPost (req: Request & { invitation?: any, errors?: any }, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.errors = errors.array({ onlyFirstError: true })
    req.invitation = req.body
    return next()
  }

  const invitation = JSON.parse(req.body.invitation_obj_str)
  await agentService.receiveInvitation(invitation, req.session.wallet.token)
  res.status(201).redirect('/connections/active')
}

export default router
