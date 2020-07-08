#!/usr/bin/env node
'use strict';

const asTable = require('as-table');
const replaceVersion = require('./lib/replace');
const {print} = require('utils-mad');

replaceVersion()
    .then(res => console.log(asTable(res)))
    .catch(err => print.ex(err, {exit: true}));
