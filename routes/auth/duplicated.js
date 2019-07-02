var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');
router.get('/', async (req, res) => {

    console.log("여기");
})
router.get('/:flag/:input', async (req, res) => {
    const flag = Number(req.params.flag);
    // 중복아니면 0, 중복되면 1을 클라한테 전해준다. 
    switch (flag) {
        case 1: //Email 중복 검사
            const selectEmailQuery = 'SELECT * FROM user WHERE user_email = ?'
            const selectEmailResult = await db.queryParam_Parse(selectEmailQuery, req.params.input);
            if (!selectEmailResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                if (selectEmailResult[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NOT_DUPLICATED, 0));
                } else
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.DUPLICATED, 1));
            }
            break
        case 2: //nickname 중복 검사

            const selectNicknameQuery = 'SELECT * FROM user WHERE user_nickname = ?'
            const selectNicknameResult = await db.queryParam_Parse(selectNicknameQuery, req.params.input);
            if (!selectNicknameResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                if (selectNicknameResult[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NOT_DUPLICATED, 0));
                } else
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.DUPLICATED, 1));
            }
            break
        default:

            res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
            return
    }
});
module.exports = router;