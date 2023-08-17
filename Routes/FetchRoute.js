const { Fetch } = require('../Controllers/FetchController')
const router = require('express').Router()


router.get('/fetch', Fetch);

module.exports = router