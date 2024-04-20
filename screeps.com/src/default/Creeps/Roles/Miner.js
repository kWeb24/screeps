/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Miner
 * @classdesc Miner role class
 * @abstract
 * @augments Role
 */
export default class Miner extends Role {

  constructor() {
		super();

    this.ROLE = "miner";
    this.POPULATION = 5;
    this.GENOME = [WORK, WORK, MOVE];
    this.MAX_GENOME_LENGTH = 33;
    this.CAPABLE_OF = ["upgrader", "builder"];
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
    const mineral = CACHE.ROOMS[creep.room.name].getMinerals();

    if (mineral[0].mineralAmount === 0) {
      if (creep.store.getUsedCapacity() > 0) {
        creep.dropAll();
      }
      const spawn = creep.room.find(FIND_MY_SPAWNS);
      if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn[0]);
      }
      return false;
    }
    // if (this.haveFullLab(creep.room)) return false;
    // if (
    //   (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
    //   (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
    // ) {
      this.harvestMineral(creep);
    // }

    // if (
    //   (creep.status() != "transfering" && creep.store.getFreeCapacity() === 0) ||
    //   (creep.status() == "transfering" && creep.store.getUsedCapacity() > 0) ||
    //   (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    // ) {
    //   this.transferMineral(creep);
    // }

    // this.dropRoad(creep);
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
    const sourcesCount = CACHE.ROOMS[room.name].getMyExtractors().length;

    if (!sourcesCount) {
      return false;
    }

    const mineral = CACHE.ROOMS[room.name].getMinerals();

    if (mineral[0].mineralAmount === 0) {
      return false;
    }

    if (this.haveFullLab(room)) return false;

    const minersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'miner' && creep.memory.room == room.name
    ).length;

    const dyingMinersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'miner' && creep.memory.room == room.name && creep.ticksToLive < 10
    ).length;


    return minersCount < sourcesCount || (dyingMinersCount && minersCount - 1 < sourcesCount);
  }

  harvestMineral(creep) {
    creep.status("harvesting");

    const t = CACHE.ROOMS[creep.room.name].getMinerals();
    if (t.length && t) {
      const atMyPos = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
      const containerAtMyPos = _.filter(atMyPos, structure => {
        return (
          structure.structureType == STRUCTURE_CONTAINER
        )
      });

      if (
        (containerAtMyPos.length && containerAtMyPos[0].store.getFreeCapacity() > 0) ||
        !containerAtMyPos.length
      ) {
        if (creep.harvest(t[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(t[0]);
          creep.status("moving");
        }
        creep.target(t[0].id);
      }
    }
  }

  transferMineral(creep) {
    const atMyPos = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
    const containerAtMyPos = _.filter(atMyPos, structure => {
      return (
        structure.structureType == STRUCTURE_CONTAINER
      )
    })
    if (containerAtMyPos.length) {
      if (containerAtMyPos[0].store.getFreeCapacity() >= creep.store.getUsedCapacity()) {
        creep.dropAll();
        return false;
      }
    }

    const sinks = CACHE.ROOMS[creep.room.name].getMyLabs();
    const type = CACHE.ROOMS[creep.room.name].getMinerals()[0].mineralType;
    const terminal = creep.room.terminal;
    const factory = CACHE.ROOMS[creep.room.name].getMyFactories()[0];

    const hasCapacity = _.filter(sinks, sink => {
      return (
        sink.store.getFreeCapacity(type) > 0
      );
    });

    let targets = [];
    if (terminal !== undefined && terminal.store.getFreeCapacity(type) > 0) {
      targets.push(terminal);
    } else if (factory && factory.store.getFreeCapacity(type) > 0) {
      targets.push(factory);
    } else if (hasCapacity.length) {
      targets = hasCapacity;
    }

    creep.status("transfering");

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], type) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status("moving");
      }
    }
  }

  haveFullLab(room) {
    const type = CACHE.ROOMS[room.name].getMinerals()[0].mineralType;
    const sinks = CACHE.ROOMS[room.name].getMyLabs();
    const terminal = room.terminal;
    const factory = CACHE.ROOMS[room.name].getMyFactories()[0];

    const haveFullLab = _.filter(sinks, sink => {
      return (
        sink.store.getFreeCapacity(type) == 0
      );
    });

    if (factory && terminal) {
      return haveFullLab && factory.store.getFreeCapacity(type) === 0 && terminal.store.getFreeCapacity(type) === 0;
    } else if (factory) {
      return haveFullLab && factory.store.getFreeCapacity(type) === 0;
    } else if (terminal !== undefined) {
      return haveFullLab && terminal.store.getFreeCapacity(type) === 0;
    } else {
      return haveFullLab;
    }
  }
}
