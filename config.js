export default {
    '.nvmrc': {
        replaceString: /(?<version>.+)/,
        replaceValue: version => version,
    },

    'package.json': {
        replaceString: /("node": ")(?<version>.+)(")/,
        replaceValue: version => `$1${version}$3`,
        supportGrEqual: true,
    },

    'Dockerfile': {
        replaceString: /(FROM node:)(?<version>[\d.]+)(.+)/,
        replaceValue: version => `$1${version}$3`,
    },
};
