/*jshint esversion: 6 */

console.log('>> Loading Builder Role...');

export default class Builder {

  constructor() {

  }

	/** @param {Creep} creep **/
	run(creep) {
    creep.job('building');

    if (creep.carry.energy == 0) {
			this.harvest(creep);
    } else {
			this.build(creep);
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

  build(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);

    creep.status('building');

    if (targets.length) {
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status('moving');
        creep.target(sources[0].id);
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
