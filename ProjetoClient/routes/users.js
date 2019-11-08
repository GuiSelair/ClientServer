var express = require('express');
const assert = require("assert");
var restify = require ( 'restify-clients' );
var router = express.Router();

var client = restify.createJsonClient ({ 
  url : 'http://localhost:4000' 

});

/* GET  */
router.get('/', function(req, res, next) {
  // client: Refere-se ao servidor do banco de dados
  client.get( '/' , function(err , request , response , obj ){
    //CASO ERRO
    assert.ifError(err); 
    res.json(obj)
  }); 
});

/* GET COM FILTRO  */
router.get('/:id', function(req, res, next) {
  client.get( `/${req.params.id}` , function(err , request , response , obj ){
    //CASO ERRO
    assert.ifError(err); 
    res.json(obj)
  }); 
});

/* PUT  */
router.put('/:id', function(req, res, next) {
  client.put( `/${req.params.id}`, req.body, function(err , request , response , obj ){
    //CASO ERRO
    assert.ifError(err); 
    res.json(obj)
  }); 
});

/* DELETE  */
router.delete('/:id', function(req, res, next) {
  client.del( `/${req.params.id}`, function(err , request , response , obj ){
    //CASO ERRO
    assert.ifError(err); 
    res.json(obj) 
  }); 
});

/* POST  */
router.post('/', function(req, res, next) {
  client.post( `/`, req.body, function(err , request , response , obj ){
    //CASO ERRO
    assert.ifError(err); 
    res.json(obj)
  }); 
});

module.exports = router;
