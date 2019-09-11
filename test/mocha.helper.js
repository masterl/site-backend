const rfr = require('rfr');
const chai = require('chai');

global.R = require('ramda');
global.faker = require('faker');
global.sinon = require('sinon');
global.Bluebird = require('bluebird');

global.helpers = require('./helpers');
global.builders = require('./data-builders');
global.arrays_are_equal = rfr('util/arrays_are_equal');

global.rfr = rfr;
global.expect = chai.expect;
