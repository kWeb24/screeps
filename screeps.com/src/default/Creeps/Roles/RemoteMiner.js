/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Miner
 * @classdesc Miner role class
 * @abstract
 * @augments Role
 */
export default class RemoteMiner extends Role {

  constructor() {
		super();

    this.ROLE = "remoteMiner";
    this.POPULATION = 1;
    this.GENOME = [WORK, WORK, CARRY, MOVE, MOVE];
    // this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 50;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Miner
   * @desc Run actual Miner Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    // Todo make it static and add hauler
    const flag = Game.flags['RemoteMine1'];
    if (!flag || creep.ticksToLive < 200) {
      if ((!creep.room.controller || !creep.room.controller.my) || !creep.room.storage) {
        creep.moveTo(Game.rooms[creep.memory.room].storage);
      } else {
        if (creep.store.getUsedCapacity() > 0) {
          if (creep.transferAny(creep.room.storage) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage);
            creep.status("moving");
          }
        } else {
          const spawn = creep.room.find(FIND_MY_SPAWNS);
          if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
             creep.moveTo(spawn[0], { reusePath: 10 });
          }
        }
      }
      return false;
   }
    if (
      (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
      (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
    ) {
      this.harvestMineral(creep);
    }

    if (
      (creep.status() != "transfering" && creep.store.getFreeCapacity() === 0) ||
      (creep.status() == "transfering" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    ) {
      this.transferMineral(creep);
    }
	}

	/**
   * @memberof Miner
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
    // return false;
    const flag = Game.flags['RemoteMine1'];
    if (!flag || room.name !== 'W29N14') return false;
    
    const minersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'remoteMiner' && creep.memory.room == room.name //&& creep.ticksToLive > 450
      ).length;
      
    return minersCount < this.POPULATION;
  }

  harvestMineral(creep) {
    creep.status("harvesting");

    const flag = Game.flags['RemoteMine1'];
    if (!flag) return false;
    if (flag.room === undefined) {
      creep.moveTo(flag);
      creep.status("moving");
    } else if (creep.room.name != flag.room.name) {
      creep.moveTo(flag);
      creep.status("moving");
    // } else if (creep.pos.getRangeTo(flag.pos) > 5) {
    //   creep.moveTo(flag);
    //   creep.status("moving");
    } else {
      const extractor = flag.room.find(FIND_DEPOSITS);
      if (extractor.length) {
        if (creep.harvest(extractor[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(extractor[0]);
          creep.status("moving");
        }
        creep.target(extractor[0].id);
        // power drops
        // this.harvestBodies(creep);
      }
    }
  }

  transferMineral(creep) {
    if ((!creep.room.controller || !creep.room.controller.my) || !creep.room.storage) {
      creep.moveTo(Game.rooms[creep.memory.room].storage);
    } else {
      const target = creep.room.terminal ? creep.room.terminal : creep.room.storage;
      if (creep.transferAny(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        creep.status("moving");
      }
    }
  }

  harvestBodies(creep) {
    creep.status("harvesting");
    const res = creep.room.find(FIND_DROPPED_RESOURCES);
    if (res.length) {
      res.forEach((r) => {
        if (creep.store.getFreeCapacity() > 0) {
          if (creep.pickup(r) == ERR_NOT_IN_RANGE) {
            creep.memory.target = undefined;
            creep.moveTo(r, { reusePath: 10 });
            creep.status("moving");
          }
        }
      });
      return false;
    }

    const tombstones = creep.room.find(FIND_TOMBSTONES);
    if (tombstones.length) {
      tombstones.forEach((tomb) => {
        if (tomb.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() > 0) {
          if (creep.withdrawAny(tomb) == ERR_NOT_IN_RANGE) {
            creep.memory.target = undefined;
            creep.moveTo(tomb, { reusePath: 10 });
            creep.status("moving");
          }
        }
      });
      return false;
    }
  }
}
