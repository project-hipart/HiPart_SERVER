var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');
// router.get('/:keyword', async (req, res) => {

//     const SelectQuery = "SELECT user_img, user_nickname, user_type,pick, detail_platform, detail_oneline, concept,lang,pd,etc" +
//         " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_nickname=?";
//     const SelectResult = await db.queryParam_Arr(SelectQuery, req.params.keyword);
//     if (!SelectResult) {
//         res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
//     } else {
//         res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectResult));
//     }
// });
router.get('/:keyword', authUtil.isLoggedin, async (req, res) => {

    console.log("req.params: ", req.params);
    const SelectQuery = "SELECT *" +
        " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_nickname=?"


    const selectResult = await db.queryParam_Arr(SelectQuery, req.params.keyword);
    console.log("A", selectResult);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        const resData = [];

        const item = {
            pickState: 0,
            info: []
        }

        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[0].user_idx]);
        if (SelectPickResult[0] == null) {
            item.pickState = 0;
        } else {
            item.pickState = 1;
        }


        item.info.push(selectResult[0]);
        resData.push(item);
        console.log("searchResData", resData);
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resData));
    }


});

module.exports = router;
