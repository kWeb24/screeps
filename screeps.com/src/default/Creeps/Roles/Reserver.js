/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Settler
 * @classdesc Settler role class
 * @abstract
 * @augments Role
 */
export default class Reserver extends Role {
  constructor() {
    super();

    this.ROLE = "reserver";
    this.POPULATION = 1;
    this.GENOME = [CLAIM, CLAIM, MOVE, MOVE];
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
    let targetFlag = false;
    for (const flag in Game.flags) {
      if (flag.charAt(0) === '$') {
        const parts = flag.split(';');
        const roomName = parts[1];
        const action = parts[2];

        if (roomName === creep.memory.room) {
          if (action === 'Reserve') {
            targetFlag = flag;
          }
        }
      }
    }

    if (Game.flags[targetFlag].room !== undefined && Game.flags[targetFlag].room.name === creep.room.name) {
      if (creep.room.controller.sign == undefined) {
        if (creep.signController(creep.room.controller, '☢️ Code wasteland - Robots detected ☢️') == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, { range: 1 });
          return false;
        }
      }

      if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { reusePath: 100 });
      }
    } else {
      if (targetFlag) {
        if (targetFlag.room !== undefined) {
          creep.moveTo(Game.flags[targetFlag], { reusePath: 100 });
        } else {
          creep.moveTo(Game.flags[targetFlag], { reusePath: 100 });
        }
      }
    }
  }

  shouldSpawn(room) {
    const count = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'reserver' && creep.memory.room == room.name && creep.ticksToLive > 10
    ).length;

    let shouldSpawn = false;
    for (const flag in Game.flags) {
      if (flag.charAt(0) === '$') {
        const parts = flag.split(';');
        const roomName = parts[1];
        const action = parts[2];

        if (roomName === room.name) {
          if (action === 'Reserve') {
            shouldSpawn = true;
          }
        }
      }
    }

    return shouldSpawn && count < this.POPULATION;
  }
}
