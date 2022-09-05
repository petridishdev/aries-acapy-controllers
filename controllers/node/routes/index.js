const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const navLinkService = require('../services/NavLinkService');

  res.render('index', { navLinks: navLinkService.getNavLinks() });
});

router.get('/status', async function(req, res, next) {
  const agentService = require('../services/AgentService');

  const status = await agentService.getStatus();
  res.status(200).json({ status: status ? 'up' : 'down' });
});

module.exports = router;
