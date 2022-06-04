/*jshint esversion: 6 */

console.log(">> Loading Settler Role...");

import Role from "./Role.js";

/**
 * @class Settler
 * @classdesc Settler role class
 * @abstract
 * @augments Role
 */
export default class Settler extends Role {
  constructor() {
    super();

    this.ROLE = "settler";
    this.POPULATION = 1;
    this.GENOME = [CLAIM, MOVE];
    this.MAX_GENOME_LENGTH = 4;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = true;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Settler
   * @desc Run actual Settler Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @override
   * @see Role
   **/
  run(creep) {
    if (!creep.room.controller.my) {
      if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      creep.moveTo(new RoomPosition(36, 25, 'W8N2'));
    }
  }

  shouldSpawn(room) {
    const settlersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'settler'
    ).length;

    const level = Game.gcl.level;
    let myRooms = 0;
    for (const room in Game.rooms) {
      if (Game.rooms[room].controller.my) {
        myRooms++;
      }
    }
    return false;
    return !settlersCount && myRooms < level;
  }
}
