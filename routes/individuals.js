
var individual = require('../models/individual');

// POST /individual stock
/*exports.create = function (req, res, next) {
    individual.create({
    ManagedBy: req.body['ManagedBy'],
    Title: req.body['Title'],
    FirstName: req.body['FirstName'],
    LastName: req.body['LastName'],
    Gender: req.body['Gender'],
    DOB: req.body['DOB'],
    TFN: req.body['TFN'],
    Mobile: req.body['Mobile'],
    Email: req.body['Email'],
    Twitter: req.body['Twitter'],
    Notes: req.body['Notes']
    }, function (err, individual) {
        if (err) return next(err);
        res.redirect('/individuals/' + individual.id);
        });
};
*/

exports.show = function (req, res, next) {
    individual.get(req.params.id, function (err, individual) {
        if (err) return next(err);
            res.render('individual', {
                individual: individual
            });
        });
};

// GET /individual
exports.list = function (req, res, next) {
    individual.getAll(function (err, individuals) {
        if (err) return next(err);
        res.render('individuals', {
            individuals: individuals
        });
    });
};

// POST /individuals/:id
exports.edit = function (req, res, next) {
    individual.get(req.params.id, function (err, individual) {
        if (err) return next(err);
            individual.ManagedBy = req.body['ManagedBy'];
            individual.Title = req.body['Title'];
            individual.FirstName = req.body['FirstName'];
            individual.LastName = req.body['LastName'];
            individual.Gender = req.body['Gender'];
            individual.DOB = req.body['DOB'];
            individual.TFN = req.body['TFN'];
            individual.Mobile = req.body['Mobile'];
            individual.Email = req.body['Email'];
            individual.Twitter = req.body['Twitter'];
            individual.Notes = req.body['Notes'];
             individual.Save(function (err) {
            if (err) return next(err);
            res.redirect('/individuals/' + individual.id);
        });
    });
};


// DELETE /individuals/:id
exports.del = function (req, res, next) {
    individual.get(req.params.id, function (err, individual) {
        if (err) return next(err);
        individual.del(function (err) {
            if (err) return next(err);
            res.redirect('/individuals');
        });
    });
};

// POST /individual stock
exports.import = function (req, res, next) {
    individual.import(function (err, individuals) {
        if (err) return next(err);
        res.render('individuals', {
            individuals: individuals
        });
    });
};
