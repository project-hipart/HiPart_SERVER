var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', authUtil.isLoggedin, async (req, res) => {

    const insertTodayQuery = 'INSERT INTO Today (after1,before1,trans_idx) VALUES (?,?, ?)';
    const insertTransQuery = 'INSERT INTO translator (user_idx) VALUES (?)';

    const insertTransaction = await db.Transaction(async (connection) => {
        const insertTransResult = await connection.query(insertTransQuery, [req.decoded.idx]);

        const transIdx = insertTransResult.insertId;
        console.log(transIdx);

        const insertTodayResult = await connection.query(insertTodayQuery, [req.body.before, req.body.after, transIdx]);

    });

    if (!insertTransaction) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "실패"));
    } else { //쿼리문이 성공했을 때
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
    }

});

router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const tranSelectQuery = 'SELECT translator_idx FROM translator WHERE user_idx = ? AND translator_idx = ? ';
    const tranSelectResult = await db.queryParam_Arr(tranSelectQuery, [req.decoded.idx, req.body.translator_idx]);

    console.log(tranSelectResult);

    if (!tranSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
        if (tranSelectResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.EMPTY_WORK));    // 작품이 존재하지 않습니다         
        } else {
            const tranDeleteQuery = 'DELETE FROM translator WHERE translator_idx = ? AND user_idx = ?';
            const tranDeleteResult = await db.queryParam_Arr(tranDeleteQuery, [req.body.translator_idx, req.decoded.idx]);

            if (!tranDeleteResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
            }
            else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_WORK));    // 작품 삭제 성공
            }
        }
    }
});

module.exports = router;
