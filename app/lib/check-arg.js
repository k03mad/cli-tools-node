import utils from '@k03mad/util';
import chalk from 'chalk';

const {request} = utils;
const {dim, gray, green, red, yellow} = chalk;

/** @param {string} version */
export default async version => {
    if (!version) {
        throw new Error(
            `The Node.JS version is not specified, example usage:\n${gray('$')} ${green('node-chv 14')}`,
        );
    }

    let body;

    try {
        ({body} = await request.cache('https://nodejs.org/dist/', {}, {expire: '1d'}));
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
