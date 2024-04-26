import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Dismantler extends Role {

  constructor() {
      super();
      this.ROLE = "dismantler";
      this.POPULATION = 1;
      this.GENOME = [WORK, CARRY, MOVE];
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
      if (creep.room.name != 'W27N12') {
        creep.moveTo(new RoomPosition(27, 8, 'W27N12'));
      } else {
        let toWithdraw = RESOURCE_ENERGY;

        const structures = [];
        // const structures = creep.room.find(FIND_STRUCTURES, {
        //   filter: structure => (
        //     ((
        //       structure.structureType === STRUCTURE_LINK ||
        //       structure.structureType === STRUCTURE_CONTAINER ||
        //       structure.structureType === STRUCTURE_EXTENSION ||
        //       structure.structureType === STRUCTURE_TOWER ||
        //       structure.structureType === STRUCTURE_TERMINAL
        //     ) && 
        //     (structure.store && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0) ||
        //     (structure.structureType === STRUCTURE_SPAWN && structure.store.getUsedCapacity(RESOURCE_ENERGY) == 300))
        //   )
        // });

        if (structures.length) {
          if (creep.withdraw(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structures[0], { reusePath: 10 });
          }
        } else {
          const toDismantle = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (
               structure.structureType != STRUCTURE_ROAD && 
               structure.structureType != STRUCTURE_CONTROLLER
            )
          });
          if (toDismantle.length) {
            if (creep.dismantle(toDismantle[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(toDismantle[0], { reusePath: 10 });
            }
          }
        }
      }
    } else if (creep.store.getUsedCapacity() > 0) {
      if (creep.room.name != 'W27N13') {
        creep.moveTo(new RoomPosition(30, 43, 'W27N13', { reusePath: 30 }));
      } else {
        if (creep.store.getUsedCapacity() > 0) {
          const cnt = Game.getObjectById('662391feda849177a7e61c52');
          if (cnt) {
            if (creep.transferAny(cnt) == ERR_NOT_IN_RANGE) {
              creep.moveTo(cnt, { reusePath: 10 });
            }
          } else {
            if (creep.transferAny(creep.room.storage) == ERR_NOT_IN_RANGE) {
              creep.moveTo(creep.room.storage, { reusePath: 10 });
            }
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
    if (room.name === 'W27N13') {
      // return true;
      const count = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'dismantler' && creep.memory.room == room.name
      ).length;
  
      if (count >= this.POPULATION) return false;
      return true;
    }

    return false;
  }
}
