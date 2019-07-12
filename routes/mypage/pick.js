var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


router.get('/', authUtil.isLoggedin, async (req, res) => {
    let resData = [];
    const selectQuery = "SELECT * FROM picklist WHERE pick_to = ?"
    const selectResult = await db.queryParam_Arr(selectQuery, [req.decoded.idx]);
    if (!selectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else { //쿼리문이 성공했을 때
        for (let i = 0; i < selectResult.length; i++) {
            const item = {
                pickState: 0,
                info: []
            }
            const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
            const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].pick_to]);
            if (SelectPickResult[0] == null) {
                item.pickState = 0;
            } else {
                item.pickState = 1;
            }
            const selectUserQuery = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user.user_idx=?";
            const selectUserResult = await db.queryParam_Arr(selectUserQuery, [selectResult[i].pick_to]);

            item.info.push(selectUserResult[0]);
            resData.push(item);
        }
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "픽 리스트 조회 성공", resData));
    }
});

module.exports = router;