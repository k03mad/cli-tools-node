'use strict';

const {gray, green} = require('colorette');
const {request, print} = require('utils-mad');

/** @param {string} versionArg */
module.exports = async versionArg => {
    !versionArg && print.ex(
        `The Node.JS version is not specified, example usage:\n${gray('$')} ${green('node-ch 14')}`,
        {time: false, exit: true},
    );

    const {body} = await request.got('https://nodejs.org/dist/');
    const validNodeVersions = new Set(
        body
            .match(/v\d+\.\d+\.\d+/g)
            .map(elem => elem.replace('v', ''))
            .flatMap(elem => {
                const splitted = elem.split('.');
                return [elem, splitted[0], `${splitted[0]}.${splitted[1]}`];
            }),
    );

    !validNodeVersions.has(versionArg) && print.ex(
        'The Node.JS version does not exist',
        {time: false, exit: true},
    );
};
