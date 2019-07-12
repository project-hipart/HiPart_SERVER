var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');        // e-mail 보낼 때 사용
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

/* 아이디 찾기 
입력 : 닉네임 핸드폰번호
바로 팝업창으로 아이디(이메일)을 보여줌 
잘못된 입력 : "올바르지 않은 정보 입니다." 
*/
router.get('/id/:nickname/:number', async (req, res) => {
    const selectIdQuery = 'SELECT user_email FROM user WHERE user_nickname = ? AND user_number = ? '; 
    const selectIdResult = await db.queryParam_Arr(selectIdQuery, [req.params.nickname, req.params.number]);

    console.log(selectIdResult);
    if(!selectIdResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 회원정보 조회 실패
    }else{
        if(selectIdResult[0].user_email == null){   // user_email이 존재하지 않은 경우
            // 팝업창 띄워주기 
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NOT_CORRECT_INFO));      // 올바르지 않은 정보 입니다
        } else {    // user_email이 존재하는 경우
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FIND_USER_ID, selectIdResult));      // 아이디 찾기 성공 
        }
    }
});

/* 비밀번호 찾기
입력 : 이메일 핸드폰번호
이메일으로 비밀번호를 보내줌
잘못된 입력 : "올바르지 않은 정보 입니다. "
*/
// 원래있는 비밀번호로 보내주는지? 아니면 랜덤값으로 보내주는지? 랜덤값이면 DB도 같이 수정해야함
router.get('/pwd/:email/:number', async (req, res) => { // 
    const selectPwQuery = 'SELECT * FROM user WHERE user_email = ? AND user_number = ? '; 
    const selectPwResult = await db.queryParam_Arr(selectPwQuery, [req.params.email, req.params.number]);

    console.log(selectPwResult);
    if(!selectPwResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // 회원정보 조회 실패
    }else {
        if(selectPwResult[0] == null){   // user_email(아이디)가 존재하지 않을 경우
            // 이메일로 비밀번호를 보내줌
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NOT_CORRECT_INFO));      // 올바르지 않은 정보 입니다
        } else {    // user_email이 존재하는 경우
                    /* 이메일로 비밀번호를 전송 
                    원래 있는 user 비밀번호를 랜덤 값으로 update 
                    이메일로 user_pw 보내주기 */

                    // 랜덤 비밀번호 + 솔트 값을 디비에 저장 후 디비에서 가져올 때 비밀번호 솔트 풀어주기
                const salt = selectPwResult[0].salt;
                console.log(salt);

                const random = await crypto.randomBytes(32); // 랜덤 값을 받음
                const newRandomPwd = await random.toString('base64');   // 새로운 랜덤 패스워드

                const hashedRandomPwd = await crypto.pbkdf2(newRandomPwd.toString(), salt, 1000, 32, 'SHA512');     // 해쉬된 패스워드

                // user_email에 새로운 비밀번호를 수정 
                const updatePwQuery = 'UPDATE user SET user_pw = ? WHERE user_email = ?';
                const updatePwResult = await db.queryParam_Arr(updatePwQuery, [hashedRandomPwd.toString('base64'), req.params.email]);  // 해쉬된 패스워드를 디비에 저장

                if(!updatePwResult){
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    let transporter = nodemailer.createTransport({  // 여기에서 보내는 거임
                        service: 'gmail',
                        auth: {
                            user: 'hhyyeon0214@gmail.com',  // 필원오빠 껄로 바꿔야하고
                            pass: ''  // git 에 올리지마
                        }
                    });
                
                    let mailOption = {
                        from: 'hhyyeon0214@gmail.com',  // 보내는 사람 이메일
                        to: selectPwResult[0].user_email,    // 필원오빠 껄로 바꾸기 kpw2358@naver.com 아니면 지메일로 바꾸기!
                        subject: '[하이팟]고객님의 새로운 비밀번호 입니다',
                        text: '하이팟 고객님의 새로운 비밀번호는   '+ newRandomPwd + '     입니다. 로그인 후 비밀번호를 수정해주세요.'
                    };
                
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); 
                            console.error('Send Mail error : ', err);
                        } else {
                            console.log("성공")
                            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SENT_EMAIL));  
                            console.log('Message sent : ', info);
                        }
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.FIND_USER_PW));      // 비밀번호 찾기 성공 
                    });
            }   
        }
    }
});

module.exports = router;

