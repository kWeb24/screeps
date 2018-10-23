/*jshint esversion: 6 */
console.log('>> Loading Harvester Role...');

import Role from './Role.js';

/**
 * @class Harvester
 * @classdesc Harvester role class
 * @abstract
 * @augments Role
 */
export default class Harvester extends Role {

  constructor() {
    super();

    this.ROLE = 'harvester';
    this.POPULATION = 4;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['upgrader', 'builder'];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Harvester
   * @desc Run actual Harvester Role loop
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

    if ((creep.status() != 'transfering' && creep.isEnergyCapFull()) ||
        (creep.status() == 'transfering' && creep.carry.energy > 0) ||
        (creep.status() == 'moving' && creep.carry.energy > 0)) {
			this.transfer(creep);
		}

    this.dropRoad(creep);
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const sinks = creep.getEnergySinks();

    const spawnRelated = _.filter(sinks, (sink) => {
      return ((sink.structureType == STRUCTURE_EXTENSION || sink.structureType == STRUCTURE_SPAWN) && sink.energy < sink.energyCapacity)
    });

    const storageRelated = _.filter(sinks, (sink) => {
      return (sink.structureType == STRUCTURE_CONTAINER || sink.structureType == STRUCTURE_STORAGE) && (_.sum(sink.store) < sink.storeCapacity)
    });

    let targets = [];

    if (spawnRelated.length) {
      targets = spawnRelated;
    } else if (storageRelated.length) {
      targets = storageRelated;
    }

    creep.status('transfering');

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status('moving');
      }
    }
  }

  /**
   * @memberof Harvester
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
	 * @override
	 * @see Role
   **/
  needsHelp(fromCreep) {
    return !fromCreep.isEnergyCapFull() && fromCreep.getSources().length;
  }
}
