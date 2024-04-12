/*jshint esversion: 6 */
import Role from "./Role.js";

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
    this.MAX_GENOME_LENGTH = 10;
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
    const hasStorage = room.storage !== undefined;

    const haulersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'hauler' && creep.memory.room == room.name
    ).length;

    return haulersCount < this.POPULATION && room.controller.level > 2;
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const sinks = creep.getEnergySinks();
    const terminal = creep.room.terminal;
    const labs = CACHE.ROOMS[creep.room.name].getMyLabs();
    let labsWithoutEnergy = [];
    if (labs.length) {
      labsWithoutEnergy = _.filter(labs, lab => {
        return (lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
      });
    }

    // const spawnRelated = _.filter(sinks, sink => {
    //   return (
    //     (sink.structureType == STRUCTURE_EXTENSION ||
    //       sink.structureType == STRUCTURE_SPAWN) &&
    //     sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    //   );
    // });

    const spawnRelated = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: obj => {
        return (obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN) &&
                obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }
    });
    
    const storageRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_STORAGE) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      });
      
      let targets = [];
      
    if (spawnRelated) {
      targets.push(spawnRelated);
    } else if (terminal !== undefined && terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 5000) {
      targets = [terminal];
    } else if (labsWithoutEnergy.length) {
      targets = labsWithoutEnergy;
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

    // Handle Tombstone withdraw and dropped resources pickup

    const roomContainers = CACHE.ROOMS[creep.room.name].getContainers();
    const roomStorage = creep.room.storage;
    let storage = false;
    let container = false;

    if (roomStorage !== undefined) {
      if (roomStorage.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
        storage = roomStorage;
      }
    }

    if (roomContainers !== undefined) {
      const notEmptyContainers = _.filter(roomContainers, cnt => {
        return cnt.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(RESOURCE_ENERGY);
      });
      if (notEmptyContainers.length) {
        container = notEmptyContainers[0];
      }
    }

    // const tombstones = creep.room.find(FIND_TOMBSTONES);

    // creep.withdraw(creep.room.storage, _.findKey(creep.room.storage.store));

    const terminal = creep.room.terminal;

    let selectedSource = false;
    
    if (container) {
      selectedSource = container;
    } else if (storage) {
      selectedSource = storage;
    } else if (terminal && terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 5000) {
      selectedSource = terminal;
    }

    if (
      selectedSource !== false
    ) {
      if (creep.withdraw(selectedSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource);
        creep.status("moving");
      }
      creep.target(selectedSource.id);
    }
  }
}
