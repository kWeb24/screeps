/*jshint esversion: 6 */

console.log('>> Loading Builder Role...');

import Role from './Role.js';

/**
 * @class Builder
 * @classdesc Builder role class
 * @abstract
 * @augments Role
 */
export default class Builder extends Role {

  constructor() {
    super();

    this.ROLE = 'builder';
    this.POPULATION = 2;
    this.GENOME = [WORK, WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['upgrader'];
    this.ON_DEMAND = true;
  }

  /**
   * @memberof Builder
   * @desc Run actual Builder Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    creep.job('building');

    if ((creep.status() != 'harvesting' && creep.carry.energy == 0) ||
        (creep.status() == 'harvesting' && !creep.isEnergyCapFull())) {
			this.harvest(creep);
    }

    if ((creep.status() != 'building' && creep.isEnergyCapFull()) ||
        (creep.status() == 'building' && creep.carry.energy > 0) ||
        (creep.status() == 'moving' && creep.carry.energy > 0)) {
			this.build(creep);
		}
	}

  /**
   * @memberof Builder
   * @desc Harvest energy
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  harvest(creep) {
    const sources = creep.getSources();

		creep.status('harvesting');
		creep.target(sources[1].id);

		if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[1]);
      creep.status('moving');
		}
  }

  /**
   * @memberof Builder
   * @desc Build {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  build(creep) {
    var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    creep.status('building');

    if (targets) {
      if (creep.build(targets) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets);
        creep.status('moving');
        creep.target(targets.id);
      }
    } else {
      creep.moveTo(Game.flags['BuildersGatherPoint']);
      creep.status('bored');
      creep.target('BuildersGatherPoint');
    }
  }

  /**
   * @memberof Builder
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
	 * @override
	 * @see Role
   **/
	needsHelp(fromCreep) {
		var targets = fromCreep.room.find(FIND_CONSTRUCTION_SITES);
		return targets.length;
	}
}
