/*jshint esversion: 6 */

console.log('>> Loading Upgrader Role...');

export default class Upgrader {

  constructor() {

  }

  /** @param {Creep} creep **/
  run(creep) {
    creep.job('upgrading');

    if (creep.carry.energy == 0) {
			this.harvest(creep);
    } else {
			this.upgrade(creep);
		}
  }

  harvest(creep) {
    var sources = creep.room.find(FIND_SOURCES);

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
