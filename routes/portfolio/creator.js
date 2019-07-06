var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');
var moment = require('moment');

const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', upload.single('thumbnail'), authUtil.isLoggedin, async (req, res) => {

    const insertQuery = 'INSERT INTO creator (thumbnail, url, title, content, user_idx, createdAt) VALUES (?, ?, ?, ?, ?, ?)';
    const insertResult = await db.queryParam_Arr(insertQuery,
        [req.file.location, req.body.url, req.body.title, req.body.content, req.decoded.idx, moment().format('YYYY-MM-DD HH:mm:ss')]);
    if (!insertResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.FAILED_INSERT_WORK));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_WORK));
    }


});

router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const creatorSelectQuery = 'SELECT creator_idx FROM creator WHERE user_idx = ? AND creator_idx = ? ';
    const creatorSelectResult = await db.queryParam_Arr(creatorSelectQuery, [req.decoded.idx, req.body.creator_idx]);

    console.log(creatorSelectResult);

    if (!creatorSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
        if (creatorSelectResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.EMPTY_WORK));    // 작품이 존재하지 않습니다         
        } else {
            const creatorDeleteQuery = 'DELETE FROM creator WHERE creator_idx = ? AND user_idx = ?';
            const creatorDeleteResult = await db.queryParam_Arr(creatorDeleteQuery, [req.body.creator_idx, req.decoded.idx]);

            if (!creatorDeleteResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
            }
            else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_WORK));    // 작품 삭제 성공
            }
        }
    }
});

module.exports = router;
