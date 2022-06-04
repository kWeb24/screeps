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
    this.POPULATION = 1;
    this.GENOME = [WORK, CARRY, MOVE, MOVE];
    this.MAX_GENOME_LENGTH = 8;
    this.CAPABLE_OF = ['upgrader'];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = true;
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

  shouldSpawn(room) {
    const upgradersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'roadKeeper' && creep.memory.room == room.name
    ).length;

    return upgradersCount < this.POPULATION;
  }
}
