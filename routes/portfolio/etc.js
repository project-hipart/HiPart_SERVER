var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const authUtil = require("../../module/utils/authUtils");


const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', async (req, res) => {

});

module.exports = router;
