const express = require('express');
const jsonParser = require('body-parser').json();
const Bear = require(__dirname + '/../models/bear');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var bearRouter = module.exports = exports = express.Router();

bearRouter.get('/bears', (req, res) => {
  Bear.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({message: data});
  });
});

bearRouter.post('/bears', (req, res) => {
  req.body = '';
  req.on('data', (chunk) => {
    req.body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(req.body);
    console.log(req.body);
    console.log();
    var newBear = new Bear(req.body);
    newBear.save((err, data) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({message: 'Successfully created bear with name [' + req.body.name + '] and flavor [' + req.body.flavor + ']'});
    });
  });
});

bearRouter.put('/bears/:id', (req, res) => {
  req.body = '';
  req.on('data', (chunk) => {
    req.body += chunk.toString();
  });
  req.on('end', () => {
    req.body = JSON.parse(req.body);
    var bearData = req.body;
    delete bearData._id;
    Bear.update({_id: req.params.id}, bearData, (err) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({message: 'Successfully updated bear with ID [' + req.params.id + '].'});
    });
  });
});

bearRouter.delete('/bears/:id', (req, res) => {
  Bear.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({message: 'Successfully deleted bear with ID [' + req.params.id + '].'});
  });
});
