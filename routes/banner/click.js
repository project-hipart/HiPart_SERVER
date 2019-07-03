var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');
router.put('/', authUtil.isLoggedin, async (req, res) => {

    const updatePalmQuery = 'UPDATE user SET point = point+2 WHERE user_idx =?  ';
    const updatePalmResult = await db.queryParam_Arr(updatePalmQuery, [req.decoded.idx]);
    if (!updatePalmResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
    }
});

module.exports = router;
