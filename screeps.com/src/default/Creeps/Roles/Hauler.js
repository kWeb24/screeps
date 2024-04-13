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
    this.MAX_GENOME_LENGTH = 14;
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
      
    if (spawnRelated && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      targets.push(spawnRelated);
    } else if (
      terminal !== undefined && 
      (
        (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 3000) ||
        (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 && creep.store.getUsedCapacity() > 0 && terminal.store.getFreeCapacity() > creep.store.getUsedCapacity())
      )
    ) {
      targets = [terminal];
    } else if (labsWithoutEnergy.length && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      targets = labsWithoutEnergy;
    } else if (storageRelated.length) {
      targets = storageRelated;
    }

    creep.status("transfering");
    if (targets.length > 0) {
      creep.target('none');
      if (creep.transferAny(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status("moving");
      }
    }
  }

  harvest(creep) {
    creep.status("harvesting");

    // if (creep.room.terminal !== undefined) {
    //   if (creep.withdraw(creep.room.storage, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(creep.room.storage);
    //     creep.status("moving");
    //   }
    //   creep.target(selectedSource.id);
    // }
    // return false;

    let selectedSource = false;
    if (creep.memory.target !== undefined && creep.memory.target !== 'none') {
      const targetObj = Game.getObjectById(creep.memory.target);
      if (targetObj && targetObj.store.getUsedCapacity() >= 0) {
        selectedSource = targetObj;
      }
    }

    if (!selectedSource) {
      const tombstones = creep.room.find(FIND_TOMBSTONES);
      if (tombstones.length) {
        tombstones.forEach((tomb) => {
          if (tomb.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() >= tomb.store.getUsedCapacity()) {
            selectedSource = tomb;
          }
        });
      }
    }    

    if (!selectedSource) {
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
          return cnt.store.getUsedCapacity() >= creep.store.getFreeCapacity();
        });
        if (notEmptyContainers.length) {
          const mostUsed = notEmptyContainers.reduce((a, b) => {
            return (a.store.getUsedCapacity() > b.store.getUsedCapacity()) ? a : b;
          });
          container = mostUsed;
        }
      }
      
      // const tombstones = creep.room.find(FIND_TOMBSTONES);

      const terminal = creep.room.terminal;

      if (container) {
        selectedSource = container;
      } else if (terminal && terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 3000) {
        selectedSource = terminal;
      } else if (storage) {
        selectedSource = storage;
      }
    }
    if (
      selectedSource !== false
    ) {
      if (selectedSource.structureType == STRUCTURE_STORAGE) {
        if (creep.withdraw(selectedSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(selectedSource);
          creep.status("moving");
        }
      } else {
        if (creep.withdrawAny(selectedSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(selectedSource);
          creep.status("moving");
        }
      }
      creep.target(selectedSource.id);
    }
  }
}
