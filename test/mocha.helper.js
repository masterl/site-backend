const path             = require('path');
const rfr              = require('rfr');
const chai             = require('chai');
const chai_as_promised = require('chai-as-promised');

chai.use(chai_as_promised);

global.R = require('ramda');
global.faker = require('faker');
global.sinon = require('sinon');
global.request = require('supertest');
global.Bluebird = require('bluebird');

global.helpers = require('./helpers');
global.builders = require('./data-builders');
global.arrays_are_equal = rfr('util/arrays_are_equal');

global.rfr = rfr;
global.expect = chai.expect;

process.env.AUTH_PUB_KEY_PATH = path.join(__dirname, 'test_public_key.pem');
process.env.AUTH_PRIV_KEY_PATH = path.join(__dirname, 'test_private_key.pem');
