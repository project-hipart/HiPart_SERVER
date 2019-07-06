var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');
router.get('/', async (req, res) => {

    banners = {
        banner1: "https://igbb.s3.ap-northeast-2.amazonaws.com/",
        banner2: "https://igbb.s3.ap-northeast-2.amazonaws.com/",
    }

    res.status(200).send(defaultRes.successTrue(statusCode.OK, "배너 조회 성공", banners));

});

module.exports = router;
