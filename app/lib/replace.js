import chalk from 'chalk';
import fs from 'node:fs/promises';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import files from '../../config.js';
import check from './check-arg.js';

const {argv} = yargs(hideBin(process.argv));
const {blue, green, red, yellow} = chalk;

const grEqual = '>=';

/** @returns {Array[]} */
export default async () => {
    let version = argv._[0] ? String(argv._[0]) : '';
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
