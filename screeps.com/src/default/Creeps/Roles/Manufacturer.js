/*jshint esversion: 6 */
import Role from "./Role.js";

/**
 * @class Hauler
 * @classdesc Hauler role class
 * @abstract
 * @global
 * @augments Role
 */
export default class Manufacturer extends Role {

  constructor() {
    super();
		this.ROLE = "manufacturer";
    this.POPULATION = 1;
    this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 2;
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
       (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
       (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
     ) {
       this.harvest(creep);
     }

     if (
       (creep.status() != "transfering" && creep.store.getFreeCapacity() === 0) ||
       (creep.status() == "transfering" && creep.store.getUsedCapacity() > 0) ||
       (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
     ) {
       this.transfer(creep);
     }

    //  this.dropRoad(creep);
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
    return false;
    const hasTerminal = CACHE.ROOMS[room.name].getMyTerminals().length;

    const count = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'manufacturer' && creep.memory.room == room.name
    ).length;

    return count < this.POPULATION && hasTerminal;
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const terminals = CACHE.ROOMS[creep.room.name].getMyTerminals();

    let targets = [];

    if (terminals.length && terminals[0].store.getFreeCapacity() > 100) {
      targets = terminals;
    }

    creep.status("transfering");

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status("moving");
      }
    }
  }

  harvest(creep) {
    creep.status("harvesting");

    const labs = CACHE.ROOMS[creep.room.name].getMyLabs();

    let selectedSource = false;
    labs.forEach((lab) => {
      if (lab.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0) {
        selectedSource = lab;
      }
    });

    if (
      selectedSource !== false && selectedSource !== undefined
    ) {
      if (creep.withdraw(selectedSource, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource);
        creep.status("moving");
      }
      creep.target(selectedSource.id);
    }
  }
}
