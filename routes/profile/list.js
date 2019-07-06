var express = require('express');
var router = express.Router();


const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');


router.get('/:flag', authUtil.isLoggedin, async (req, res) => {

    const flag = Number(req.params.flag);

    switch (flag) {
        case 0://전체 보기 
            // const SelectALLQuery = "SELECT * FROM we WHERE done=0 ORDER BY createdAt";
            // const SelectALLResult = await db.queryParam_None(getWebtoonQuery);
            break;
        case 1://크리에이터 보기 
            const resCreData = [];
            const SelectCreQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=?";
            const SelectCreResult = await db.queryParam_Arr(SelectCreQuery, [1]);
            for (let i = 0; i < SelectCreResult.length; i++) {
                const item = {
                    pickState: "",
                    info: []
                }
                const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectCreResult[i].user_idx]);
                if (SelectPickResult[0] == null) {
                    item.pickState = 0;
                } else {
                    item.pickState = 1;
                }
                item.info.push(SelectCreResult[i]);
                resCreData.push(item);
            }
            if (!SelectCreResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resCreData));
            }
            break;
        case 2://에디터 보기 

            break;
        case 3://번역가 보기 
            const resTransData = [];
            const SelectTransQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=?";
            const SelectTransResult = await db.queryParam_Arr(SelectTransQuery, [3]);
            for (let i = 0; i < SelectTransResult.length; i++) {
                const item = {
                    pickState: "",
                    info: []
                }
                const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectTransResult[i].user_idx]);
                if (SelectPickResult[0] == null) {
                    item.pickState = 0;
                } else {
                    item.pickState = 1;
                }
                item.info.push(SelectTransResult[i]);
                resTransData.push(item);
            }
            if (!SelectTransResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resTransData));
            }
            break;
        case 4://기타 보기 

            break;

        default:

            res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
            return
    }
})
module.exports = router;