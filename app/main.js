#!/usr/bin/env node

'use strict';

const asTable = require('as-table');
const check = require('./lib/check-arg');
const {argv} = require('yargs');
const {blue, green, red, yellow} = require('colorette');
const {print} = require('utils-mad');
const {promises: fs} = require('fs');

/**
 * @param {string} versionArg
 * @returns {object}
 */
const files = versionArg => ({
    '.nvmrc': [
        /(?<version>.+)/,
        versionArg,
    ],

    'package.json': [
        /("node": ")(?<version>.+)(")/,
        `$1${versionArg}$3`,
    ],

    'Dockerfile': [
        /(FROM node:)(?<version>.+)/,
        `$1${versionArg}`,
    ],
});

(async () => {
    try {
        const versionArg = String(argv._[0]);
        await check(versionArg);

        console.log();

        const messages = await Promise.all(
            Object.entries(files(versionArg)).map(async ([file, replaceArgs]) => {
                let content;

                try {
                    content = await fs.readFile(file, {encoding: 'utf-8'});
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        return [
                            red('✗'), blue(file),
                            'file does not exist',
                        ];
                    }
                }

                const matched = content.match(replaceArgs[0]) || [];

                if (
                    matched
                    && matched.groups
                    && matched.groups.version === versionArg
                ) {
                    return [
                        red('✗'), blue(file),
                        `version already in use: ${yellow(versionArg)}`,
                    ];

                } else if (
                    matched
                    && matched.groups
                    && matched.groups.version
                ) {
                    await fs.writeFile(file, content.replace(...replaceArgs));
                    return [
                        green('✓'), blue(file),
                        `${yellow(matched.groups.version.trim())} → ${green(versionArg)}`,
                    ];
                }

                return [
                    red('✗'), blue(file),
                    `version not found with regexp: ${yellow(replaceArgs[0])}`,
                ];
            }),
        );

        console.log(asTable(messages));
    } catch (err) {
        print.ex(err, {exit: true});
    }
})();
