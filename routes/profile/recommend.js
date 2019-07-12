var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
  로그인 상태X 전체 중에 최신순 4개
  로그인 상태O 사용자 카테고리 선택한거 만족하는 것 중에 4개
  */

/* 
 로그인일때 맞춤 알고리즘
 효율적인 알고리즘을 찾아보자 
 == 하나라도 만족하는 것 중에 최신순으로 ==
 
 1. 필터를 지정하지 않은 사람은 전체중에 최신으로 준다.
 2. 하나라도 만족하는 경우에서 4개만 뽑아서 유저에게 준다.
 3. 하나라도 만족하는 경우가 4개보다 적을경우 
    부족한 만큼 하나라도 만족하지 않는경우의 최신순 부터 채워준다.

 == 4->3->2->1 ==
 방법1. 
 1. DB에서 시간순으로 빼온다.
 2. length라는 변수가 4가 될때 까지 알고리즘을 수행한다.
 3. 4개 만족, 3개 만족 순으로 수행한다. (만족하는게 나오면 값을 넣어주고 length +1)
 
 방법2. 
 1. DB에서 4개 모두 만족하는 것 부터 빼온다. 
 2. 조회한 결과값 길이가 
    4보다 작을경우는 3개만족하는 쿼리를 다시 쓴다.(반복)
    4보다 클 경우는 나온 값들의 4개만 클라한테 보낸다.
*/

router.get('/', authUtil.checkLogin, async (req, res) => {
    console.log(req.decoded);
    if (req.decoded == "NL") {//로그인 상태가 아닐시
        const resData = [];
        const selectQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick, " +
            " detail_platform,  detail_oneline, concept, lang, pd, etc" +
            " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
            " ORDER BY createdAt DESC LIMIT 4"
        const selectResult = await db.queryParam_None(selectQuery);

        for (let i = 0; i < selectResult.length; i++) {
            console.log("로그인 x");

            const item = {
                pickState: 0,
                info: []
            }

            item.info.push(selectResult[i]);
            resData.push(item);

        }

        if (!selectResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, resData));
        }
    } else {//로그인 상태
        console.log(req.decoded.idx);
        const userFindQuery = "SELECT * FROM user WHERE user_idx = ?"
        const userFindResult = await db.queryParam_Arr(userFindQuery, [req.decoded.idx]);
        let nickname = userFindResult[0].user_nickname;
        const userQuery = "SELECT user_nickname,concept, lang, pd, etc" +
            " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
            " WHERE user.user_idx=?"
        const userResult = await db.queryParam_Arr(userQuery, [req.decoded.idx]);
        /* 추천 알고리즘 */

        if (userResult[0] == null) {
            console.log("1");
            let resData = [];
            const selectQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick, " +
                " detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                " ORDER BY createdAt DESC LIMIT 5"
            const selectResult = await db.queryParam_None(selectQuery);
            console.log("selectResult");
            console.log(selectResult);
            console.log(selectResult.length);
            for (let i = 0; i < selectResult.length; i++) {
                console.log("안한사람들");

                const item = {
                    pickState: "",
                    info: []
                }

                if (selectResult[i].user_idx != req.decoded.idx) {
                    const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                    const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].user_idx]);
                    if (SelectPickResult[0] == null) {
                        item.pickState = 0;
                    } else {
                        item.pickState = 1;
                    }
                    item.info.push(selectResult[i]);
                    resData.push(item);
                }


            }
            if (!selectResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, { nickname, resData }));
            }

        }
        else if (userResult[0].concept == 0) {// 자기 취향을 선택안한사람
            let resData = [];
            console.log("2");
            const selectQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick, " +
                " detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                " ORDER BY createdAt DESC LIMIT 5"
            const selectResult = await db.queryParam_None(selectQuery);

            for (let i = 0; i < selectResult.length; i++) {
                console.log("안한사람들");

                const item = {
                    pickState: "",
                    info: []
                }

                if (selectResult[i].user_idx != req.decoded.idx) {
                    const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                    const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].user_idx]);
                    if (SelectPickResult[0] == null) {
                        item.pickState = 0;
                    } else {
                        item.pickState = 1;
                    }
                    item.info.push(selectResult[i]);
                    resData.push(item);
                }


            }
            if (!selectResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, { nickname, resData }));
            }
        } else {
            console.log("3");
            let length = 0;//4개까지 판별 변수
            let resData = [];
            const selectQuery = "SELECT user.user_idx,user_img, user_nickname, user_type,pick, " +
                " detail_platform,  detail_oneline, concept, lang, pd, etc" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                " ORDER BY createdAt DESC"
            const selectResult = await db.queryParam_None(selectQuery);

            for (let i = 0; i < selectResult.length; i++) {//4개 만족할때 까지 돌린다.
                if (selectResult[i].concept == userResult[0].concept || // 하나라도 만족하면
                    selectResult[i].lang == userResult[0].lang ||
                    selectResult[i].pd == userResult[0].pd ||
                    selectResult[i].etc == userResult[0].etc
                ) {
                    const item = {
                        pickState: "",
                        info: []
                    }
                    if (selectResult[i].user_idx != req.decoded.idx) {
                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }
                        item.info.push(selectResult[i]);
                        resData.push(item);
                        length++;
                    }
                }
                if (length == 4) {
                    break;
                }
            }
            if (length < 4) {// 하나라도 만족하는게 4개 이하면 

                for (let i = 0; i < selectResult.length; i++) {
                    if (selectResult[i].concept != userResult[0].concept && // 하나라도 만족하면
                        selectResult[i].lang != userResult[0].lang &&
                        selectResult[i].pd != userResult[0].pd &&
                        selectResult[i].etc != userResult[0].etc
                    ) {// 중복을 막기위해 하나라도 겹친건 안된다.
                        const item = {
                            pickState: "",
                            info: []
                        }

                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, selectResult[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }
                        item.info.push(selectResult[i]);
                        resData.push(item);
                        length++;
                        if (length == 4) {
                            break;
                        }
                    }
                }
            }
            if (!selectResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SELECT, { nickname, resData }));
            }
        }

    }


});

module.exports = router;


