var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/auth", require("./auth/index"));
router.use("/portfolio", require("./portfolio/index"));

module.exports = router;
