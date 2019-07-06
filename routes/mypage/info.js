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
    const infoSelectQuery = 'SELECT user_img, user_nickname, detail_platform, user_type, point, pick, hifive ' +
    'FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user.user_idx = ?'; 
    const infoSelectResult = await db.queryParam_Arr(infoSelectQuery, [req.decoded.idx]);

// console.log(infoSelectResult);
    if(!infoSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USER_SELECTED, infoSelectResult));     // 회원 조회 성공
    }
});




module.exports = router;