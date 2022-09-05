import { NextFunction, Request, Response } from "express";

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const { navLinkService } = require('../services/NavLinkService');
navLinkService.registerCustomLinks([
    { "label": "Active", "url": "/connections/active" },
    { "label": "Pending", "url": "/connections/pending" },
    { "label": "New", "url": "/connections/new" },
    { "label": "Accept", "url": "/connections/accept" }
]);

router.use(function (req: Request, res: Response, next: NextFunction) {
    navLinkService.clearLinkClasses();
    navLinkService.setNavLinkActive('/connections');
    next();
});

router.get('/', async function (req: Request, res: Response, next: NextFunction) {
    res.redirect('/connections/active');
});

router.get('/active', async function (req: Request, res: Response, next: NextFunction) {
    const agentService = require('../services/AgentService');
    const allConnections = await agentService.getConnections();
    const connections = allConnections.filter((connection: any) => connection.state === 'active' || connection.state === 'request');

    navLinkService.setCustomNavLinkActive('/connections/active');
    res.render('connection', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        connections
    });
});

router.get('/pending', async function (req: Request, res: Response, next: NextFunction) {
    const agentService = require('../services/AgentService');
    const allConnections = await agentService.getConnections();
    const connections = allConnections.filter((connection: any) => connection.state === 'invitation');

    navLinkService.setCustomNavLinkActive('/connections/pending');
    res.render('connection', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        connections
    });
});

router.get('/new', handleNewConnectionGet);

router.post('/new', handleNewConnectionPost, handleNewConnectionGet);

async function handleNewConnectionGet(req: Request & { invitation: any }, res: Response, next: NextFunction) {
    navLinkService.setCustomNavLinkActive('/connections/new');
    res.render('new_connection', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        invitation: req.invitation
    });
}

async function handleNewConnectionPost(req: Request & { invitation: any }, res: Response, next: NextFunction) {
    const agentService = require('../services/AgentService');

    const invitation = await agentService.createInvitation();
    if (invitation) {
        invitation.invitation = JSON.stringify(invitation.invitation, null, 4);
    }
    req.invitation = invitation
    next();
}

router.get('/accept', handleAcceptConnectionGet);

router.post('/accept', [
    check('invitation_object')
        .notEmpty()
        .withMessage('Invitation object is required'),
    check('invitation_object')
        .custom((value: string) => {
            try {
                JSON.parse(value);
                return true;
            } catch (error: any) {
                throw new Error(`Invalid object: ${error.message}`);
            }
        })
], handleAcceptConnectionPost, handleAcceptConnectionGet);

async function handleAcceptConnectionGet(req: Request & { invitation: any; errors: any }, res: Response, next: NextFunction) {
    navLinkService.setCustomNavLinkActive('/connections/accept');

    if (req.errors) {
        res.status(422);
    }

    res.render('accept_connection', {
        navLinks: navLinkService.getNavLinks(),
        customNavLinks: navLinkService.getCustomNavLinks(),
        errors: req.errors || null,
        invitation: req.errors && req.invitation || null
    });
}

async function handleAcceptConnectionPost(req: Request & { invitation: any; errors: any }, res: Response, next: NextFunction) {
    const agentService = require('../services/AgentService');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.errors = errors.array({ onlyFirstError: true });
        req.invitation = req.body;
        return next();
    }

    await agentService.receiveInvitation(req.body.invitation_object);
    res.status(201).redirect('/connections/active');
}

router.get('/:id/remove', async function (req: Request, res: Response, next: NextFunction) {
    const connectionId = req.params.id;
    const state = req.query.state || '';

    if (connectionId) {
        const agentService = require('../services/AgentService');
        await agentService.removeConnection(connectionId);
    }

    const redirectUrl = `/connections/${state === 'invitation' ? 'pending' : 'active'}`;
    res.redirect(redirectUrl);
});

export default router;