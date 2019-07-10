var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// banner 조회
// banner_idx, banner_img, banner_title, banner_content, state
// state 1이면 클릭으로
// state 2이면 협찬으로
router.get('/', async (req, res) => {
    const resAllData = []; // 배열 생성
    const selectList1Query = 'SELECT cover_img, cover_title, cover_content, state '+
    ' FROM banner_simple JOIN banner ON banner_simple.banner_idx = banner.banner_idx '; // 클릭배너 조회
    const selectList2Query = 'SELECT cover_img, cover_title, cover_content, state '+
    ' FROM banner_detail JOIN banner ON banner_detail.banner_idx = banner.banner_idx '; // 협찬배너 조회

    const selectList1Result = await db.queryParam_None(selectList1Query);
    const selectList2Result = await db.queryParam_None(selectList2Query);

    for(let i = 0; i < selectList1Result.length; i++){
        let item = {
            info: []
        }
        item.info.push(selectList1Result[i]);
        resAllData.push(item);
    }

    for(let i = 0 ; i < selectList2Result.length; i++){
        let item = {
            info: []
        }
        item.info.push(selectList2Result[i]);
        resAllData.push(item);
    }

    resAllData.sort(function(a, b) {return b-a});

    if(!selectList1Result && !selectList2Result){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB_ERROR  
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_BANNER, [resAllData])); // 배너 조회 성공
    }
});

module.exports = router;

/// 심플
// 디테일 
// 두개다 가져와서
// 상태값 보여줘
// 배열을 만들어서 다 푸시함 
// 자바스크립트의 기능중에 솔트가 있음 createdAT
