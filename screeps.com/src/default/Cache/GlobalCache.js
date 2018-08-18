/*jshint esversion: 6 */

console.log('>> Loading Cache module...');

import RoomCache from './RoomCache.js';

export default class GlobalCache {

  constructor() {
    this.ROOMS = [];
    this.initRoomCache();
  }

  initRoomCache() {
    for (const room in Game.rooms) {
      if (this.ROOMS[room] === undefined) {
        this.ROOMS[room] = new RoomCache(Game.rooms[room]);
      }
    }
  }
}
