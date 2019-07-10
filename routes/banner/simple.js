var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
var moment = require('moment');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 클릭 광고 등록
router.post('/', upload.single('cover_img'), async (req, res) => {
    const insertStateQuery = 'INSERT INTO banner (state, createdAt) VALUES (?, ?)';
    const insertSimpleQuery = 'INSERT INTO banner_simple (cover_img, cover_title, cover_content, bonus, banner_idx) VALUES (?, ?, ?, ?, ?)';

    const insertTransaction = await db.Transaction(async (connection) => {

    const insertStateResult = await connection.query(insertStateQuery, [1, moment().format('YYYY-MM-DD HH:mm:ss')]);

    const bannerIdx = insertStateResult.insertId;

    const insertSimpleResult = await connection.query(insertSimpleQuery, 
        [req.file.location, req.body.cover_title, req.body.cover_content, req.body.bonus, bannerIdx]);

    });
        if(!insertTransaction){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_BANNER));  // 배너 등록 성공
        }
});


module.exports = router;
