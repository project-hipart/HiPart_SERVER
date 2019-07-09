var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
const nodemailer = require('nodemailer');        // e-mail 보낼 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', authUtil.isLoggedin, async (req, res) => {

    const questionSelectQuery = 'SELECT * FROM user WHERE user_idx =?'; 
    const questionSelectResult = await db.queryParam_Parse(questionSelectQuery, req.decoded.idx);

//    console.log(questionSelectResult);

    var transporter = nodemailer.createTransport({  // 여기에서 보내는 거임
        service: 'gmail',
        auth: {
            user: 'hhyyeon0214@gmail.com',  // 필원오빠 껄로 바꿔야하고
            pass: '__'  // git 에 올리지마
        }
    });

    var mailOption = {
        from: questionSelectResult[0].user_email,  // 보내는 사람 이메일
        to: 'hhyyeon0214@gmail.com',    // 필원오빠 껄로 바꾸기 kpw2358@naver.com 아니면 지메일로 바꾸기!
        subject: '[하이팟]'+questionSelectResult[0].user_nickname+'님 문의사항',
        text: req.body.comment
    };

    transporter.sendMail(mailOption, function (err, info) {
        if (err) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); 
            console.error('Send Mail error : ', err);
        }
        else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SENT_EMAIL));  
            console.log('Message sent : ', info);
        }
    });
});


module.exports = router;
