var express = require('express');
var router = express.Router();

const authUtil = require("../module/utils/authUtils");

const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');
const db = require('../module/pool');


router.post('/', authUtil.isLoggedin, async (req, res) => {

    const selectUserQuery = "SELECT user_idx FROM user WHERE user_nickname = ?"
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.body.nickname]);

    if (!selectUserResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (selectUserResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "닉네임을 가진 유저가 없습니다."));
        } else {
            const insertPickQuery = 'INSERT INTO picklist (pick_from,pick_to) VALUES (?, ?)';
            const insertPickResult = await db.queryParam_Arr(insertPickQuery,
                [req.decoded.idx, selectUserResult[0].user_idx]);
            const updatePickQuery = 'UPDATE user SET pick=pick+1 WHERE user_idx =?';
            const updatePickResult = await db.queryParam_Arr(updatePickQuery,
                [selectUserResult[0].user_idx]);
            if (!insertPickResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 성공"));
            }
        }

    }


})
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const selectUserQuery = "SELECT user_idx FROM user WHERE user_nickname = ?"
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.body.nickname]);

    if (!selectUserResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (selectUserResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "닉네임을 가진 유저가 없습니다."));
        } else {
            const deletePickQuery = 'DELETE FROM picklist WHERE pick_from = ? && pick_to=?';
            const deletePickResult = await db.queryParam_Arr(deletePickQuery,
                [req.decoded.idx, selectUserResult[0].user_idx]);
            const updatePickQuery = 'UPDATE user SET pick=pick-1 WHERE user_idx =?';
            const updatePickResult = await db.queryParam_Arr(updatePickQuery,
                [selectUserResult[0].user_idx]);
            if (!deletePickResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 취소 성공"));

            }
        }

    }

})
router.get('/', authUtil.isLoggedin, async (req, res) => {
    let resData = [];
    const selectQuery = "SELECT pick_to FROM picklist WHERE pick_from = ?"
    const selectResult = await db.queryParam_Arr(selectQuery, [req.decoded.idx]);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "디비 오류"));
    } else { //쿼리문이 성공했을 때
        for (let i = 0; i < selectResult.length; i++) {
            const selectUserQuery = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user.user_idx=?";
            const selectUserResult = await db.queryParam_Arr(selectUserQuery, [selectResult[i].pick_to]);
            resData.push(selectUserResult[0]);
        }
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 리스트 조회 성공", resData));
    }

})




module.exports = router;