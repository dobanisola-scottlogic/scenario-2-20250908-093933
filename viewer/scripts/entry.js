require('../styles/style.css');
require('pixi');
require('p2');
require('phaser');

var gameData = require('json!../testData/exampleGame');
var parser = require('./parser');

var parsedJson = parser(gameData);
