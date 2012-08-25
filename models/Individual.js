// individual.js
// individual model logic.

var neo4j = require('neo4j');
var csv = require('csv');
var db = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474');

// constants:

var INDEX_NAME = 'nodes';
var INDEX_KEY = 'type';
var INDEX_VAL = 'individual';

var INDIVIDUAL_OWNS_INDIVIDUALSTOCK = 'individual_owns_individualstock';

// private constructor:
var Individual = module.exports = function Individual(_node) {
    this._node = _node;
}


// pass-through node properties:
function proxyProperty(prop, isData) {
    Object.defineProperty(Individual.prototype, prop, {
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
proxyProperty('managedby');
proxyProperty('title', true);
proxyProperty('firstname', true);
proxyProperty('lastname', true);
proxyProperty('gender', true);
proxyProperty('dob', true);
proxyProperty('tfn', true);
proxyProperty('mobile', true);
proxyProperty('email', true);
proxyProperty('twitter', true);
proxyProperty('notes', true);
proxyProperty('referralid');
// private instance methods:

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
function loadindividual(data, index){
    Individual.create(data, function(err){
    });
 };

individual.prototype._getIndividualOwnsindividualRel = function (other, callback) {
    var query = [
        'START individual=node({individualId})',
        'MATCH (individual) -[rel?:INDIVIDUAL_individual_HAS_individual]-> (individualindividual)',
        'RETURN rel'
    ].join('\n')
        .replace('individual_HAS_STOCK', INDIVIDUAL_individual_HAS_individual);

    var params = {
        individualId: this.id
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};

// public instance methods:

individual.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

individual.prototype.del = function (callback) {
    this._node.del(function (err) {
        callback(err);
    }, true);   // true = yes, force it (delete all relationships)
};

individual.prototype.has = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'has', {}, function (err, rel) {
        callback(err);
    });
};


// static methods:

Individual.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new individual(node));
    });
};

Individual.getAll = function (callback) {
    db.getIndexedNodes(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err, nodes) {
        // if (err) return callback(err);
        // XXX FIXME the index might not exist in the beginning, so special-case
        // this error detection. warning: this is super brittle!!
        if (err) return callback(null, []);
        var individuals = nodes.map(function (node) {
            return new Individual(node);
        });
        callback(null, individuals);
    });
};

IndividualStock.import = function(callback){
    csv()
        .fromPath('CSV_data/Individual.csv',{
           columns: true
        })
        .on('data',function(data,index){
            loadindividual(data, index);
            console.log('#'+index+' '+JSON.stringify(data));
        })
        .on('end',function(count){
            console.log('Number of lines: '+count);
        })
        .on('error',function(error){
            console.log(error.message);
        });

};

// creates the individual and persists (saves) it to the db, incl. indexing it:
Individual.create = function (data, callback) {
    var node = db.createNode(data);
    var individual = new Individual(node);
    node.save(function (err) {
        if (err) return callback(err);
        node.index(INDEX_NAME, INDEX_KEY, INDEX_VAL, function (err) {
            if (err) return callback(err);
            callback(null, individual);
        });
    });
};
