/**
 * @typedef {Object} TileLayer
 * @property {"tilelayer"} type
 * @property {string} name
 * @property {number[]} data
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} TiledObject
 * @property {number} id
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} ObjectLayer
 * @property {"objectgroup"} type
 * @property {string} name
 * @property {TiledObject[]} objects
 */

/**
 * @typedef {TileLayer | ObjectLayer} Layer
 */

export {};