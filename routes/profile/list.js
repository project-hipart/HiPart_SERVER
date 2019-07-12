var express = require('express');
var router = express.Router();


const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');


router.get('/:flag', authUtil.isLoggedin, async (req, res) => {

    console.log(req.parms);
    const flag = Number(req.params.flag);

    switch (flag) {
        case 0://전체 보기 
        
            const resAllData = [];
            const SelectAllQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx ORDER BY createdAt desc";
            const SelectAllResult = await db.queryParam_None(SelectAllQuery);
            for (let i = 0; i < SelectAllResult.length; i++) {
                const item = {
                    pickState: "",
                    info: []
                }
                const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectAllResult[i].user_idx]);
                if (SelectPickResult[0] == null) {
                    item.pickState = 0;
                } else {
                    item.pickState = 1;
                }
                item.info.push(SelectAllResult[i]);
                resAllData.push(item);
            }
            if (!SelectAllResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                console.log(resAllData);
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resAllData));
            }

            break;
        case 1://크리에이터 보기 
            const resCreData = [];
            const SelectCreQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=? ORDER BY createdAt desc";
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
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resCreData));
            }
            break;
        case 2://에디터 보기 
            const resEdiData = [];
            const SelectEdiQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=? ORDER BY createdAt desc";
            const SelectEdiResult = await db.queryParam_Arr(SelectEdiQuery, [2]);
            for (let i = 0; i < SelectEdiResult.length; i++) {
                const item = {
                    pickState: "",
                    info: []
                }
                const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectEdiResult[i].user_idx]);
                if (SelectPickResult[0] == null) {
                    item.pickState = 0;
                } else {
                    item.pickState = 1;
                }
                item.info.push(SelectEdiResult[i]);
                resEdiData.push(item);
            }
            if (!SelectEdiResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resEdiData));
            }
            break;
        case 3://번역가 보기 
            const resTransData = [];
            const SelectTransQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=? ORDER BY createdAt desc";
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
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resTransData));
            }
            break;
        case 4://기타 보기 
            const resEtcData = [];
            const SelectEtcQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick ,detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=? ORDER BY createdAt desc";
            const SelectEtcResult = await db.queryParam_Arr(SelectEtcQuery, [4]);
            for (let i = 0; i < SelectEtcResult.length; i++) {
                const item = {
                    pickState: "",
                    info: []
                }
                const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectEtcResult[i].user_idx]);
                if (SelectPickResult[0] == null) {
                    item.pickState = 0;
                } else {
                    item.pickState = 1;
                }
                item.info.push(SelectEtcResult[i]);
                resEtcData.push(item);
            }
            if (!SelectEtcResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resEtcData));
            }
            break;

        default:

            res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
            return
    }
})
module.exports = router;