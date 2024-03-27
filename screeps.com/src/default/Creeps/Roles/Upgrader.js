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
    this.MAX_GENOME_LENGTH = 15;
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
    if (
      (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
      (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
    ) {
      this.harvest(creep);
    }

    if (
      (creep.status() != "upgrading" && creep.store.getFreeCapacity() === 0) ||
      (creep.status() == "upgrading" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    ) {
      this.upgrade(creep);
    }

    this.dropRoad(creep);
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

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
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
    let limit = 2;
    if (storage !== undefined) {
      storageEnergy = storage.store.getUsedCapacity(RESOURCE_ENERGY);
      if (storageEnergy > 5000) {
        limit = 6;
      }
    }

    const toBuild = room.controller.level < 8 ? limit : 1;

    return upgradersCount < toBuild;
  }
}
