var express = require('express');
var router = express.Router();

const authUtil = require("../module/utils/authUtils");
var moment = require('moment');

const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');
const db = require('../module/pool');


router.post('/', authUtil.isLoggedin, async (req, res) => {

    const SelectQuery = "SELECT point FROM user WHERE user_idx = ?"
    const SelectResult = await db.queryParam_Arr(SelectQuery, [req.decoded.idx]);
    if (!SelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB오류"));
    } else {
        if (SelectResult[0].point < 3) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "포인트 부족"));
        } else {
            console.log("진입");

            const selectUserQuery = "SELECT * FROM user WHERE user_nickname=? "
            const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.body.nickname]);
            if (selectUserResult) {
                const UpdatePointQuery = "UPDATE user SET point =point-3 WHERE user_idx = ?"
                const UpdateHifiveQuery = "UPDATE user SET hifive =hifive+1 WHERE user_nickname = ?"
                const insertHifivelistQuery = 'INSERT INTO hifivelist (hifive_from,hifive_to) VALUES (?, ?)';
                const insertNotificationQuery = 'INSERT INTO notification (user_idx,content,type,createdAt)  VALUES (?, ?,?,?)'

                const insertTransaction = await db.Transaction(async (connection) => {

                    const UpdatePointResult = await connection.query(UpdatePointQuery, [req.decoded.idx]);
                    const UpdateHifiveResult = await connection.query(UpdateHifiveQuery, [req.body.nickname]);
                    const insertHifivelistResult = await connection.query(insertHifivelistQuery,
                        [req.decoded.idx, selectUserResult[0].user_idx]);
                    const insertNotificationResult = await connection.query(insertNotificationQuery,
                        [selectUserResult[0].user_idx, req.decoded.nickname, 2, moment().format('YYYY-MM-DD HH:mm:ss')]);
                });
                if (insertTransaction) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "연락 성공"));
                } else {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
                }
            } else {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            }


        }

    }


})
router.get('/:nickname', async (req, res) => {

    const SelectQuery = "SELECT user_number FROM user WHERE user_nickname = ?"
    const SelectResult = await db.queryParam_Arr(SelectQuery, [req.params.nickname]);
    if (!SelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {

        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectResult[0].user_number));

    }


})

module.exports = router;