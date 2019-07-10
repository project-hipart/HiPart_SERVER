var express = require('express');
var router = express.Router();


const authUtil = require("../module/utils/authUtils");

const defaultRes = require('../module/utils/utils');
const statusCode = require('../module/utils/statusCode');
const resMessage = require('../module/utils/responseMessage');
const db = require('../module/pool');


router.get('/:category/:select', authUtil.isLoggedin, async (req, res) => {// 문자열로만 된거 application/json

    const category = Number(req.params.category);
    console.log(category);
    switch (category) {
        case 1://컨셉 선택
            const SelectQuery1 = "SELECT *" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE concept=?";
            const SelectResult1 = await db.queryParam_Arr(SelectQuery1, req.params.select);


            if (!SelectResult1) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                if (SelectResult1[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult1));
                } else {
                    const resData = [];

                    for (let i = 0; i < SelectResult1.length; i++) {
                        const item = {
                            pickState: 0,
                            info: []
                        }
                        console.log(i);
                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectResult1[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }

                        item.info.push(SelectResult1[i]);
                        resData.push(item);
                    }


                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resData));
                }


            }
            break;
        case 2://언어 선택
            const SelectQuery2 = "SELECT *" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE lang=?";
            const SelectResult2 = await db.queryParam_Arr(SelectQuery2, req.params.select);

            if (!SelectResult2) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                if (SelectResult2[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult2));
                } else {
                    const resData = [];

                    for (let i = 0; i < SelectResult2.length; i++) {
                        const item = {
                            pickState: 0,
                            info: []
                        }
                        console.log(i);
                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectResult2[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }

                        item.info.push(SelectResult2[i]);
                        resData.push(item);
                    }


                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resData));
                }
            }
            break;
        case 3://PD 선택
            const SelectQuery3 = "SELECT *" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE pd=?";
            const SelectResult3 = await db.queryParam_Arr(SelectQuery3, req.params.select);
            if (!SelectResult3) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                if (SelectResult3[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult3));
                } else {
                    const resData = [];

                    for (let i = 0; i < SelectResult3.length; i++) {
                        const item = {
                            pickState: 0,
                            info: []
                        }
                        console.log(i);
                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectResult3[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }

                        item.info.push(SelectResult3[i]);
                        resData.push(item);
                    }


                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resData));
                }
            }
            break;
        case 4://기타 선택
            const SelectQuery4 = "SELECT *" +
                " FROM user JOIN user_detail ON user.user_idx = user_detail.user_idx WHERE etc=?";
            const SelectResult4 = await db.queryParam_Arr(SelectQuery4, req.params.select);
            if (!SelectResult4) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "DB 오류"));
            } else {
                if (SelectResult4[0] == null) {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "성공", SelectResult4));
                } else {
                    const resData = [];

                    for (let i = 0; i < SelectResult4.length; i++) {
                        const item = {
                            pickState: 0,
                            info: []
                        }
                        console.log(i);
                        const SelectPickQuery = "SELECT * FROM picklist WHERE pick_from=? AND pick_to=?";
                        const SelectPickResult = await db.queryParam_Arr(SelectPickQuery, [req.decoded.idx, SelectResult4[i].user_idx]);
                        if (SelectPickResult[0] == null) {
                            item.pickState = 0;
                        } else {
                            item.pickState = 1;
                        }

                        item.info.push(SelectResult4[i]);
                        resData.push(item);
                    }


                    res.status(200).send(defaultRes.successTrue(statusCode.OK, "조회 성공", resData));
                }
            }
            break;
        default:
            res.status(200).send(defaultRes.successTrue(statusCode.OK, "다른값"));
            return;
    }






})




module.exports = router;