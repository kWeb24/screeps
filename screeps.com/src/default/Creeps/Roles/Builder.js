/*jshint esversion: 6 */

console.log(">> Loading Builder Role...");

import Role from "./Role.js";

/**
 * @class Builder
 * @classdesc Builder role class
 * @abstract
 * @augments Role
 */
export default class Builder extends Role {
  constructor() {
    super();

    this.ROLE = "builder";
    this.POPULATION = 1;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = ["upgrader"];
    this.ON_DEMAND = true;
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Builder
   * @desc Run actual Builder Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @override
   * @see Role
   **/
  run(creep) {
    if (
      (creep.status() != "harvesting" && creep.carry.energy == 0) ||
      (creep.status() == "harvesting" && !creep.isEnergyCapFull())
    ) {
      this.harvest(creep);
    }

    if (
      (creep.status() != "building" && creep.isEnergyCapFull()) ||
      (creep.status() == "building" && creep.carry.energy > 0) ||
      (creep.status() == "bored" && creep.carry.energy > 0) ||
      (creep.status() == "moving" && creep.carry.energy > 0)
    ) {
      this.build(creep);
    }
  }

  /**
   * @memberof Builder
   * @desc Build {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  build(creep) {
    let targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
      filter: obj => {
        return (
          obj.structureType == STRUCTURE_EXTENSION ||
          obj.structureType == STRUCTURE_TOWER ||
          obj.structureType == STRUCTURE_CONTAINER
        );
      }
    });

    if (!targets) {
      targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }

    creep.status("building");

    if (targets) {
      if (creep.build(targets) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets);
        creep.status("moving");
        creep.target(targets.id);
      }
    } else {
      const wallToBuild = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure =>
          structure.hits < structure.hitsMax / 1.3 &&
          structure.structureType == STRUCTURE_WALL
      });

      if (wallToBuild) {
        if (creep.repair(wallToBuild) == ERR_NOT_IN_RANGE) {
          creep.moveTo(wallToBuild);
          creep.status("moving");
        }
      } else {
        const [spawn] = CACHE.ROOMS[creep.room.name].getMySpawns();
        const pos = CACHE.ROOMS[creep.room.name].ROOM.getPositionAt(
          spawn.pos.x - 4,
          spawn.pos.y - 5
        );
        creep.moveTo(pos);
        creep.status("bored");
        creep.target("BuildersGatherPoint");
      }
    }
  }

  /**
   * @memberof Builder
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
   * @override
   * @see Role
   **/
  needsHelp(fromCreep) {
    var targets = fromCreep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length;
  }
}
