/*jshint esversion: 6 */

console.log('>> Loading Repairer Role...');

import Role from './Role.js';

/**
 * @class Repairer
 * @classdesc Repairer role class
 * @abstract
 * @augments Role
 */
export default class Repairer extends Role {

  constructor() {
    super();

		this.ROLE = 'repairer';
    this.POPULATION = 1;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['upgrader'];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Repairer
   * @desc Run actual Repairer Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'repairing' && creep.isEnergyCapFull()) ||
        (creep.status() == 'repairing' && creep.carry.energy > 0) ||
        (creep.status() == 'bored' && creep.carry.energy > 0) ||
        (creep.status() == 'moving' && creep.carry.energy > 0)) {
			this.repair(creep);
		}

		this.dropRoad(creep);
	}

  /**
   * @memberof Repairer
   * @desc Repair {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
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
      const [spawn] = CACHE.ROOMS[creep.room.name].getMySpawns();
      const pos = CACHE.ROOMS[creep.room.name].ROOM.getPositionAt(spawn.pos.x - 4, spawn.pos.y + 5);
      creep.moveTo(pos);
			creep.status('bored');
      creep.target('none');
		}
	}

  /**
   * @memberof Repairer
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
	 * @override
	 * @see Role
   **/
	needsHelp(fromCreep) {
		var target = this.findClosestRepairableStructure(fromCreep);
		return (target) ? true : false;
	}

  /**
   * @memberof Repairer
   * @desc Find closest repairable {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
	 * by range that is not type of STRUCTURE_WALL or STRUCTURE_ROAD
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
	findClosestRepairableStructure(creep) {
		let closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => (structure.hits < structure.hitsMax / 1.3) && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_ROAD
		});

		if (!closest || closest === null) {
			closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => (structure.hits < structure.hitsMax / 1.3)
			});
			return closest;
		} else {
			return closest;
		}
	}
}
