#!/usr/bin/env node

'use strict';

const asTable = require('as-table');
const pkg = require('../package.json');
const replaceVersion = require('./lib/replace');
const updateNotifier = require('update-notifier');

updateNotifier({pkg}).notify();

replaceVersion()
    .then(res => console.log(asTable(res)))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
