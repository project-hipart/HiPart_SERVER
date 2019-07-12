var express = require('express');
var router = express.Router();

router.use("/banner", require("./banner"));



module.exports = router;