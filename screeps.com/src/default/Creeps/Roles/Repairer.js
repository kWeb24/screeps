/*jshint esversion: 6 */

console.log('>> Loading Repairer Role...');

export default class Repairer {

  constructor() {

  }

	/** @param {Creep} creep **/
	run(creep) {
		if (creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
			creep.say('harvesting');
		}

		if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
			creep.memory.repairing = true;
			creep.say('repairing');
		}

		if (creep.memory.building) {
			var target = this.findClosestRepairableStructure(creep);

			if (target.length) {
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#faff00'}});
				}
			} else {
        creep.moveTo(Game.flags['BuildersGatherPoint'], {visualizePathStyle: {stroke: '#faff00'}});
      }
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}

	needsHelp(fromCreep) {
		var target = this.findClosestRepairableStructure(fromCreep);
		return target.length;
	}

	findClosestRepairableStructure(creep) {
		return creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => (structure.hits < structure.hitsMax / 1.3) && structure.structureType != STRUCTURE_WALL
		});
	}
}
