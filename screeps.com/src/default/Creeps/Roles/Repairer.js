/*jshint esversion: 6 */

console.log('>> Loading Repairer Role...');

export default class Repairer {

  constructor() {

  }

	/** @param {Creep} creep **/
	run(creep) {
		creep.job('repairing');

    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'repairing' && creep.isEnergyCapFull()) ||
        (creep.status() == 'repairing' && creep.carry.energy > 0)) {
			this.repair(creep);
		}

    if (creep.carry.energy == 0) {
			this.harvest(creep);
    } else {
			this.repair(creep);
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

	repair(creep) {
		var target = this.findClosestRepairableStructure(creep);

		creep.status('repairing');

		if (target) {
			creep.target(target.id);
			if (creep.repair(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target);
				creep.status('moving');
			}
		} else {
			creep.moveTo(Game.flags['BuildersGatherPoint'], {visualizePathStyle: {stroke: '#faff00'}});
			creep.status('bored');
      creep.target('none');
		}
	}

	needsHelp(fromCreep) {
		var target = this.findClosestRepairableStructure(fromCreep);
		return (target) ? true : false;
	}

	findClosestRepairableStructure(creep) {
		return creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => (structure.hits < structure.hitsMax / 1.3) && structure.structureType != STRUCTURE_WALL
		});
	}
}
