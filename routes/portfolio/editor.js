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
    const editorInsertQuery = 'INSERT INTO editor (thumbnail, url, title, content, user_idx, createdAt) VALUES (?,?,?,?,?,?)'; 
    const editorInsertResult = await db.queryParam_Arr(editorInsertQuery,[req.file.location, req.body.url, req.body.title, req.body.content, req.decoded.idx,
    moment().format('YYYY-MM-DD HH:mm:ss')]);

    if(!editorInsertResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.FAILED_INSERT_WORK)); 
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_WORK));       
    }
});

// 작품 삭제
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const editorSelectQuery = 'SELECT editor_idx FROM editor WHERE user_idx = ? AND editor_idx = ? ';
    const editorSelectResult = await db.queryParam_Arr(editorSelectQuery, [req.decoded.idx, req.body.editor_idx]);

    console.log(editorSelectResult);

    if (!editorSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    } else {
            if(editorSelectResult[0] == null){  
                res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.EMPTY_WORK));    // 작품이 존재하지 않습니다         
            } else {
                const editorDeleteQuery = 'DELETE FROM editor WHERE editor_idx = ? AND user_idx = ?';
                const editorDeleteResult = await db.queryParam_Arr(editorDeleteQuery, [req.body.editor_idx, req.decoded.idx]);

                if(!editorDeleteResult) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
                } 
                else{
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_WORK));    // 작품 삭제 성공
            }
        }
    }
});

module.exports = router;
