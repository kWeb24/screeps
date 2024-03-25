/*jshint esversion: 6 */

import RoomPlanner from './Rooms/RoomPlanner.js';

/**
 * @class Planner
 * @classdesc Planner class
 * @global
 */
export default class Planner {

  constructor() {
    /**
    * @member {Array<Room>} Planner#ROOMS
    * @desc array of {@link https://docs.screeps.com/api/#Room|Screeps Room} objects
    **/
    this.ROOMS = [];
    this.initRoomPlanning();
  }

  /**
   * @memberof Planner
   * @desc Init room planning for every room
   * @private
   **/
  initRoomPlanning() {
    for (const room in Game.rooms) {
      if (this.ROOMS[room] === undefined && Game.rooms[room].controller !== undefined && Game.rooms[room].controller.my) {
        this.ROOMS[room] = new RoomPlanner(Game.rooms[room]);
      }
    }
  }
}
