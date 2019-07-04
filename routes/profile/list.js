var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');


router.get('/:flag', async (req, res) => {

    const flag = Number(req.params.flag);

    switch (flag) {
        case 0://전체 보기 
            // const SelectALLQuery = "SELECT * FROM we WHERE done=0 ORDER BY createdAt";
            // const SelectALLResult = await db.queryParam_None(getWebtoonQuery);
            break;
        case 1://크리에이터 보기 

            const SelectCreQuery = "SELECT user_img, user_nickname, user_type,pick ,detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=?";
            const SelectCreResult = await db.queryParam_Arr(SelectCreQuery, [1]);
            if (!SelectCreResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectCreResult));
            }
            break;
        case 2://에디터 보기 

            break;
        case 3://번역가 보기 
            const SelectTransQuery = "SELECT user_img, user_nickname, user_type,pick, detail_platform, detail_field, detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE user_type=?";
            const SelectTransResult = await db.queryParam_Arr(SelectTransQuery, [3]);
            if (!SelectTransResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectTransResult));
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