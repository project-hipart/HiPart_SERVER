var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const authUtil = require("../../module/utils/authUtils");   // 토큰이 있을 때 사용
var moment = require('moment'); // 시간

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 작품 등록
router.post('/', upload.single('thumbnail'), authUtil.isLoggedin, async (req, res) => {
    const etcInsertQuery = 'INSERT INTO etc (thumbnail, url, title, content, user_idx, createdAt) VALUES (?,?,?,?,?,?)';
    const etcInsertResult = await db.queryParam_Arr(etcInsertQuery, [req.file.location, req.body.url, req.body.title, req.body.content, req.decoded.idx,
    moment().format('YYYY-MM-DD HH:mm:ss')]);

    // console.log(etcInsertResult);

    if (!etcInsertResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.FAILED_INSERT_WORK));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_WORK));
    }
});

// 작품 삭제
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const etcSelectQuery = 'SELECT etc_idx FROM etc WHERE user_idx = ? AND etc_idx = ? ';
    for (let i = 0; i < req.body.work_idx.length; i++) {
        let etcSelectResult = await db.queryParam_Arr(etcSelectQuery, [req.decoded.idx, req.body.work_idx[i]]);
        if (!etcSelectResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
        } else if (etcSelectResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, "작품번호가 이상한게 있습니다."));
        }

    }

    const etcDeleteQuery = 'DELETE FROM etc WHERE etc_idx = ? AND user_idx = ?';

    for (let i = 0; i < req.body.work_idx.length; i++) {
        console.log(req.body.work_idx[i]);
        let etcDeleteResult = await db.queryParam_Arr(etcDeleteQuery, [req.body.work_idx[i], req.decoded.idx]);
        if (!etcDeleteResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
        }
    }

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_WORK));
});
module.exports = router;