/*jshint esversion: 6 */

console.log('>> Loading Builder Role...');

export default class Builder {

  constructor() {

  }

	/** @param {Creep} creep **/
	run(creep) {
    creep.job('building');

    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'building' && creep.isEnergyCapFull()) ||
        (creep.status() == 'building' && creep.carry.energy > 0)) {
			this.build(creep);
		}
	}

  harvest(creep) {
    const sources = creep.getSources();

		creep.status('harvesting');
		creep.target(sources[1].id);

		if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[1]);
		}
  }

  build(creep) {
    var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    creep.status('building');

    if (targets) {
      if (creep.build(targets) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets);
        creep.status('moving');
        creep.target(targets.id);
      }
    } else {
      creep.moveTo(Game.flags['BuildersGatherPoint']);
      creep.status('bored');
      creep.target('BuildersGatherPoint');
    }
  }

	needsHelp(fromCreep) {
		var targets = fromCreep.room.find(FIND_CONSTRUCTION_SITES);
		return targets.length;
	}
}
