var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const authUtil = require("../../module/utils/authUtils");   // 토큰이 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const tranSelectQuery = 'SELECT translator_idx FROM translator WHERE user_idx = ? AND translator_idx = ? ';
    const tranSelectResult = await db.queryParam_Arr(tranSelectQuery, [req.decoded.idx, req.body.translator_idx]);

    console.log(tranSelectResult);

    if (!tranSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
            if(tranSelectResult[0] == null){  
                res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.EMPTY_WORK));    // 작품이 존재하지 않습니다         
            } else {
                const tranDeleteQuery = 'DELETE FROM translator WHERE translator_idx = ? AND user_idx = ?';
                const tranDeleteResult = await db.queryParam_Arr(tranDeleteQuery, [req.body.translator_idx, req.decoded.idx]);

                if(!tranDeleteResult) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
                } 
                else{
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_WORK));    // 작품 삭제 성공
            }
        }
    }
});
module.exports = router;
