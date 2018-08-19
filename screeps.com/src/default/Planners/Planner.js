/*jshint esversion: 6 */

console.log('>> Loading Planner module...');

import RoomPlanner from './Rooms/RoomPlanner.js';

export default class Planner {

  constructor() {
    this.ROOMS = [];
    this.initRoomPlanning();
  }

  initRoomPlanning() {
    for (const room in Game.rooms) {
      if (this.ROOMS[room] === undefined && Game.rooms[room].controller.my) {
        this.ROOMS[room] = new RoomPlanner(Game.rooms[room]);
      }
    }
  }
}
