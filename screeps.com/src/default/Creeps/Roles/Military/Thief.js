import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Thief extends Role {

  constructor() {
      super();
      this.ROLE = "thief";
      this.POPULATION = 4;
      this.GENOME = [MOVE, CARRY];
      this.MAX_GENOME_LENGTH = 50;
      this.CAPABLE_OF = [];
      this.ON_DEMAND = false;
      this.USE_ENERGY_DEPOSITS = false;
  }

	/**
   * @memberof Destroyer
   * @desc Run actual Destroyer Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    if (creep.store.getFreeCapacity() > 0 && creep.ticksToLive > 300) {
      if (creep.room.name != 'W29N15') {
        creep.moveTo(new RoomPosition(4, 34, 'W29N15'));
      } else {
        let toWithdraw = RESOURCE_ENERGY;
        // if (creep.room.storage.store.getUsedCapacity('GO') > 0) {
        //   toWithdraw = 'GO';
        // } else if (creep.room.storage.store.getUsedCapacity('KO') > 0) {
        //   toWithdraw = 'KO';
        // } else if (creep.room.storage.store.getUsedCapacity('ZH') > 0) {
        //   toWithdraw = 'ZH';
        // } else if (creep.room.storage.store.getUsedCapacity('UH') > 0) {
        //   toWithdraw = 'UH';
        // }
        if (creep.room.storage && creep.room.storage.store.getUsedCapacity() > 0) {
          if (creep.withdraw(creep.room.storage, toWithdraw) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 10 });
          }
        } else {
          const structures = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (
              (
                structure.structureType === STRUCTURE_LINK ||
                structure.structureType === STRUCTURE_CONTAINER ||
                structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_TOWER ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TERMINAL
              ) && (structure.store && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            )
          });

          if (structures.length) {
            if (creep.withdraw(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structures[0], { reusePath: 10 });
            }
          } else {
            const tombs = creep.room.find(FIND_TOMBSTONES, {
              filter: tomb => (
                tomb.store.getUsedCapacity(RESOURCE_ENERGY) > 0
              )
            });
            if (tombs.length) {
              if (creep.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombs[0], { reusePath: 10 });
              }
            } else {
              const ruins = creep.room.find(FIND_RUINS);
              if (ruins.length) {
                if (creep.withdraw(ruins[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(ruins[0], { reusePath: 10 });
                }
              }
            }
          }
        }
      }
    } else if (creep.store.getUsedCapacity() > 0) {
      if (creep.room.name != 'W29N14') {
        creep.moveTo(new RoomPosition(2, 18, 'W29N14', { reusePath: 30 }));
      } else {
        if (creep.store.getUsedCapacity() > 0) {
          if (creep.transferAny(creep.room.storage) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, { reusePath: 10 });
          }
        }
      }
    } else if (creep.ticksToLive < 300) {
      const spawn = creep.room.find(FIND_MY_SPAWNS);
      if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn[0], { reusePath: 10 });
      }
    }

	}

	needsHelp(fromCreep) {
		return false;
	}

  shouldSpawn(room) {
    return false;
    if (room.name === 'W29N14') {
      // return true;
      const count = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'thief' && creep.memory.room == room.name
      ).length;
  
      if (count >= this.POPULATION) return false;
      return true;
    }

    return false;
  }
}
