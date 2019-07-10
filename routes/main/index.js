var express = require('express');
var router = express.Router();

router.use("/notification", require("./notification"));
router.use("/search", require("./search"));
router.use("/notificationState", require("./notificationState"));



module.exports = router;