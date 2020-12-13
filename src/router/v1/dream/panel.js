const express = require('express');
const utils = require('../../../utils');
const router = express.Router();
const constant = require("../../../constant");
const moment = require('moment'); 
const { body, validationResult, query } = require('express-validator');
const PowerPanelTb = require('../../../db/dream/PowerPanelTb');
const PowerTodoListTb = require("../../../db/dream/PowerTodoListTb");

function queryPanel(user_id) {
    return new Promise((resolve, reject) => {
        let panelQuery = PowerPanelTb.find({ user_id: db.getObjectId(user_id)});
        panelQuery.sort({ create_time: - 1 });
        panelQuery.limit(1)
        panelQuery.exec(function (error, panels) {
            if (error) {
                reject(error);
            }
            else {
                resolve(panels);
            }
        });
    });
}

function createPanel(user_id, panel) {
    return new Promise((resolve, reject) => {
        let m = new PowerPanelTb;
        m.user_id = db.getObjectId(user_id);
        m.healthy = panel.healthy;
        m.entertainment = panel.entertainment;
        m.feeling = panel.feeling;
        m.cause = panel.cause;
        m.create_time = moment().toDate();
        m.save().then(result => {
            resolve(result);
        });
    });
}


function queryTodoList(user_id, page, per_page) {
    return new Promise((resolve, reject) => {
        let Monday = moment().startOf("isoWeek");
        let todolistQuery = PowerTodoListTb.find({ user_id: db.getObjectId(user_id)});
        todolistQuery.where("create_time").gt(Monday);
        todolistQuery.sort({ create_time: - 1 });
        todolistQuery.skip(per_page * page)
        todolistQuery.limit(per_page)
        todolistQuery.exec(function (error, todos) {
            if (error) {
                reject(error);
            }
            else {
                resolve(todos);
            }
        });
    });
}


function queryHistoryTodoList(user_id, page, per_page) {
    return new Promise((resolve, reject) => {
        let todolistQuery = PowerTodoListTb.find({ user_id: db.getObjectId(user_id)});
        todolistQuery.sort({ create_time: - 1 });
        todolistQuery.skip(per_page * page)
        todolistQuery.limit(per_page)
        todolistQuery.exec(function (error, todos) {
            if (error) {
                reject(error);
            }
            else {
                resolve(todos);
            }
        });
    });
}


function createTodoList(user_id, todo) {
    return new Promise((resolve, reject) => {
        let m = new PowerTodoListTb;
        m.user_id = db.getObjectId(user_id);
        m.type = todo.type;
        m.content = todo.content;
        m.status = constant.ConstantMap.TodoStatusReady;
        m.create_time = moment().toDate();
        m.update_time = m.create_time;
        m.save().then(result => {
            resolve(result);
        });
    });
}

function findTodoList(user_id, todo_id) {
    return new Promise((resolve, reject) => {
        let todolistQuery = PowerTodoListTb.findOne({ _id: db.getObjectId(todo_id), user_id: db.getObjectId(user_id)});
        todolistQuery.exec(function (error, todo) {
            if (error) {
                reject(error);
            }
            else {
                resolve(todo);
            }
        });
    });
}



router.get('/panel', utils.asyncWrapper(async function (req, res) {
    let panels = await queryPanel(req.jwt.id);
    if (panels && panels.length > 0){
        // 将验证码设置为使用过
        let panel = panels[0];
        constant.HttpMap.GET.to(res, {
            healthy: panel.healthy,
            entertainment: panel.entertainment,
            feeling: panel.feeling,
            cause: panel.cause,
        });
    }
    else {
        // 返回默认值
        constant.HttpMap.GET.to(res, {
            healthy: constant.ConstantMap.Level3,
            entertainment: constant.ConstantMap.Level3,
            feeling: constant.ConstantMap.Level3,
            cause: constant.ConstantMap.Level3,
        });
    }
}));

router.post('/panel', [
    body('healthy').isInt({ min: 1, max: 5 }),
    body('entertainment').isInt({ min: 1, max: 5 }),
    body('feeling').isInt({ min: 1, max: 5 }),
    body('cause').isInt({ min: 1, max: 5 }),
], utils.asyncWrapper(async function (req, res) {
    let healthy = req.body.healthy;
    let entertainment = req.body.entertainment;
    let feeling = req.body.feeling;
    let cause = req.body.cause;
    let panel = await createPanel(req.jwt.id, {
        healthy,
        entertainment,
        feeling,
        cause
    });

    constant.HttpMap.POST.to(res, {
        healthy: panel.healthy,
        entertainment: panel.entertainment,
        feeling: panel.feeling,
        cause: panel.cause,
    });
}));


router.get('/todos', [
    query('opt').isInt({ min: 1, max: 2 }),
    query('page').isInt({ min: 0 }),
    query('per_page').isInt({ min: 10 }),
], utils.asyncWrapper(async function (req, res) {
    let opt = req.query.opt;
    let page = req.query.page;
    let per_page = req.query.per_page;
    
    let todos = [];
    if (opt === constant.ConstantMap.TodoOptCurrent) {
        todos = await queryTodoList(req.jwt.id, page, per_page);
    }
    else if (opt === constant.ConstantMap.TodoOptHistory) {
        todos = await queryHistoryTodoList(req.jwt.id, page, per_page);
    }

    let formatTodos = [];
    for (let i = 0; i < todos.length; i++) {
        formatTodos.push({
            type: todos[i].type,
            content: todos[i].content,
            status: todos[i].status,
            create_time: todos[i].create_time,
            update_time: todos[i].update_time,
        });
    }

    constant.HttpMap.GET.to(res, {
        page: page,
        per_page: per_page,
        count: formatTodos.length,
        list: formatTodos
    });
}));

router.post('/todos', [
    body('type').isInt({ min: 1, max: 4 }),
    body('content').notEmpty(),
], utils.asyncWrapper(async function (req, res) {
    let todo = await createTodoList(req.jwt.id, {
        type : req.body.type,
        content: req.body.content
    });


    constant.HttpMap.POST.to(res, {
        type: todo.type,
        content: todo.content,
        status: todo.status,
        create_time: todo.create_time,
        update_time: todo.update_time,
    });
}));

router.get('/todos/:todo_id', utils.asyncWrapper(async function (req, res) {
    let todo = await findTodoList(req.jwt.id, req.query.todo_id);

    if (todo) {
        constant.HttpMap.GET.to(res, {
            type: todo.type,
            content: todo.content,
            status: todo.status,
            create_time: todo.create_time,
            update_time: todo.update_time,
        });
    }
    else {
        constant.ErrorMap.TodoListNotExist.to(res);
    }
}));


router.put('/todos/:todo_id/content', [
    body('type').isInt({ min: 1, max: 4 }),
    body('content').notEmpty(),
], utils.asyncWrapper(async function (req, res) {
    let todo = await findTodoList(req.jwt.id, req.query.todo_id);
    if (todo) {
        todo.type = type;
        todo.content = content;
        todo.update_time = moment().toDate();
        await todo.save();


        constant.HttpMap.UPDATE.to(res, {
            type: todo.type,
            content: todo.content,
            status: todo.status,
            create_time: todo.create_time,
            update_time: todo.update_time,
        });
    }
    else {
        constant.ErrorMap.TodoListNotExist.to(res);
    }
}));

router.put('/todos/:todo_id/status', [
    body('status').isInt({ min: 1, max: 3 }),
], utils.asyncWrapper(async function (req, res) {
    let todo = await findTodoList(req.jwt.id, req.query.todo_id);
    if (todo) {
        todo.status = status;
        todo.update_time = moment().toDate();
        await todo.save();
        constant.HttpMap.UPDATE.to(res, {
            type: todo.type,
            content: todo.content,
            status: todo.status,
            create_time: todo.create_time,
            update_time: todo.update_time,
        });
    }
    else {
        constant.ErrorMap.TodoListNotExist.to(res);
    }
}));

router.delete('/todos/:todo_id', utils.asyncWrapper(async function (req, res) {
    let todo = await findTodoList(req.jwt.id, req.query.todo_id);
    if (todo) {
        await todo.delete();
        constant.HttpMap.DELETE.to(res);
    }
    else {
        constant.ErrorMap.TodoListNotExist.to(res);
    }
}));
 
module.exports = router;