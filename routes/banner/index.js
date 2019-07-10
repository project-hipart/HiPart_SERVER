var express = require('express');
var router = express.Router();

router.use("/list", require("./list"));
router.use("/click", require("./click"));
router.use("/detail", require("./detail"));
router.use("/apply", require("./apply"));
router.use("/simple", require("./simple"));

module.exports = router;