#!/usr/bin/env node

import asTable from 'as-table';

import replaceVersion from './lib/replace.js';

replaceVersion()
    .then(res => console.log(asTable(res)))
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
