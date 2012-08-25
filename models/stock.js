// stock.js
// Stock model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

// constants:

var INDEX_NAME = 'nodes';
var INDEX_KEY = 'type';
var INDEX_VAL = 'stock';

var INDIVIDUAL_STOCK_HAS_STOCK = 'individual_stock_has_stock';

// private constructor:
var stock = module.exports = function stock(_node) {
    this._node = _node;
}

// pass-through node properties:
function proxyProperty(prop, isData) {
    Object.defineProperty(stock.prototype, prop, {
        get: function () {
            if (isData) {
                return this._node.data[prop];
            } else {
                return this._node[prop];
            }
        },
        set: function (value) {
            if (isData) {
                this._node.data[prop] = value;
            } else {
                this._node[prop] = value;
            }
        }
    });
}

proxyProperty('id');
proxyProperty('code');
proxyProperty('name', true);
proxyProperty('basevalue', true);

// private instance methods:

stock.prototype._getIndividualOwnsStockRel = function (other, callback) {
    var query = [
        'START stock=node({stockId})',
        'MATCH (stock) -[rel?:INDIVIDUAL_STOCK_HAS_STOCK]-> (individualstock)',
        'RETURN rel'
    ].join('\n')
        .replace('INDIVIDUAL_STOCK_HAS_STOCK', INDIVIDUAL_STOCK_HAS_STOCK);

    var params = {
        stockId: this.id
        };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};

// public instance methods:

stock.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

stock.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};

stock.prototype.has = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'has', {}, function (err, rel) {
        callback(err);
    });
};
/*
stock.prototype.unfollow = function (other, callback) {
    this._getFollowingRel(other, function (err, rel) {
        if (err) return callback(err);
        if (!rel) return callback(null);
        rel.del(function (err) {
            callback(err);
        });
    });
};*/
/*

// calls callback w/ (err, following, others) where following is an array of
// stocks this stock follows, and others is all other stocks minus him/herself.
stock.prototype.getFollowingAndOthers = function (callback) {
    // query all stocks and whether we follow each one or not:
    var query = [
        'START stock=node({stockId}), other=node:INDEX_NAME(INDEX_KEY="INDEX_VAL")',
        'MATCH (stock) -[rel?:INDIVIDUAL_STOCK_HAS_STOCK]-> (other)',
        'RETURN other, COUNT(rel)'  // COUNT(rel) is a hack for 1 or 0
    ].join('\n')
        .replace('INDEX_NAME', INDEX_NAME)
        .replace('INDEX_KEY', INDEX_KEY)
        .replace('INDEX_VAL', INDEX_VAL)
        .replace('INDIVIDUAL_STOCK_HAS_STOCK', INDIVIDUAL_STOCK_HAS_STOCK);

    var params = {
        stockId: this.id
    };

    var stock = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new stock(results[i]['other']);
            var follows = results[i]['count(rel)'];
            // XXX neo4j bug: returned names are always lowercase!
            // TODO FIXME when updating to the next version of neo4j.

            if (stock.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};
*/

// static methods:

stock.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new stock(node));
    });
};

stock.getAll = function (callback) {
    db.getIndexedNodes(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err, nodes) {
        // if (err) return callback(err);
        // XXX FIXME the index might not exist in the beginning, so special-case
        // this error detection. warning: this is super brittle!!
        if (err) return callback(null, []);
        var stocks = nodes.map(function (node) {
            return new stock(node);
        });
        callback(null, stocks);
    });
};

// creates the stock and persists (saves) it to the db, incl. indexing it:
stock.create = function (data, callback) {
    var node = db.createNode(data);
    var stock = new stock(node);
    node.save(function (err) {
        if (err) return callback(err);
        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
            if (err) return callback(err);
            callback(null, stock);
        });
    });
};
