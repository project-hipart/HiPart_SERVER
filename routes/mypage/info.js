var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
const upload = require('../../config/multer');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 사진, 닉네임, 플랫폼, 크리 에디 번역 ? , pick, picker
// 마이픽, 하이파이브, 상세포폴, 
// 마이페이지 조회
router.get('/', authUtil.isLoggedin, async (req, res) => { // user_type 크리에이터 에디터 번역 // picker 추가하기
    const infoSelectQuery = 'SELECT * FROM user WHERE user.user_idx = ?'; 
    const detailSelectQuery = 'SELECT * FROM user_detail WHERE user_idx = ?';

    const infoSelectResult = await db.queryParam_Arr(infoSelectQuery, [req.decoded.idx]);
    const detailSelectResult = await db.queryParam_Arr(detailSelectQuery, [req.decoded.idx]); 

    const resData  = {
        user_img: "",
        user_nickname: "",
        detail_platform: 0, // INT
        user_type: 0,   // INT
        point: 0,   // INT
        pick: 0,
        hifive: 0,
    };

    resData.user_img = infoSelectResult[0].user_img
    resData.user_nickname = infoSelectResult[0].user_nickname
    resData.user_type = infoSelectResult[0].user_type
    resData.point = infoSelectResult[0].point
    resData.pick = infoSelectResult[0].pick
    resData.hifive = infoSelectResult[0].hifive

    if(detailSelectResult[0] != null){
        resData.detail_platform = detailSelectResult[0].detail_platform
    }
// console.log(infoSelectResult);
    if(!infoSelectResult || !detailSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USER_SELECTED, resData));     // 회원 조회 성공
    }
});




module.exports = router;