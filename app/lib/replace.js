'use strict';

const check = require('./check-arg');
const files = require('../../config');
const {argv} = require('yargs');
const {blue, green, red, yellow} = require('colorette');
const {promises: fs} = require('fs');

const grEqual = '>=';

/** @returns {Array[]} */
const replaceVersion = async () => {
    let version = String(argv._[0]);
    let grEqualFound;

    if (version && version.startsWith(grEqual)) {
        grEqualFound = true;
        version = version.replace(/[^\d.]/g, '');
    }

    await check(version);

    return Promise.all(
        Object.entries(files).map(async ([file, opts]) => {
            const setVersion = opts.supportGrEqual && grEqualFound
                ? grEqual + version
                : version;

            let content;

            try {
                content = await fs.readFile(file, {encoding: 'utf-8'});
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return [
                        yellow('!'), blue(file),
                        'file does not exist',
                    ];
                }

                throw err;
            }

            const matched = content.match(opts.replaceString) || [];

            if (
                matched
                && matched.groups
                && matched.groups.version === setVersion
            ) {
                return [
                    yellow('!'), blue(file),
                    `version already in use: ${yellow(setVersion)}`,
                ];

            } else if (
                matched
                && matched.groups
                && matched.groups.version
            ) {
                await fs.writeFile(file, content.replace(
                    opts.replaceString,
                    opts.replaceValue(setVersion),
                ));

                return [
                    green('✓'), blue(file),
                    `${yellow(matched.groups.version.trim())} → ${green(setVersion)}`,
                ];
            }

            return [
                red('✗'), blue(file),
                `version not found with regexp: ${yellow(opts.replaceString)}`,
            ];
        }),
    );
};

module.exports = replaceVersion;
