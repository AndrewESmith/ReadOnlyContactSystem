
var IndividualStock = require('../models/individualstock');

// POST /individual stock
/*exports.create = function (req, res, next) {
    IndividualStock.create({
        personid: req.body['personid'],
        stockid: req.body['stockid'],
        quantity: req.body['quantiy']
    }, function (err, IndividualStock) {
        if (err) return next(err);
        res.redirect('/individualstocks/' + IndividualStock.id);
        });
};
*/
// POST /individual stock
exports.import = function (req, res, next) {
    IndividualStock.import(function (err, individualstocks) {
        if (err) return next(err);
        res.render('individualstocks', {
            individualstocks: individualstocks
        });
    });
};

exports.show = function (req, res, next) {
    IndividualStock.get(req.params.id, function (err, individualstock) {
        if (err) return next(err);
            res.render('individualstock', {
                individualstock: individualstock
            });
        });
};

// GET /individualstock
exports.list = function (req, res, next) {
    IndividualStock.getAll(function (err, individualstocks) {
        if (err) return next(err);
        res.render('individualstocks', {
            individualstocks: individualstocks
        });
    });
};

// POST /individualstocks/:id
exports.edit = function (req, res, next) {
    IndividualStock.get(req.params.id, function (err, individualstock) {
        if (err) return next(err);
        individualstock.PersonId = req.body['PersonId'];
        individualstock.StockId = req.body['StockId'];
        individualstock.Quantity = req.body['Quantity'];
        individualstock.Save(function (err) {
            if (err) return next(err);
            res.redirect('/individualstocks/' + individualstock.id);
        });
    });
};


// DELETE /individualstocks/:id
exports.del = function (req, res, next) {
    IndividualStock.get(req.params.id, function (err, individualstock) {
        if (err) return next(err);
        individualstock.del(function (err) {
            if (err) return next(err);
            res.redirect('/individualstocks');
        });
    });
};
