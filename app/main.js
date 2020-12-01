#!/usr/bin/env node
'use strict';

const asTable = require('as-table');
const replaceVersion = require('./lib/replace');

replaceVersion()
    .then(res => console.log(asTable(res)))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
