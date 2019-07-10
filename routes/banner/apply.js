var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 광고 신청
router.post('/', authUtil.isLoggedin, async (req, res) => {  // 협찬 배너 idx를 가져옴
    const selectDetailQuery = 'SELECT banner_detail.banner_idx FROM banner_detail WHERE banner_idx = ?';
    const selectUserQuery = 'SELECT * FROM banner_detail_list WHERE banner_idx = ? AND user_idx';   // banner_idx, user_idx

    const selectDetailResult = await db.queryParam_Arr(selectDetailQuery, [req.body.banner_idx]);    // 배너 가져오기
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.body.banner_idx, req.decoded.idx]);      // 
// user_idx가 list에 있으면 신청 불가

    if(!selectDetailResult){
    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
    if (!selectUserResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
        if(selectUserResult[0] == null){    // 배너에 저장되어 있는 유저의 idx가 없음 신청 가능   
        const insertDetailQuery = 'INSERT INTO banner_detail_list (banner_idx, user_idx) VALUES (?, ?)';   // 배너에 유저 번호 삽입

            const insertDetailResult = await db.queryParam_Arr(insertDetailQuery, [req.body.banner_idx, req.decoded.idx]);

        if(!selectDetailResult){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
        } else {    // 성공할 경우
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_APPLY_BANNER));     // 신청 성공
        }
    } else {    // null이 아닐 경우
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAILED_APPLY_BANNER));    // 이미 신청된 광고 입니다
    }
        }
    }
});


module.exports = router;