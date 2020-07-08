'use strict';

const {gray, green, yellow} = require('colorette');
const {request} = require('utils-mad');

/** @param {string} version */
module.exports = async version => {
    if (!version) {
        throw new Error(
            `The Node.JS version is not specified, example usage:\n${gray('$')} ${green('node-chv 14')}`,
        );
    }

    const {body} = await request.cache('https://nodejs.org/dist/', {}, {expire: '1m'});
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
