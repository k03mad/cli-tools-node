'use strict';

const assert = require('assert');
const replaceVersion = require('../app/lib/replace');
const {options} = require('colorette');

options.enabled = false;

const tests = [
    [13, '✓ .nvmrc 15 → 13 - ✓ package.json >=15 → 13 - ! Dockerfile file does not exist'],
    [12.5, '✓ .nvmrc 13 → 12.5 - ✓ package.json 13 → 12.5 - ! Dockerfile file does not exist'],

    ['>=11', '✓ .nvmrc 12.5 → 11 - ✓ package.json 12.5 → >=11 - ! Dockerfile file does not exist'],
    ['>=10.5', '✓ .nvmrc 11 → 10.5 - ✓ package.json >=11 → >=10.5 - ! Dockerfile file does not exist'],
    [10.5, '! .nvmrc version already in use: 10.5 - ✓ package.json >=10.5 → 10.5 - ! Dockerfile file does not exist'],
    ['>=10.5', '! .nvmrc version already in use: 10.5 - ✓ package.json 10.5 → >=10.5 - ! Dockerfile file does not exist'],

    ['>=14.5.0', '✓ .nvmrc 10.5 → 14.5.0 - ✓ package.json >=10.5 → >=14.5.0 - ! Dockerfile file does not exist'],
    ['14.5.0', '! .nvmrc version already in use: 14.5.0 - ✓ package.json >=14.5.0 → 14.5.0 - ! Dockerfile file does not exist'],

    [28, 'Error: The Node.JS version does not exist: 28'],
    ['', 'Error: The Node.JS version is not specified, example usage:\n$ node-chv 14'],
    ['a', 'Error: The Node.JS version does not exist: a'],
    ['13a', 'Error: The Node.JS version does not exist: 13a'],

    ['>=15', '✓ .nvmrc 14.5.0 → 15 - ✓ package.json 14.5.0 → >=15 - ! Dockerfile file does not exist'],
];

describe('Version', () => {
    let errorFound;

    beforeEach(function() {
        if (errorFound) {
            this.test.skip();
        }
    });

    for (const [version, message] of tests) {

        // eslint-disable-next-line no-loop-func
        it(String(version), async () => {
            let log;

            try {
                log = await replaceVersion(version);
            } catch (err) {
                log = err.toString();
            }

            try {
                assert.deepEqual(
                    Array.isArray(log)
                        ? log.map(elem => elem.join(' ')).join(' - ')
                        : log,
                    message,
                );
            } catch (err) {
                errorFound = true;
                throw err;
            }
        });

    }
});
