/*jshint esversion: 6 */

console.log('>> Loading Road Keeper...');

import Repairer from './Repairer.js';

/**
 * @class RoadKeeper
 * @classdesc RoadKeeper role class
 * @abstract
 * @augments Repairer
 */
export default class RoadKeeper extends Repairer {

  constructor() {
    super();

		this.ROLE = 'roadKeeper';
    this.POPULATION = 2;
    this.GENOME = [WORK, CARRY, MOVE, MOVE];
    this.CAPABLE_OF = ['upgrader'];
    this.ON_DEMAND = false;
  }

  /**
   * @memberof RoadKeeper
   * @desc Find closest repairable {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * by range that is type of STRUCTURE_ROAD
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
	findClosestRepairableStructure(creep) {
		return creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => (structure.hits < structure.hitsMax / 1.3) && structure.structureType == STRUCTURE_ROAD
		});
	}
}
