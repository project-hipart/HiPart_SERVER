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

module.exports = router;
