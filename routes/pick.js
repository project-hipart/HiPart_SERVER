var express = require('express');
var router = express.Router();

const authUtil = require("../module/utils/authUtils");
var moment = require('moment');

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
            const updatePickQuery = 'UPDATE user SET pick=pick+1 WHERE user_idx =?';
            const insertNotificationQuery = 'INSERT INTO notification (user_idx,content,type,createdAt)  VALUES (?, ?,?,?)'
            const UpdateNotificationQuery = "UPDATE user SET notistate = ? WHERE user_idx =?";

            const insertTransaction = await db.Transaction(async (connection) => {
                const UpdateNotificationResult = await db.queryParam_Arr(UpdateNotificationQuery, [1, selectUserResult[0].user_idx]);
                const insertPickResult = await db.queryParam_Arr(insertPickQuery,
                    [req.decoded.idx, selectUserResult[0].user_idx]);
                const updatePickResult = await db.queryParam_Arr(updatePickQuery,
                    [selectUserResult[0].user_idx]);
                const insertNotificationResult = await db.queryParam_Arr(insertNotificationQuery,
                    [selectUserResult[0].user_idx, req.decoded.nickname, 1, moment().format('YYYY-MM-DD HH:mm:ss')]);
            })
            if (!insertTransaction) {
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
    const selectQuery = "SELECT * FROM picklist WHERE pick_from = ?"
    const selectResult = await db.queryParam_Arr(selectQuery, [req.decoded.idx]);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else { //쿼리문이 성공했을 때
        for (let i = 0; i < selectResult.length; i++) {
            const item = {
                pickState: 0,
                info: []
            }
            const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
            const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].pick_to]);
            if (SelectPickResult[0] == null) {
                item.pickState = 0;
            } else {
                item.pickState = 1;
            }
            const selectUserQuery = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user.user_idx=?";
            const selectUserResult = await db.queryParam_Arr(selectUserQuery, [selectResult[i].pick_to]);

            item.info.push(selectUserResult[0]);
            resData.push(item);
        }
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 리스트 조회 성공", resData));
    }

})


// router.get('/', authUtil.isLoggedin, async (req, res) => {
//     let resData = [];
//     const selectQuery = "SELECT pick_from FROM picklist WHERE pick_to = ?"
//     const selectResult = await db.queryParam_Arr(selectQuery, [req.decoded.idx]);
//     if (!selectResult) {
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "디비 오류"));
//     } else { //쿼리문이 성공했을 때
//         for (let i = 0; i < selectResult.length; i++) {
//             const selectUserQuery = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_oneline, concept, lang, pd, etc" +
//                 " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user.user_idx=?";
//             const selectUserResult = await db.queryParam_Arr(selectUserQuery, [selectResult[i].pick_from]);
//             resData.push(selectUserResult[0]);
//         }
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 리스트 조회 성공", resData));
//     }

// })


module.exports = router;