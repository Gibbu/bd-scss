import findConfig from 'find-config'

/**
 * The `bd-scss.config.json` file contents.
 * @type {Object}
 */
export const config = JSON.parse(findConfig.read('bd-scss.config.json'));