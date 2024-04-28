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
    this.POPULATION = 1;
    this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 40;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = true;

    this.FROM = 'W27N13';
    this.DEST = 'W28N14';
    this.RESOURCE = RESOURCE_POWER;
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
      if (creep.ticksToLive < 150) {
        const spawns = creep.room.find(FIND_MY_SPAWNS);
        if (spawns.length) {
          if (spawns[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawns[0], { reusePath: 100 });
            return false;
          }
        }
      }
      if (creep.store.getFreeCapacity() > 0) {
        if (creep.room.name != creep.memory.room) {
          creep.moveTo(Game.rooms[creep.memory.room].storage, { reusePath: 100 });
        } else {
          if (creep.withdraw(creep.room.storage, this.RESOURCE) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 10 });
          }
        }
      } else {
        if (creep.room.name != this.DEST) {
          creep.moveTo(new RoomPosition(35, 10, this.DEST, { reusePath: 100 }));
        } else {
          let target = false;
          if (creep.room.storage) {
            target = creep.room.storage;
          }
          // const containers = creep.room.find(FIND_STRUCTURES, {
          //   filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity()
          // });
          // if (containers.length && !target) {
          //   target = containers[0];
          // }
          if (target) {
            if (creep.transferAny(target) == ERR_NOT_IN_RANGE) {
              creep.moveTo(target, { reusePath: 50 });
            }
          } else {
            const spawns = creep.room.find(FIND_MY_SPAWNS);
            if (spawns) {
              creep.moveTo(spawns[0], { reusePath: 50 })
            }
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
    return false;
    const hasStorage = room.storage !== undefined;

    const haulersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'transporter' && creep.memory.room == room.name
    ).length;

    return haulersCount < this.POPULATION && room.name === this.FROM;
  }
}
