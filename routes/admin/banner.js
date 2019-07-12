var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


router.get('/list', authUtil.isLoggedin, async (req, res) => {

    if (req.decoded.nickname == "킴다히 ") {
        const SelectQuery = 'SELECT * FROM banner_detail ';
        let SelectResult = await db.queryParam_None(SelectQuery);

        if (!SelectResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, SelectResult));
        }
    } else {// 관리자가 아니면 
        res.status(200).send(defaultRes.successFalse(statusCode.UNAUTHORIZED, resMessage.NOT_AUTH));
    }



});
router.post('/select', authUtil.isLoggedin, async (req, res) => {




});
module.exports = router;