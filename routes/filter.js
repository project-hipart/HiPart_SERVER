var express = require('express');
var router = express.Router();

const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');
const db = require('../module/pool');


router.get('/:category/:select', async (req, res) => {// 문자열로만 된거 application/json

    const category = Number(req.params.category);
    console.log(category);
    switch (category) {
        case 1://컨셉 선택
            const SelectQuery1 = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE concept=?";
            const SelectResult1 = await db.queryParam_Arr(SelectQuery1, req.params.select);
            if (!SelectResult1) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult1));
            }
            break;
        case 2://언어 선택
            const SelectQuery2 = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE lang=?";
            const SelectResult2 = await db.queryParam_Arr(SelectQuery2, req.params.select);
            if (!SelectResult2) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult2));
            }
            break;
        case 3://PD 선택
            const SelectQuery3 = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE pd=?";
            const SelectResult3 = await db.queryParam_Arr(SelectQuery3, req.params.select);
            if (!SelectResult3) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult3));
            }
            break;
        case 4://기타 선택
            const SelectQuery4 = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE etc=?";
            const SelectResult4 = await db.queryParam_Arr(SelectQuery3, req.params.select);
            if (!SelectResult4) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult4));
            }
            break;
        default:
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "다른값"));
            return;
    }






})




module.exports = router;