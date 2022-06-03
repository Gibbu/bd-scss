import findConfig from 'find-config'

/**
 * The `bd-scss.config.json` file contents.
 * @type {Object}
 */
export const config = JSON.parse(findConfig.read('bd-scss.config.json'));

/**
 * Construct the meta given by the `bd-scss.config.json` file.
 * @returns {string}
 */
export const constructMeta = () => `/**\n${Object.entries(config.meta).map(([key, value]) => ` * @${key} ${value}\n`).join('')}*/\n\n`;