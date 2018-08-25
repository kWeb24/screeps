/*jshint esversion: 6 */

console.log('>> Loading Road Keeper...');

import Repairer from './Repairer.js';

export default class RoadKeeper extends Repairer {

  constructor() {
    super();

		this.ROLE = 'roadKeeper';
    this.POPULATION = 2;
    this.GENOME = [WORK, CARRY, MOVE, MOVE];
    this.CAPABLE_OF = ['upgrader'];
    this.ON_DEMAND = false;
  }

	findClosestRepairableStructure(creep) {
		return creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => (structure.hits < structure.hitsMax / 1.3) && structure.structureType == STRUCTURE_ROAD
		});
	}
}
