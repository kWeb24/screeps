/*jshint esversion: 6 */
import Role from "./Role.js";

console.log('>> Loading Hauler Role...');

/**
 * @class Hauler
 * @classdesc Hauler role class
 * @abstract
 * @global
 * @augments Role
 */
export default class Hauler extends Role {

  constructor() {
    super();
		this.ROLE = "hauler";
    this.POPULATION = 2;
    this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 6;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Hauler
   * @desc Run actual Hauler Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	 run(creep) {
     if (
       (creep.status() != "harvesting" && creep.carry.energy == 0) ||
       (creep.status() == "harvesting" && !creep.isEnergyCapFull())
     ) {
       this.harvest(creep);
     }

     if (
       (creep.status() != "transfering" && creep.isEnergyCapFull()) ||
       (creep.status() == "transfering" && creep.carry.energy > 0) ||
       (creep.status() == "moving" && creep.carry.energy > 0)
     ) {
       this.transfer(creep);
     }

     this.dropRoad(creep);
   }

	/**
   * @memberof Hauler
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
	 * @override
	 * @see Role
   **/
	needsHelp(fromCreep) {
		return false;
	}

	shouldSpawn(room) {
    const hasStorage = CACHE.ROOMS[room.name].getMyStorage().length;

    const haulersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'hauler' && creep.memory.room == room.name
    ).length;

    return haulersCount < this.POPULATION && hasStorage;
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const sinks = creep.getEnergySinks();

    const spawnRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_EXTENSION ||
          sink.structureType == STRUCTURE_SPAWN) &&
        sink.energy < sink.energyCapacity
      );
    });

    const storageRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_STORAGE) &&
        _.sum(sink.store) < sink.storeCapacity
      );
    });

    let targets = [];

    if (spawnRelated.length) {
      targets = spawnRelated;
    } else if (storageRelated.length) {
      targets = storageRelated;
    }

    creep.status("transfering");

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status("moving");
      }
    }
  }

  harvest(creep) {
    creep.status("harvesting");

    let selectedSource = this.selectEnergyDeposit(creep, false, true);
    if (
      selectedSource !== false &&
      typeof selectedSource != "string" &&
      selectedSource !== undefined
    ) {
      if (creep.withdraw(selectedSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource);
        creep.status("moving");
      }
      creep.target(selectedSource.id);
    }
  }
}
