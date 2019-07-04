var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', authUtil.isLoggedin, async (req, res) => {

    const selectUserQuery = "SELECT * FROM user_detail WHERE user_idx =?"
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.decoded.idx]);
    console.log(selectUserResult);
    if (selectUserResult[0] == null) {
        const insertQuery = 'INSERT INTO user_detail ( detail_field, detail_platform,' +
            'detail_subscriber, detail_oneline,detail_appeal,detail_want,user_idx,concept, lang,pd,etc)' +
            ' VALUES ( ?, ?, ?, ?, ?,  ?, ?,?,?,?,?)';
        const insertResult = await db.queryParam_Arr(insertQuery,
            [req.body.detail_field, req.body.detail_platform, req.body.detail_subscriber
                , req.body.detail_oneline, req.body.detail_appeal,
            req.body.detail_want, req.decoded.idx,
            req.body.concept, req.body.lang, req.body.pd, req.body.etc]);
        if (!insertResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
        }
    } else {
        const updateQuery = 'UPDATE user_detail SET detail_field =? , detail_platform=?,' +
            'detail_subscriber=?, detail_oneline=?,detail_appeal=?,detail_want=?,user_idx=?,' +
            'concept=?, lang=?,pd=?,etc=?' +
            ' WHERE user_idx =?';
        const updateResult = await db.queryParam_Arr(updateQuery,
            [req.body.detail_field, req.body.detail_platform, req.body.detail_subscriber
                , req.body.detail_oneline, req.body.detail_appeal,
            req.body.detail_want, req.decoded.idx,
            req.body.concept, req.body.lang, req.body.pd, req.body.etc, req.decoded.idx]);
        if (!updateResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
        }
    }

});

module.exports = router;
