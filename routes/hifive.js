var express = require('express');
var router = express.Router();

const authUtil = require("../module/utils/authUtils");

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
            const UpdatePointQuery = "UPDATE user SET point =point-3 WHERE user_idx = ?"
            const UpdatePointResult = await db.queryParam_Arr(UpdatePointQuery, [req.decoded.idx]);
            const UpdateHifiveQuery = "UPDATE user SET hifive =hifive+1 WHERE user_nickname = ?"
            const UpdateHifiveResult = await db.queryParam_Arr(UpdateHifiveQuery, [req.body.nickname]);
            const insertHifivelistQuery = 'INSERT INTO hifivelist (hifive_from,hifive_to) VALUES (?, ?)';
            const insertHifivelistResult = await db.queryParam_Arr(insertHifivelistQuery,
                [req.decoded.idx, selectUserResult[0].user_idx]);
            if (UpdatePointResult && UpdateHifiveResult && insertHifivelistResult) {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "연락 성공"));
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