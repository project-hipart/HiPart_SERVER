var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/auth", require("./auth/index"));
router.use("/portfolio", require("./portfolio/index"));
router.use("/profile", require("./profile/index"));
router.use("/banner", require("./banner/index"));
router.use("/main", require("./main/index"));
router.use("/filter", require("./filter"));
router.use("/pick", require("./pick"));
router.use("/hifive", require("./hifive"));
router.use("/mypage", require("./mypage/index"));
router.use("/myinfo", require("./myinfo"));
router.use("/admin", require("./admin"));
module.exports = router;
