'use strict';

const got = require('got');
const {dim, red, gray, green, yellow} = require('colorette');

/** @param {string} version */
module.exports = async version => {
    if (!version) {
        throw new Error(
            `The Node.JS version is not specified, example usage:\n${gray('$')} ${green('node-chv 14')}`,
        );
    }

    let body;

    try {
        ({body} = await got('https://nodejs.org/dist/', {timeout: 3000}));
    } catch (err) {
        console.log([
            yellow('Cannot check valid NodeJS versions:'),
            red(err),
            dim('...skipping\n'),
        ].join('\n'));

        return;
    }

    const validNodeVersions = new Set(
        body
            .match(/v\d+\.\d+\.\d+/g)
            .map(elem => elem.replace('v', ''))
            .flatMap(elem => {
                const splitted = elem.split('.');
                return [elem, splitted[0], `${splitted[0]}.${splitted[1]}`];
            }),
    );

    if (!validNodeVersions.has(version)) {
        throw new Error(
            `The Node.JS version does not exist: ${yellow(version)}`,
        );
    }
};
