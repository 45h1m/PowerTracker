const express = require('express');

const Router = express.Router();


Router.get('/', sendDates);


module.exports = Router;