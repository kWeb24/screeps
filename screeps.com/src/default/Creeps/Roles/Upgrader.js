/*jshint esversion: 6 */

console.log(">> Loading Upgrader Role...");

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
    this.POPULATION = 3;
    this.GENOME = [WORK, CARRY, MOVE];
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
      (creep.status() != "harvesting" && creep.carry.energy == 0) ||
      (creep.status() == "harvesting" && !creep.isEnergyCapFull())
    ) {
      this.harvest(creep);
    }

    if (
      (creep.status() != "upgrading" && creep.isEnergyCapFull()) ||
      (creep.status() == "upgrading" && creep.carry.energy > 0) ||
      (creep.status() == "moving" && creep.carry.energy > 0)
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
    return fromCreep.carry.energy == fromCreep.carryCapacity;
  }
}
