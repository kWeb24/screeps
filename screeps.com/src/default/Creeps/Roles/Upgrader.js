/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Upgrader
 * @classdesc Upgrader role class
 * @abstract
 * @augments Role
 */
export default class Upgrader extends Role {
  constructor() {
    super();

    this.ROLE = "upgrader";
    this.POPULATION = 1;
    this.GENOME = [WORK, CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 50;
    this.CAPABLE_OF = ["harvester", "builder"];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Repairer
   * @desc Run actual Upgrader loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @override
   * @see Role
   **/
  run(creep) {
    const lab = Game.getObjectById('662c152b1e90f857394cdae0');
    // it's upgrading all body parts at the same time
    // docs say 1 at time 
    // let needBoost = false;
    let hasAny = false;
    // creep.body.forEach((part) => {
    //   if (part.type === 'work' && part.boost === undefined) {
    //     needBoost = true;
    //   }
    //   if (part.type === 'work' && part.boost !== undefined) {
    //     hasAny = true;
    //   }
    // });
    // if (
    //   creep.room.name === 'W28N13' &&
    //   creep.ticksToLive > 1400 &&
    //   lab.store.getUsedCapacity(RESOURCE_GHODIUM_HYDRIDE) > 800
    // ) {
    //   if (needBoost) {
    //     if (lab.boostCreep(creep) == ERR_NOT_IN_RANGE) {
    //       creep.moveTo(lab);
    //       creep.status("moving");
    //     }
    //     return false;
    //   }
    // }

    if (creep.room.name === 'W28N13' && creep.ticksToLive < 40) {
      if (hasAny) {
        if (lab.unboostCreep(creep) == ERR_NOT_IN_RANGE) {
          creep.moveTo(lab);
          creep.status("moving");
        }
        return false;
      }
      const spawn = creep.room.find(FIND_MY_SPAWNS);
      if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn[0], { reusePath: 10 });
      }
      return false;
    }
    if (
      (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
      (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
    ) {
      this.harvestEnergy(creep);
    }

    if (
      (creep.status() != "upgrading" && creep.store.getFreeCapacity() === 0) ||
      (creep.status() == "upgrading" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    ) {
      this.upgrade(creep);
    }

    // this.dropRoad(creep);
  }

  harvestEnergy(creep) {
    if (creep.room.storage) {
      if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.storage, { reusePath: 20 });
        creep.status("moving");
      }
      creep.target(creep.room.storage.id);
    } else {
      this.harvest(creep);
    }
  }

  /**
   * @memberof Upgrader
   * @desc Upgrade {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  upgrade(creep) {
    creep.status("upgrading");
    creep.target(creep.room.controller.name);

    if (creep.room.controller.sign == undefined) {
      if (creep.signController(creep.room.controller, '☢️ Code wasteland - Robots detected ☢️') == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { range: 1 });
        creep.status("moving");
        return false;
      }
    }

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { range: 3 });
      creep.status("moving");
    }
  }

  /**
   * @memberof Upgrader
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
   * @override
   * @see Role
   **/
  needsHelp(fromCreep) {
    return false;
  }

  shouldSpawn(room) {
    const upgradersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'upgrader' && creep.memory.room == room.name
    ).length;

    const storage = room.storage;
    let storageEnergy = 0;
    let limit = 1;
    // if (storage !== undefined) {
    //   storageEnergy = storage.store.getUsedCapacity(RESOURCE_ENERGY);
    //   if (storageEnergy > 15000) {
    //     limit = 2;
    //   } else if (storageEnergy > 5000) {
    //     limit = 2;
    //   }

    //   if (room.name == 'W29N14' && storageEnergy > 10000) {
    //     limit = 4;
    //   }
    // }

    // if (room.name === 'W27N13') {
    //   limit = 1;
    // } else if (room.name === 'W28N12') {
    //   limit = 1;
    // } else if (room.name === 'W29N13') {
    //   limit = 1;
    // } else if (room.name === 'W28N14') {
    //   limit = 1;
    // }

    if (room.name === 'W27N12') {
      limit = 2;
    }

    const toBuild = room.controller.level < 8 ? limit : 1;

    return upgradersCount < toBuild;
  }
}
