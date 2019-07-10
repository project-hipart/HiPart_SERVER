var express = require('express');
var router = express.Router();

const authUtil = require("../module/utils/authUtils");


const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');
const db = require('../module/pool');

router.get('/', authUtil.isLoggedin, async (req, res) => {

    const selectQuery = "SELECT * FROM user WHERE user_idx = ?"
    const selectResult = await db.queryParam_Arr(selectQuery, [req.decoded.idx]);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", selectResult));
    }


})

module.exports = router;