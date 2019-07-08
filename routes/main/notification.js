var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');

const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.get('/', authUtil.isLoggedin, async (req, res) => {

    const SelectNotificationQuery = "SELECT type,content,createdAt FROM notification WHERE user_idx =?";
    const SelectNotificationResult = await db.queryParam_Arr(SelectNotificationQuery, [req.decoded.idx]);

    if (!SelectNotificationResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectNotificationResult));
    }

})

module.exports = router;