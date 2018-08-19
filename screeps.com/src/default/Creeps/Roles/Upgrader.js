/*jshint esversion: 6 */

console.log('>> Loading Upgrader Role...');

export default class Upgrader {

  constructor() {

  }

  /** @param {Creep} creep **/
  run(creep) {
    creep.job('upgrading');

    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'upgrading' && creep.isEnergyCapFull()) ||
        (creep.status() == 'upgrading' && creep.carry.energy > 0)) {
			this.upgrade(creep);
		}
  }

  harvest(creep) {
    const sources = creep.getSources();

		creep.status('harvesting');
		creep.target(sources[0].id);

		if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0]);
		}
  }

  upgrade(creep) {
    creep.status('upgrading');
    creep.target(creep.room.controller.name);

    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
      creep.status('moving');
    }
  }

  needsHelp(fromCreep) {
    return fromCreep.carry.energy == fromCreep.carryCapacity;
  }
}
