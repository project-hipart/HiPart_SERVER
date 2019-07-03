var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/auth", require("./auth/index"));
router.use("/portfolio", require("./portfolio/index"));
router.use("/profile", require("./profile/index"));
router.use("/banner", require("./banner/index"));
router.use("/main", require("./main/index"));
module.exports = router;
