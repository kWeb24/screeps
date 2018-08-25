/*jshint esversion: 6 */
console.log('>> Loading Harvester Role...');

import Role from './Role.js';

export default class Harvester extends Role {

  constructor() {
    super();

    this.ROLE = 'harvester';
    this.POPULATION = 3;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = ['upgrader', 'builder'];
    this.ON_DEMAND = false;
  }

  /** @param {Creep} creep **/
  run(creep) {
    creep.job('harvesting');

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

  /** @param {Creep} creep **/
  harvest(creep) {
    const selectedSource = this.selectSource(creep);

    creep.status('harvesting');
    creep.target(selectedSource.id);

    if (creep.harvest(selectedSource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(selectedSource);
      creep.status('moving');
    }
  }

  /** @param {Creep} creep **/
  selectSource(creep) {
    let sources = creep.getSources();
    const primarySource = _.filter(sources, (source) => source.id == creep.memory.primarySource);
    let selectedSource = primarySource[0];

    if (primarySource.energy < creep.carryCapacity || primarySource.ticksToRegeneration > 10) {
      selectedSource = creep.getClosestActiveSource();
    }

    return selectedSource;
  }

  /** @param {Creep} creep **/
  transfer(creep) {
    const targets = creep.getEnergySinks();
    creep.status('transfering');

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status('moving');
      }
    }
  }

  /** @param {Creep} fromCreep **/
  needsHelp(fromCreep) {
    return !fromCreep.isEnergyCapFull() && fromCreep.getSources().length;
  }
}
