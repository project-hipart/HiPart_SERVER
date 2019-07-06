var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");
var moment = require('moment');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');



router.put('/', authUtil.isLoggedin, async (req, res) => {

    const selectUserQuery = "SELECT * FROM user_detail WHERE user_idx =?"
    const selectUserResult = await db.queryParam_Arr(selectUserQuery, [req.decoded.idx]);

    if (selectUserResult[0] == null) {
        const insertQuery = 'INSERT INTO user_detail ( detail_platform,' +
            'detail_subscriber, detail_oneline,detail_appeal,detail_want,user_idx,concept, lang,pd,etc,createdAt)' +
            ' VALUES ( ?, ?, ?, ?,  ?, ?,?,?,?,?,?)';
        const insertResult = await db.queryParam_Arr(insertQuery,
            [req.body.detail_platform, req.body.detail_subscriber
                , req.body.detail_oneline, req.body.detail_appeal,
            req.body.detail_want, req.decoded.idx,
            req.body.concept, req.body.lang, req.body.pd, req.body.etc, moment().format('YYYY-MM-DD HH:mm:ss')]);
        if (!insertResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
        }
    } else {
        const updateQuery = 'UPDATE user_detail SET  detail_platform=?,' +
            'detail_subscriber=?, detail_oneline=?,detail_appeal=?,detail_want=?,user_idx=?,' +
            'concept=?, lang=?,pd=?,etc=?' +
            ' WHERE user_idx =?';
        const updateResult = await db.queryParam_Arr(updateQuery,
            [req.body.detail_platform, req.body.detail_subscriber
                , req.body.detail_oneline, req.body.detail_appeal,
            req.body.detail_want, req.decoded.idx,
            req.body.concept, req.body.lang, req.body.pd, req.body.etc, req.decoded.idx]);
        if (!updateResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
        } else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공"));
        }
    }

});


router.get('/', authUtil.isLoggedin, async (req, res) => {
    const SelectUserQuery = "SELECT user_type FROM user WHERE user_idx = ?"
    const SelectUserResult = await db.queryParam_Arr(SelectUserQuery, [req.decoded.idx]);

    if (SelectUserResult[0] == null) {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "만족하는 유저가 없습니다."));
    } else {
        const type = Number(SelectUserResult[0].user_type);


        var resCreData = {// 크리에이터 데이터
            user_nickname: "",
            user_img: "",
            user_type: 0,
            detail_platform: 0,
            detail_subscriber: "",
            detail_oneline: "",
            detail_detail: "",
            detail_appeal: "",
            detail_want: "",
            thumbnail: [],
            url: [],
            title: [],
            content: [],
        }

        var resTransData = {//번역가 데이터
            user_nickname: "",
            user_img: "",
            user_type: 0,
            detail_platform: 0,
            detail_subscriber: "",
            detail_oneline: "",
            detail_detail: "",
            detail_appeal: "",
            detail_want: "",
            before: [],
            after: [],

        }
        switch (type) {
            case 1: //크리에이터 
                const SelectDetailQuery = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " JOIN creator ON user.user_idx = creator.user_idx" +
                    " WHERE user_nickname=?";
                const SelectDetailResult = await db.queryParam_Arr(SelectDetailQuery, [req.params.nickname]);

                if (!SelectDetailResult) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    resCreData.user_nickname = SelectDetailResult[0].user_nickname;
                    resCreData.user_img = SelectDetailResult[0].user_img;
                    resCreData.user_type = SelectDetailResult[0].user_type;
                    resCreData.pick = SelectDetailResult[0].pick;
                    resCreData.detail_platform = SelectDetailResult[0].detail_platform;
                    resCreData.detail_subscriber = SelectDetailResult[0].detail_subscriber;
                    resCreData.detail_oneline = SelectDetailResult[0].detail_oneline;
                    resCreData.detail_detail = SelectDetailResult[0].detail_detail;
                    resCreData.detail_appeal = SelectDetailResult[0].detail_appeal;
                    resCreData.detail_want = SelectDetailResult[0].detail_want;
                    resCreData.concept = SelectDetailResult[0].concept;
                    resCreData.lang = SelectDetailResult[0].lang;
                    resCreData.pd = SelectDetailResult[0].pd;
                    resCreData.etc = SelectDetailResult[0].etc;
                    resCreData.user_idx = SelectDetailResult[0].user_idx;
                    for (let i = 0; i < SelectDetailResult.length; i++) {
                        resCreData.thumbnail.push(SelectDetailResult[i].thumbnail);
                        resCreData.url.push(SelectDetailResult[i].url);
                        resCreData.title.push(SelectDetailResult[i].title);
                        resCreData.content.push(SelectDetailResult[i].content);
                    }
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resCreData));
                }

                break;
            case 2: //에디터 
                console.log("에디");
                // const SelectALLQuery = "SELECT * FROM we WHERE done=0 ORDER BY createdAt";
                // const SelectALLResult = await db.queryParam_None(getWebtoonQuery);
                break;
            case 3: //번역가
                SelectDetailQuery3 = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " JOIN translator ON user.user_idx = translator.user_idx" +
                    " JOIN Today ON Today.trans_idx = translator.translator_idx" +
                    " WHERE user_nickname=?";
                SelectDetailResult3 = await db.queryParam_Arr(SelectDetailQuery3, [req.params.nickname]);
                console.log("아아", SelectDetailResult3);
                if (!SelectDetailResult3) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    resTransData.user_nickname = SelectDetailResult3[0].user_nickname;
                    resTransData.user_img = SelectDetailResult3[0].user_img;
                    resTransData.user_type = SelectDetailResult3[0].user_type;
                    resCreData.pick = SelectDetailResult3[0].pick;
                    resTransData.detail_platform = SelectDetailResult3[0].detail_platform;
                    resTransData.detail_oneline = SelectDetailResult3[0].detail_oneline;
                    resTransData.detail_detail = SelectDetailResult3[0].detail_detail;
                    resTransData.detail_appeal = SelectDetailResult3[0].detail_appeal;
                    resTransData.detail_want = SelectDetailResult3[0].detail_want;
                    resTransData.concept = SelectDetailResult3[0].concept;
                    resTransData.lang = SelectDetailResult3[0].lang;
                    resTransData.pd = SelectDetailResult3[0].pd;
                    resTransData.etc = SelectDetailResult3[0].etc;
                    resTransData.user_idx = SelectDetailResult3[0].user_idx;
                    for (let i = 0; i < SelectDetailResult3.length; i++) {
                        resTransData.before.push(SelectDetailResult3[i].before1);
                        resTransData.after.push(SelectDetailResult3[i].after1);
                    }
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resTransData));
                }
                break;
            case 4: //기타
                console.log("기타");
                // const SelectALLQuery = "SELECT * FROM we WHERE done=0 ORDER BY createdAt";
                // const SelectALLResult = await db.queryParam_None(getWebtoonQuery);
                break;
            default:
                console.log("옳바르지 않은 값");
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
                return
        }
    }


})
module.exports = router;

