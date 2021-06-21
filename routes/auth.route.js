const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller')

router
    .route('/login')
    .get(authController.tryRoute)

module.exports = router;