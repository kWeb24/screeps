/*jshint esversion: 6 */
import Role from "./Role.js";

/**
 * @class Hauler
 * @classdesc Hauler role class
 * @abstract
 * @global
 * @augments Role
 */
export default class Transporter extends Role {

  constructor() {
    super();
		this.ROLE = "transporter";
    this.POPULATION = 4;
    this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 40;
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
      if (creep.store.getFreeCapacity() > 0) {
        if (creep.room.name != creep.memory.room) {
          creep.moveTo(Game.rooms[creep.memory.room].storage, { reusePath: 50 });
        } else {
          if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 10 });
          }
        }
      } else {
        if (creep.room.name != 'W29N13') {
          creep.moveTo(new RoomPosition(35, 10, 'W29N13', { reusePath: 50 }));
        } else {
          let target = false;
          if (creep.room.storage) {
            target = creep.room.storage;
          }
          const containers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity()
          });
          if (containers.length && !target) {
            target = containers[0];
          }
          if (creep.transferAny(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { reusePath: 10 });
          }
        }
      }
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
    const hasStorage = room.storage !== undefined;

    const haulersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'transporter' && creep.memory.room == room.name
    ).length;

    return haulersCount < this.POPULATION && room.name === 'W29N14';
  }
}
