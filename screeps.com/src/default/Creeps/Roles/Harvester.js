/*jshint esversion: 6 */
console.log('>> Loading Harvester Role...');

export default class Harvester {

  constructor() {

  }

  /** @param {Creep} creep **/
  run(creep) {
    creep.job('harvesting');

    if (!creep.isEnergyCapFull()) {
      this.harvest(creep);
    } else {
      this.transfer(creep);
    }
  }

  harvest(creep) {
    const sources = creep.getSources();
    creep.status('harvesting');
    creep.target(sources[0].id);

    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0]);
      creep.status('moving');
    }
  }

  transfer(creep) {
    const targets = creep.getEnergySinks();
    creep.status('transfering');
    creep.target(targets[0].id);

    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status('moving');
      }
    }
  }

  needsHelp(fromCreep) {
    return !fromCreep.isEnergyCapFull() && fromCreep.getSources().length
  }
}
