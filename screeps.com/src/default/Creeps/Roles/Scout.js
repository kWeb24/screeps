/*jshint esversion: 6 */

import Role from './Role.js';

/**
 * @class Scout
 * @classdesc Scout role class
 * @abstract
 * @augments Scout
 */
export default class Scout extends Role {

  constructor() {
    super();

		this.ROLE = 'scout';
    this.POPULATION = 1;
    this.GENOME = [MOVE];
    this.MAX_GENOME_LENGTH = 4;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Scout
   * @desc Run actual Scout Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    if (creep.memory.room !== creep.room.name) {
      creep.moveTo(CACHE.ROOMS[creep.memory.room].ROOM.controller.pos);
    } else {
      for (const [dir, exit] of Object.entries(creep.room.memory.exits)) {
        if (!Game.memory.rooms[exit].scouted) {
          creep.moveTo(dir);
          break;
        }
      };
    }
  }

  shouldSpawn(room) {
    const scoutsCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'scout' && creep.memory.room == room.name
    ).length;

    if (!room.memory.scouted && scoutsCount < this.POPULATION) return true;

    let needsScouting = false;

    for (const [dir, exit] of Object.entries(room.memory.exits)) {
      if (!Memory.rooms[exit].scouted) {
        needsScouting = true;
      }
    }

    return needsScouting && scoutsCount < this.POPULATION;
  }
}
