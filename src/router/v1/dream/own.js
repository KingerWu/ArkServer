const express = require('express');
const utils = require('../../../utils');
const router = express.Router();
const constant = require("../../../constant");
const { body, validationResult } = require('express-validator');
const OwnWorthTb = require("../../../db/dream/OwnWorthTb");


function queryWorth(user_id, type) {
    return new Promise((resolve, reject) => {
        let worthQuery = OwnWorthTb.findOne({ user_id: db.getObjectId(user_id), type: type});
        worthQuery.exec(function (error, worth) {
            if (error) {
                reject(error);
            }
            else {
                resolve(worth);
            }
        });
    });
}
function createWorth(user_id, type, content) {
    return new Promise((resolve, reject) => {
        let m = new OwnWorthTb;
        m.user_id = db.getObjectId(user_id);
        m.type = type;
        m.content = content;
        m.create_time = moment().toDate();
        m.update_time = m.create_time;
        m.save().then(result => {
            resolve(result);
        });
    });
}

function findWorth(user_id, type) {
    return new Promise((resolve, reject) => {
        let worthQuery = OwnWorthTb.findOne({ user_id: db.getObjectId(user_id), type: type});
        worthQuery.exec(function (error, worth) {
            if (error) {
                reject(error);
            }
            else {
                resolve(worth);
            }
        });
    });
}

router.get('/worth', [
    query('type').isInt({ min: 1, max: 2 }),
], utils.asyncWrapper(async function (req, res) {
    let worth = await queryWorth(req.jwt.id, type);
    if (worth){
        constant.HttpMap.GET.to(res, {
            type: worth.type,
            content: worth.content, 
            create_time: worth.create_time,
            update_time: worth.update_time,
        });
    }
    else {
        constant.ErrorMap.WorthNotSet.to(res);
    }
}));


router.post('/worth', [
    body('type').isInt({ min: 1, max: 2 }),
    body('content').isLength({ min: 1, max: 300 }),
], utils.asyncWrapper(async function (req, res) {
    let worth = await findWorth(req.jwt.id, type);
    if (worth) {
        worth.content = content;
        worth.update_time = moment().toDate();
        await worth.save();
    }
    else {
        worth = await createWorth(req.jwt.id, type, content);
    }

    constant.HttpMap.POST.to(res, {
        type: worth.type,
        content: worth.content, 
        create_time: worth.create_time,
        update_time: worth.update_time,
    });
}));

module.exports = router;