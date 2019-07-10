var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
var moment = require('moment');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 배너 상세등록
// 커버이미지 커버타이틀 커버소개글
// 상세이미지 상세이름 상세설명 상세주소 제공내역 필수키워드 발표일 사용기간 영업시간 영상등록유의사항 방문시유의사항
// JOIN 어떻게 할지? 그냥 안받을지 말지? detail_img 상세 이미지를 어떻게 받아야 할지
// 변경 후 INSERT에 하나씩 추가
router.post('/', upload.array('imgs'), async (req, res) => {
    const insertStateQuery = 'INSERT INTO banner (state, createdAt) VALUES (?, ?)';

    const insertInfoQuery = 'INSERT INTO banner_detail (cover_img, cover_title, '+
    'cover_content, detail_name, detail_explain, detail_address, detail_offer, detail_keyword, '+
    'detail_date, detail_period, detail_hour, detail_video, detail_visit, banner_idx) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const insertImgQuery = 'INSERT INTO banner_img (detail_img, banner_idx) VALUES (?, ?)';

    const insertTransaction = await db.Transaction(async (connection) => {

    const insertStateResult = await connection.query(insertStateQuery, [2,  moment().format('YYYY-MM-DD HH:mm:ss')]);

    const bannerIdx = insertStateResult.insertId;

    const insertInfoResult = await connection.query(insertInfoQuery, 
        [req.files[0].location, req.body.cover_title, req.body.cover_content, req.body.detail_name, req.body.detail_explain, 
        req.body.detail_address, req.body.detail_offer, req.body.detail_keyword, req.body.detail_date, req.body.detail_period, 
        req.body.detail_hour, req.body.detail_video, req.body.detail_visit, bannerIdx]);

        for(let i = 1; i< req.files.length; i++){
            const insertImgResult = await connection.query(insertImgQuery, [req.files[i].location, bannerIdx]);
        }

    });
        if(!insertTransaction){
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_BANNER));  // 배너 등록 성공
        }
});



//협찬배너 정보 상세조회
router.get('/:banner_idx', async (req, res) => {
    const selectDetailQuery = 'SELECT * FROM banner_img JOIN banner_detail '+
    'ON banner_img.banner_idx = banner_detail.banner_idx '+
    'WHERE banner_img.banner_idx = ? ';

    const selectStateQuery = 'SELECT * FROM banner WHERE banner.banner_idx = ? '

    const selectDetailResult = await db.queryParam_Arr(selectDetailQuery, [req.params.banner_idx]);
    const selectStateResult = await db.queryParam_Arr(selectStateQuery, [req.params.banner_idx]);


    if(!selectDetailResult && !selectStateResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB_ERROR  
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_BANNER, [selectDetailResult. selectStateResult])); 
    }   // 협찬배너 상세조회 성공
});

module.exports = router;
