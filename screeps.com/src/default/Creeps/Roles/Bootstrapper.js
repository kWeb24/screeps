/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Settler
 * @classdesc Settler role class
 * @abstract
 * @augments Role
 */
export default class Bootstrapper extends Role {
  constructor() {
    super();

    this.ROLE = "Bootstrapper";
    this.POPULATION = 2;
    this.GENOME = [WORK, CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 50;
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
    // const spawn = creep.room.find(FIND_MY_SPAWNS);
    // if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
    //     creep.moveTo(spawn[0], { reusePath: 10 });
    // }
    // return false;
    const claimFlag = Game.flags['Bootstrap'];
    if (claimFlag && creep.room.controller !== undefined && claimFlag.room !== undefined && claimFlag.room.name === creep.room.name) {
      if (
        (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
        (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
      ) {
        this.harvestEnergy(creep);
      }
  
      if (
        (creep.status() != "building" && creep.store.getFreeCapacity() === 0) ||
        (creep.status() == "building" && creep.store.getUsedCapacity() > 0) ||
        (creep.status() == "bored" && creep.store.getUsedCapacity() > 0) ||
        (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
      ) {
        this.build(creep);
      }
    } else {
      if (claimFlag) {
        if (creep.store.getFreeCapacity() > 0) {
          if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 10 });
            creep.status("moving");
          }
        } else {
          if (claimFlag.room !== undefined) {
            creep.moveTo(new RoomPosition(claimFlag.pos.x - 1, claimFlag.pos.y - 1, claimFlag.room.name));
          } else {
            creep.moveTo(claimFlag);
          }
        }
      } else {
        if (
          (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
          (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
        ) {
          this.harvestEnergy(creep);
        }
    
        if (
          (creep.status() != "building" && creep.store.getFreeCapacity() === 0) ||
          (creep.status() == "building" && creep.store.getUsedCapacity() > 0) ||
          (creep.status() == "bored" && creep.store.getUsedCapacity() > 0) ||
          (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
        ) {
          this.build(creep);
        }
      }
    }
  }

  harvestEnergy(creep) {
    if (creep.room.storage) {
      if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.storage, { reusePath: 10 });
      }
      return false;
    }
    let selectedSource = false;
    const tombstones = creep.room.find(FIND_TOMBSTONES);
    const resources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (tombstones.length) {
      tombstones.forEach((tomb) => {
        if (tomb.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() > 0) {
          selectedSource = tomb;
        }
      });
    }

    creep.status("harvesting");
    if (selectedSource) {
      if (creep.withdraw(selectedSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource, { reusePath: 10 });
      }
    } else if (resources.length) {
      if (creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(resources[0], { reusePath: 10 });
      }
    } else {
      this.harvest(creep);
    }
  }

  shouldSpawn(room) {
    const count = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'Bootstrapper'
    ).length;

    const claimFlag = Game.flags['Bootstrap'];

    return claimFlag && count < this.POPULATION && room.name == 'W27N13';
  }

  build(creep) {
    let targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    // const spawns = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
    //   filter: obj => {
    //     return (obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN) &&
    //             obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    //   }
    // });
    const spawns = false;

    creep.status("building");

    if (spawns) {
      if (creep.transfer(spawns, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawns, { range: 1, reusePath: 10 });
        creep.status("moving");
      }
    } else if (creep.room.controller.level == 1 || creep.room.controller.ticksToDowngrade < 4000) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { range: 3, reusePath: 10 });
        creep.status("moving");
      }
    } else if (targets) {
      if (creep.build(targets) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets, { reusePath: 10 });
        creep.status("moving");
        creep.target(targets.id);
      }
    } else {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { range: 3, reusePath: 10 });
        creep.status("moving");
      }
    }
  }
}
