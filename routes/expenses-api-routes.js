const db = require("../models");
const moment = require('moment');

module.exports = function (app) {

    //GET to view all registered expenses--DEV
    app.get("/api/expenses/", function (req, res) {

        //remember to use the table name and NOT the constructor name here
        db.expenses.findAll({}).then(function (data) {

            res.json(data);

        });

    });

    app.get("/api/expenses/month/:id", function (req, res) {

        let userID = req.params.id;
        //const Op = db.sequelize.Op;
        const op = db.Sequelize.Op;
        
        let date1 = moment("2018-11-01");
        let date2 = moment("2018-11-31");
        //remember to use the table name and NOT the constructor name here
        db.expenses.findAll({
            where: {
                userid: req.params.id,
                deletedExpense: false,
                expDate: { [op.between]: ["2018-09-01", "2018-11-31"]}
                //expAmount: {[op.between]:[0,100]}
            },
            attributes: [[db.sequelize.fn('month', db.sequelize.col('expDate')), "month"], [db.sequelize.fn('sum', db.sequelize.col('expAmount')), "y"]],
            //group: ["expType"]
            group: [db.sequelize.fn('month', db.sequelize.col('expDate'))]
        }).then((data) => {
            
            res.json(data);
        });

    });

    //POST to create new expense
    app.post("/api/expenses/:id", function (req, res) {

        let userID = req.params.id;

        db.expenses.create({

            userid: userID,
            expName: req.body.expName,
            finAccount: req.body.finAccount,
            expType: req.body.expType,
            expDate: req.body.expDate,
            expAmount: req.body.expAmount
            
        }).then( function (data) {

            res.json(data);

        });

    });

    //DELETE expense by id--TAREA
    app.put("/api/expenses/delete/:id", function (req, res) {
        console.log(JSON.parse(req.body.change));
        db.expenses.update({

            deletedExpense: JSON.parse(req.body.change)

        }, {
                where: {
                    id: req.params.id
                }
            }).then(function (data) {

                res.json(data);

        });

    });

    app.put("/api/expenses/update/:id", function (req, res) {

        console.log(req.body.Expense)
        db.expenses.update({

            expName: req.body.Expense,
            finAccount: req.body.Account,
            expType: req.body.Type,
            expDate: req.body.Date,
            expAmount: req.body.Amount

        },{
            where:{
                id: req.body.id
            }
        }).then(function (data) {

            res.json(data);

        });

    });

}