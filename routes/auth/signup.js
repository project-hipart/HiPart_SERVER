var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', upload.single('user_img'), async (req, res) => {

    const selectIdQuery = 'SELECT * FROM user WHERE user_email = ?'
    const selectIdResult = await db.queryParam_Parse(selectIdQuery, req.body.user_email);
    const signupQuery = 'INSERT INTO user (user_email,user_nickname,user_img,user_pw,user_number,salt,user_type,point,pick,notistate) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)';

    console.log(selectIdResult);
    if (selectIdResult[0] == null) {// 이미 존재
        console.log("일치 없음");
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(req.body.user_pw.toString(), salt, 1000, 32, 'SHA512');
        const signupResult = await db.queryParam_Arr(signupQuery, [req.body.user_email, req.body.user_nickname, req.file.location, hashedPw.toString('base64'), req.body.user_number, salt, req.body.user_type, 30, 0, 0]);
        console.log(signupResult);
        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    } else {// 이미존재
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DUPLICATED_ID_FAIL));
    }

});

module.exports = router;
