var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");
var moment = require('moment');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', authUtil.isLoggedin, async (req, res) => {  // 유저에게 줄 보너스와 배너에 저장되있는 유저의 idx를 SELECT
    const selectSimpleQuery = 'SELECT banner_simple.bonus, banner_simple.banner_idx FROM banner_simple WHERE banner_idx = ?';
    const selectUserQuery = 'SELECT * FROM banner_simple_list WHERE banner_idx = ? AND user_idx=?';   // banner_idx, user_idx

    const selectSimpleResult = await db.queryParam_Arr(selectSimpleQuery, [req.body.banner_idx]);    // 배너 가져오기
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.body.banner_idx, req.decoded.idx]);      // 
    // user_idx가 list에 있으면 받을 수 없음

    if (!selectSimpleResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {

        if (selectUserResult[0] == null) {    // 배너에 저장되어 있는 유저의 idx가 없음 클릭 가능
            /* 유저의 포인트를 + bonus */
            const updateClickQuery = 'UPDATE user SET point = point + ? WHERE user_idx =? ';
            const insertBannerQuery = 'INSERT INTO banner_simple_list (banner_idx, user_idx) VALUES (?, ?)';   // 배너에 유저 번호 삽입
            const insertNotificationQuery = 'INSERT INTO notification (user_idx,content,type,createdAt)  VALUES (?, ?,?,?)'
            const UpdateNotificationQuery = "UPDATE user SET notistate = ? WHERE user_idx =?";

            const insertTransaction = await db.Transaction(async (connection) => {
                const updateClickResult = await connection.query(updateClickQuery, [selectSimpleResult[0].bonus, req.decoded.idx]);

                const insertBannerResult = await connection.query(insertBannerQuery, [req.body.banner_idx, req.decoded.idx]);
              
            });
            console.log("성공");
            const insertNotificationResult = await db.queryParam_Arr(insertNotificationQuery,
                [req.decoded.idx, '2', 3, moment().format('YYYY-MM-DD HH:mm:ss')]);
            const UpdateNotificationResult = await db.queryParam_Arr(UpdateNotificationQuery, [1, req.decoded.idx]);

            if (!insertTransaction) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
            } else {    // 성공할 경우
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.CLICK_POINT_BANNER));     // 배너 클릭 포인트 획득
            }
        } else {    // null이 아닐 경우
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_GOT_POINT));    // 이미 포인트 받은 유저 받을 수 없음
        }

    }
});
module.exports = router;