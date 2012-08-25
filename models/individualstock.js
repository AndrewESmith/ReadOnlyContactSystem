// individualstock.js
// individualstock model logic.

var neo4j = require('neo4j');
var csv = require('csv');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

// constants:

var INDEX_NAME = 'nodes';
var INDEX_KEY = 'type';
var INDEX_VAL = 'IndividualStock';

var INDIVIDUAL_STOCK_HAS_STOCK = 'individual_individualstock_has_stock';

// private constructor:
var IndividualStock = module.exports = function IndividualStock(_node) {
    this._node = _node;
}

function proxyProperty(prop, isData) {
    Object.defineProperty(IndividualStock.prototype, prop, {
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
proxyProperty('PersonId', true);
proxyProperty('StockId', true);
proxyProperty('Quantity', true);

//Recommendation from Safwan that empty or null properties should be deleted from
//java script object otherwise Neo4j can't save node.
removeEmptyNullProperties = function(data){

    for( var propertyName in data){
        if (data[propertyName] == null){
            delete data[propertyName];
        }
        if (data[propertyName] == ""){
            delete data[propertyName];
        }
    };

};


// private instance methods:
function loadindividualstock(data, index){
    IndividualStock.create(data, function(err){
    });
 };

IndividualStock.import = function(callback){
    csv()
        .fromPath('CSV_data/Individual_Stock.csv',{
           columns: true
        })
        .on('data',function(data,index){
            loadindividualstock(data, index);
            console.log('#'+index+' '+JSON.stringify(data));
        })
        .on('end',function(count){
            console.log('Number of lines: '+count);
        })
        .on('error',function(error){
            console.log(error.message);
        });

};

IndividualStock.prototype._getIndividualOwnsIndividualStockRel = function (other, callback) {
    var query = [
        'START individualstock=node({id})',
        'MATCH (individualstock) -[rel?:INDIVIDUAL_individualstock_HAS_individualstock]-> (individualindividualstock)',
        'RETURN rel'
    ].join('\n')
        .replace('INDIVIDUALSTOCK_HAS_STOCK', INDIVIDUAL_individualstock_HAS_individualstock);

    var params = {
        individualstockId: this.id
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};


IndividualStock.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

IndividualStock.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};

IndividualStock.prototype.has = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'has', {}, function (err, rel) {
        callback(err);
    });
};

IndividualStock.get = function (individualstockId, callback) {
    db.getNodeById(individualstockId, function (err, node) {
        if (err) return callback(err);
        callback(null, new IndividualStock(node));
    });
};

IndividualStock.getAll = function (callback) {
    db.getIndexedNodes(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err, nodes) {
        // if (err) return callback(err);
        // XXX FIXME the index might not exist in the beginning, so special-case
        // this error detection. warning: this is super brittle!!
        if (err) return callback(null, []);
        var individualstocks = nodes.map(function (node) {
            return new IndividualStock(node);
        });
        callback(null, individualstocks);
    });
};

// creates the individualstock and persists (saves) it to the db, incl. indexing it:
IndividualStock.create = function (data, callback) {
    var node = db.createNode(data);
    var individualstock = new IndividualStock(node);

    removeEmptyNullProperties(function(err){
        if (err) return callback(err);
    });
    node.save(function (err) {
        if (err) return callback(err);
        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
            if (err) return callback(err);
            callback(null, individualstock);
        });
    });
};

