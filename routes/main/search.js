var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');
router.get('/:keyword', async (req, res) => {

    const SelectQuery = "SELECT user_img, user_nickname, user_type,pick, detail_platform, detail_oneline, concept,lang,pd,etc" +
        " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_nickname=?";
    const SelectResult = await db.queryParam_Arr(SelectQuery, req.params.keyword);
    if (!SelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectResult));
    }
});

module.exports = router;
