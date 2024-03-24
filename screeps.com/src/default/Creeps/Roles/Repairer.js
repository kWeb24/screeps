/*jshint esversion: 6 */

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
    this.MAX_GENOME_LENGTH = 6;
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
    if (
      (creep.status() != 'harvesting' && creep.store.getUsedCapacity() === 0) ||
      (creep.status() == 'harvesting' && creep.store.getFreeCapacity() > 0)
    ) {
			this.harvest(creep);
    }

    if ((creep.status() != 'repairing' && creep.store.getFreeCapacity() === 0) ||
        (creep.status() == 'repairing' && creep.store.getUsedCapacity() > 0) ||
        (creep.status() == 'bored' && creep.store.getUsedCapacity() > 0) ||
        (creep.status() == 'moving' && creep.store.getUsedCapacity() > 0)) {
			this.repair(creep);
		}
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
			} else if (target.structureType == STRUCTURE_TOWER) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
  				creep.status('moving');
        }
      }
		} else {
      // const [spawn] = CACHE.ROOMS[creep.room.name].getMySpawns();
      // const pos = CACHE.ROOMS[creep.room.name].ROOM.getPositionAt(spawn.pos.x - 4, spawn.pos.y + 5);
      // creep.moveTo(pos);
			// creep.status('bored');
      // creep.target('none');
      creep.target(creep.room.controller.name);

      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
        creep.status("moving");
      }
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
    const towers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
		});

    if (towers) {
      return towers;
    }

		let closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) =>
        ((
          structure.hits < structure.hitsMax &&
          creep.room.storage !== undefined &&
          creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 50000
        ) /*|| structure.hits < 100000*/) 
        ||  
        ((structure.hits < structure.hitsMax * 1) && structure.hits < 100000 && structure.structureType != STRUCTURE_ROAD)
		});

		if (!closest || closest === null) {
			closest = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => (structure.hits < structure.hitsMax * 1)
			});
			return closest;
		} else {
			return closest;
		}
	}

  shouldSpawn(room) {
    const upgradersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'repairer' && creep.memory.room == room.name
    ).length;

    return upgradersCount < this.POPULATION;
  }
}
