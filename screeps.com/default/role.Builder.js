/*jshint esversion: 6 */

class Builder {

  constructor() {

		console.log('-- Loading Builder Role...');
  }

	/** @param {Creep} creep **/
	run(creep) {
		if (creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say('harvesting');
		}

		if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say('building');
		}

		if (creep.memory.building) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			} else {
        creep.moveTo(Game.flags['BuildersGatherPoint'], {visualizePathStyle: {stroke: '#ffffff'}});
      }
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}

	needsHelp(fromCreep) {
		var targets = fromCreep.room.find(FIND_CONSTRUCTION_SITES);
		return targets.length;
	}
}

module.exports = Builder;
