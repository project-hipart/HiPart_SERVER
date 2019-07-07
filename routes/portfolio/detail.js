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
    const SelectUserQuery = "SELECT user_idx, user_nickname, user_img, user_type FROM user WHERE user_idx = ?"
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
            detail_appeal: "",
            detail_want: "",
            work_idx: [],
            thumbnail: [],
            url: [],
            title: [],
            content: [],
        }
        var resEtcData = {// 기타 데이터
            user_nickname: "",
            user_img: "",
            user_type: 0,
            detail_platform: 0,
            detail_oneline: "",
            detail_appeal: "",
            detail_want: "",
            work_idx: [],
            thumbnail: [],
            url: [],
            title: [],
            content: [],
        }
        var resEdiData = {// 에디터 데이터
            user_nickname: "",
            user_img: "",
            user_type: 0,
            detail_platform: 0,
            detail_oneline: "",
            detail_appeal: "",
            detail_want: "",
            work_idx: [],
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
            detail_oneline: "",
            detail_appeal: "",
            detail_want: "",
            work_idx: [],
            before: [],
            after: [],

        }
        switch (type) {
            case 1: //크리에이터 
                const SelectDetailQuery = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " WHERE user_nickname=?";
                const SelectDetailResult = await db.queryParam_Arr(SelectDetailQuery, [SelectUserResult[0].user_nickname]);
                const SelectCreatorQuery = "SELECT *" +
                    " FROM user JOIN creator ON user.user_idx = creator.user_idx" +
                    " WHERE user_idx=?";
                const SelectCreatorResult = await db.queryParam_Arr(SelectCreatorQuery, [req.decoded.idx]);
                if (!SelectDetailResult) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    if (SelectDetailResult[0] == null) {
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectUserResult[0]));
                    } else {
                        resCreData.user_nickname = SelectDetailResult[0].user_nickname;
                        resCreData.user_img = SelectDetailResult[0].user_img;
                        resCreData.user_type = SelectDetailResult[0].user_type;
                        resCreData.pick = SelectDetailResult[0].pick;
                        resCreData.detail_platform = SelectDetailResult[0].detail_platform;
                        resCreData.detail_subscriber = SelectDetailResult[0].detail_subscriber;
                        resCreData.detail_oneline = SelectDetailResult[0].detail_oneline;
                        resCreData.detail_appeal = SelectDetailResult[0].detail_appeal;
                        resCreData.detail_want = SelectDetailResult[0].detail_want;
                        resCreData.concept = SelectDetailResult[0].concept;
                        resCreData.lang = SelectDetailResult[0].lang;
                        resCreData.pd = SelectDetailResult[0].pd;
                        resCreData.etc = SelectDetailResult[0].etc;
                        if (SelectCreatorResult) {
                            for (let i = 0; i < SelectCreatorResult.length; i++) {
                                resCreData.work_idx.push(SelectCreatorResult[i].creator_idx);
                                resCreData.thumbnail.push(SelectCreatorResult[i].thumbnail);
                                resCreData.url.push(SelectCreatorResult[i].url);
                                resCreData.title.push(SelectCreatorResult[i].title);
                                resCreData.content.push(SelectCreatorResult[i].content);
                            }
                        }

                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resCreData));
                    }

                }

                break;
            case 2: //에디터 
                const SelectDetailQuery2 = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " WHERE user_nickname=?";
                const SelectDetailResult2 = await db.queryParam_Arr(SelectDetailQuery2, [SelectUserResult[0].user_nickname]);
                const SelectEditorQuery = "SELECT *" +
                    " FROM user JOIN editor ON user.user_idx = editor.user_idx" +
                    " WHERE user_idx=?";
                const SelectEditorResult = await db.queryParam_Arr(SelectEditorQuery, [req.decoded.idx]);
                if (!SelectDetailResult2) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    if (SelectDetailResult2[0] == null) {
                        console.log("기본정보만");
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectUserResult[0]));
                    } else {
                        resEdiData.user_nickname = SelectDetailResult2[0].user_nickname;
                        resEdiData.user_img = SelectDetailResult2[0].user_img;
                        resEdiData.user_type = SelectDetailResult2[0].user_type;
                        resEdiData.pick = SelectDetailResult2[0].pick;
                        resEdiData.detail_platform = SelectDetailResult2[0].detail_platform;
                        resEdiData.detail_oneline = SelectDetailResult2[0].detail_oneline;
                        resEdiData.detail_appeal = SelectDetailResult2[0].detail_appeal;
                        resEdiData.detail_want = SelectDetailResult2[0].detail_want;
                        resEdiData.concept = SelectDetailResult2[0].concept;
                        resEdiData.lang = SelectDetailResult2[0].lang;
                        resEdiData.pd = SelectDetailResult2[0].pd;
                        resEdiData.etc = SelectDetailResult2[0].etc;
                        if (SelectEditorResult) {
                            for (let i = 0; i < SelectEditorResult.length; i++) {
                                resEdiData.work_idx.push(SelectEditorResult[i].editor_idx);
                                resEdiData.thumbnail.push(SelectEditorResult[i].thumbnail);
                                resEdiData.url.push(SelectEditorResult[i].url);
                                resEdiData.title.push(SelectEditorResult[i].title);
                                resEdiData.content.push(SelectEditorResult[i].content);
                            }
                        }

                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resEdiData));
                    }

                }
                break;
            case 3: //번역가

                const SelectDetailQuery3 = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " WHERE user_nickname=?";
                const SelectDetailResult3 = await db.queryParam_Arr(SelectDetailQuery3, [SelectUserResult[0].user_nickname]);
                const SelectTransQuery = "SELECT *" +
                    " FROM user JOIN translator ON user.user_idx = translator.user_idx" +
                    " JOIN Today ON Today.trans_idx = translator.translator_idx" +
                    " WHERE user.user_idx=?";
                const SelectTransResult = await db.queryParam_Arr(SelectTransQuery, [req.decoded.idx]);
                if (!SelectDetailResult3) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    if (SelectDetailResult3[0] == null) {
                        console.log("기본정보만");
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectUserResult[0]));
                    } else {
                        resTransData.user_nickname = SelectDetailResult3[0].user_nickname;
                        resTransData.user_img = SelectDetailResult3[0].user_img;
                        resTransData.user_type = SelectDetailResult3[0].user_type;
                        resTransData.pick = SelectDetailResult3[0].pick;
                        resTransData.detail_platform = SelectDetailResult3[0].detail_platform;
                        resTransData.detail_oneline = SelectDetailResult3[0].detail_oneline;
                        resTransData.detail_appeal = SelectDetailResult3[0].detail_appeal;
                        resTransData.detail_want = SelectDetailResult3[0].detail_want;
                        resTransData.concept = SelectDetailResult3[0].concept;
                        resTransData.lang = SelectDetailResult3[0].lang;
                        resTransData.pd = SelectDetailResult3[0].pd;
                        resTransData.etc = SelectDetailResult3[0].etc;
                        if (SelectTransResult) {
                            for (let i = 0; i < SelectTransResult.length; i++) {
                                resTransData.work_idx.push(SelectTransResult[i].today_idx);
                                resTransData.before.push(SelectTransResult[i].before1);
                                resTransData.after.push(SelectTransResult[i].after1);

                            }
                        }

                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resTransData));
                    }

                }
                break;
            case 4: //기타 
                const SelectDetailQuery4 = "SELECT *" +
                    " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx" +
                    " WHERE user_nickname=?";
                const SelectDetailResult4 = await db.queryParam_Arr(SelectDetailQuery4, [SelectUserResult[0].user_nickname]);
                const SelectEtcQuery = "SELECT *" +
                    " FROM user JOIN editor ON user.user_idx = editor.user_idx" +
                    " WHERE user_idx=?";
                const SelectEtcResult = await db.queryParam_Arr(SelectEtcQuery, [req.decoded.idx]);
                if (!SelectDetailResult4) {
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                } else {
                    if (SelectDetailResult4[0] == null) {
                        console.log("기본정보만");
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", SelectUserResult[0]));
                    } else {
                        resEtcData.user_nickname = SelectDetailResult4[0].user_nickname;
                        resEtcData.user_img = SelectDetailResult4[0].user_img;
                        resEtcData.user_type = SelectDetailResult4[0].user_type;
                        resEtcData.pick = SelectDetailResult4[0].pick;
                        resEtcData.detail_platform = SelectDetailResult4[0].detail_platform;
                        resEtcData.detail_oneline = SelectDetailResult4[0].detail_oneline;
                        resEtcData.detail_appeal = SelectDetailResult4[0].detail_appeal;
                        resEtcData.detail_want = SelectDetailResult4[0].detail_want;
                        resEtcData.concept = SelectDetailResult4[0].concept;
                        resEtcData.lang = SelectDetailResult4[0].lang;
                        resEtcData.pd = SelectDetailResult4[0].pd;
                        resEtcData.etc = SelectDetailResult4[0].etc;
                        if (SelectEtcResult) {
                            for (let i = 0; i < SelectEtcResult.length; i++) {
                                resEtcData.work_idx.push(SelectEtcResult[i].editor_idx);
                                resEtcData.thumbnail.push(SelectEtcResult[i].thumbnail);
                                resEtcData.url.push(SelectEtcResult[i].url);
                                resEtcData.title.push(SelectEtcResult[i].title);
                                resEtcData.content.push(SelectEtcResult[i].content);
                            }
                        }

                        res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resEtcData));
                    }

                }
                break;
            default:
                console.log("옳바르지 않은 값");
                res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
                return
        }
    }


})
module.exports = router;

