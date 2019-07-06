var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 사진, 닉네임, 연락처
// 현재 비밀번호, 새 비밀번호, 로그아웃 x
// 회원정보 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const modifySelectQuery = 'SELECT user_img, user_type, user_nickname, user_number FROM user WHERE user_idx = ?'; 
    const modifySelectResult = await db.queryParam_Arr(modifySelectQuery, [req.decoded.idx]);

    if(!modifySelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 회원정보 조회 실패
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_USER_LIST, modifySelectResult));      // 회원정보 조회 성공
    }
});

// 사진, 닉네임, 연락처, 현재 비밀번호, 새 비밀번호, 로그아웃
// 비밀번호 틀리면 틀렸다고
// 회원정보 수정
router.put('/', upload.single('user_img'), authUtil.isLoggedin, async (req, res) => {
    const modifySelectQuery = 'SELECT * FROM user WHERE user_idx = ?'
    const modifySelectResult = await db.queryParam_Arr(modifySelectQuery, [req.decoded.idx]);
    
    if(!modifySelectResult){  
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    }else{  
        const salt = modifySelectResult[0].salt;
        const hashedCurrentPw = await crypto.pbkdf2(req.body.user_pw.toString(), salt, 1000, 32, 'SHA512');

    // modifySelectResult[0] 해당 유저의 pw와 hashed Pw가 동일할 때 (비밀번호 일치)
        if(modifySelectResult[0].user_pw == hashedCurrentPw.toString('base64')){   

            // 새 비밀번호로 수정
            const hashedNewPw = await crypto.pbkdf2(req.body.new_pw.toString(), salt, 1000, 32, 'SHA512');
            const modifyUpdateQuery = 'UPDATE user SET user_img = ?, user_type = ?, user_nickname = ?, user_number = ?, user_pw = ? WHERE user_idx = ?';
            const modifyUpdateResult = await db.queryParam_Arr(modifyUpdateQuery,
                [req.file.location, req.body.user_type, req.body.user_nickname, req.body.user_number, hashedNewPw.toString('base64'), req.decoded.idx]);

                if(!modifyUpdateResult){
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB  에러
                } else {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_USER_UPDATE));       // 회원정보 수정 성공
                }
        } else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_PASSWORD));      // 현재 비밀번호가 일치 하지 않습니다
        }
    }
});

module.exports = router;
