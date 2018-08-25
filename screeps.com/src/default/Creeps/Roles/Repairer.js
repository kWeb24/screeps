/*jshint esversion: 6 */

console.log('>> Loading Repairer Role...');

import Role from './Role.js';

export default class Repairer extends Role {

  constructor() {
    super();

		this.ROLE = 'repairer';
    this.POPULATION = 2;
    this.GENOME = [WORK, WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['harvester', 'upgrader', 'builder'];
    this.ON_DEMAND = false;
  }

	/** @param {Creep} creep **/
	run(creep) {
		creep.job('repairing');

    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'repairing' && creep.isEnergyCapFull()) ||
        (creep.status() == 'repairing' && creep.carry.energy > 0) ||
        (creep.status() == 'moving' && creep.carry.energy > 0)) {
			this.repair(creep);
		}

    if (creep.carry.energy == 0) {
			this.harvest(creep);
    } else {
			this.repair(creep);
		}
	}

	/** @param {Creep} creep **/
	harvest(creep) {
		const sources = creep.getSources();

		creep.status('harvesting');
		creep.target(sources[0].id);

		if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0]);
		}
	}

	/** @param {Creep} creep **/
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

	/** @param {Creep} fromCreep **/
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
