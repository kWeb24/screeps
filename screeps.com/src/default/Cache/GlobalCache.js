/*jshint esversion: 6 */

console.log('>> Loading Cache module...');

import RoomCache from './RoomCache.js';

/**
* @class GlobalCache
* @classdesc Global cache object
* @global
*/

export default class GlobalCache {

  constructor() {
    /**
    * @member {Array<RoomCache>} GlobalCache#ROOMS
    * @desc array of {@link RoomCache} objects
    **/
    this.ROOMS = [];
    this.initRoomCache();
  }

  /**
   * @memberof GlobalCache
   * @desc Assign {@link RoomCache} objects to array for caching purposes
   * @private
   **/
  initRoomCache() {
    for (const room in Game.rooms) {
      if (this.ROOMS[room] === undefined) {
        this.ROOMS[room] = new RoomCache(Game.rooms[room], room);
      }
    }
  }
}
