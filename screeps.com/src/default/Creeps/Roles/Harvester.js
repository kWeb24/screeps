/*jshint esversion: 6 */
console.log('>> Loading Harvester Role...');

import Role from './Role.js';

export default class Harvester extends Role {

  constructor() {
    super();

    this.ROLE = 'harvester';
    this.POPULATION = 3;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['upgrader', 'builder'];
    this.ON_DEMAND = false;
  }

  /** @param {Creep} creep **/
  run(creep) {
    creep.job('harvesting');

    if (!creep.isEnergyCapFull()) {
      this.harvest(creep);
    } else {
      this.transfer(creep);
    }

    this.dropRoad(creep);
  }

  /** @param {Creep} creep **/
  harvest(creep) {
    const sources = creep.getSources();
    creep.status('harvesting');
    creep.target(sources[0].id);

    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0]);
      creep.status('moving');
    }
  }

  /** @param {Creep} creep **/
  transfer(creep) {
    const targets = creep.getEnergySinks();
    creep.status('transfering');

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status('moving');
      }
    }
  }

  /** @param {Creep} fromCreep **/
  needsHelp(fromCreep) {
    return !fromCreep.isEnergyCapFull() && fromCreep.getSources().length;
  }
}
