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
    this.POPULATION = 1;
    this.GENOME = [CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 26;
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
    const t = Game.cpu.getUsed();
    const haulersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'hauler' && creep.memory.room == room.name && creep.ticksToLive > 100
    ).length;
    // console.log(Game.cpu.getUsed() - t);
    let limit = this.POPULATION;
    if (room.name == 'W27N13') {
      limit = 2;
    }
    return haulersCount < limit && room.controller.level > 2;
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    // TODO stop handling spawns if room have manager
    
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

    if (!spawnRelated) {
      for (const flag in Game.flags) {
        if (flag.charAt(0) === '$') {
          const parts = flag.split(';');
          const roomName = parts[1];
          const action = parts[2];
          const resource = parts[3];

          if (roomName === creep.room.name) {
            if (action === 'D') {
              const atPos = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags[flag].pos).filter((structure) => {
                return structure.structureType === STRUCTURE_LAB
              });
              if (atPos.length && atPos[0].store.getFreeCapacity(resource) >= creep.store.getUsedCapacity(resource)) {
                if (creep.store.getUsedCapacity(resource) > 0) {
                  if (creep.transfer(atPos[0], resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(atPos[0], { reusePath: 10 });
                    creep.status("moving");
                    return false;
                  }
                }
              }
            }
          }
        }
      }
      
      const factory = Game.getObjectById('662ba59f3139bc7b6167174b');
      if (factory && creep.room.name === 'W28N13') {
        if (creep.room.name === 'W28N13' && creep.store.getUsedCapacity(RESOURCE_BATTERY) > 0) {
          if (creep.transfer(factory, RESOURCE_BATTERY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(factory, { reusePath: 10 });
            creep.status("moving");
          }
          return false;
        }
  
        // if (creep.room.name === 'W28N13' && creep.store.getUsedCapacity(RESOURCE_SILICON) > 0 && creep.room.terminal.store.getUsedCapacity(RESOURCE_SILICON) > 0) {
        //   if (creep.transfer(factory, RESOURCE_SILICON) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(factory, { reusePath: 10 });
        //     creep.status("moving");
        //   }
        //   return false;
        // }
  
        // if (
        //   creep.room.name === 'W28N13' && 
        //   creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && 
        //   factory.store.getUsedCapacity(RESOURCE_ENERGY) < 5000 &&
        //   factory.store.getFreeCapacity(RESOURCE_ENERGY) > 1000
        //   ) {
        //   if (creep.transfer(factory, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(factory, { reusePath: 10 });
        //     creep.status("moving");
        //   }
        //   return false;
        // }
      }
    }

    const sinks = creep.getEnergySinks();
    
    const storageRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_STORAGE) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      });
    
    const towers = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_TOWER) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 300
        );
      });
      
      let targets = [];
      
    if (towers.length && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      targets = towers;
    } else if (spawnRelated && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
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
        creep.moveTo(targets[0], { reusePath: 10 });
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

    // if (creep.room.name === 'W29N14') {
    //   const res = creep.room.find(FIND_DROPPED_RESOURCES);
    //   if (res.length) {
    //     res.forEach((r) => {
    //       if (creep.store.getFreeCapacity() > 0) {
    //         if (creep.pickup(r) == ERR_NOT_IN_RANGE) {
    //           creep.memory.target = undefined;
    //           creep.moveTo(r, { reusePath: 10 });
    //           creep.status("moving");
    //         }
    //       }
    //     });
    //     return false;
    //   }
    // }

    let selectedSource = false;
    if (creep.memory.target !== undefined && creep.memory.target !== 'none') {
      const targetObj = Game.getObjectById(creep.memory.target);
      if (targetObj && targetObj.store.getUsedCapacity() > 0) {
        selectedSource = targetObj;
      }
    }

    if (!selectedSource) {
      const tombstones = creep.room.find(FIND_TOMBSTONES);
      if (tombstones.length) {
        tombstones.forEach((tomb) => {
          if (tomb.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() > 0) {
            selectedSource = tomb;
          }
        });
      }
    } 
    
    if (!selectedSource) {
      const ruins = creep.room.find(FIND_RUINS);
      if (ruins.length) {
        ruins.forEach((tomb) => {
          if (tomb.store.getUsedCapacity() > 0 && creep.store.getFreeCapacity() > 0) {
            selectedSource = tomb;
          }
        });
      }
    }

    if (!selectedSource && creep.room.name === 'W28N13') {
      const factory = Game.getObjectById('662ba59f3139bc7b6167174b');
      if (factory && factory.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
        selectedSource = factory;
      }
    }

    let masterLink = null;

    if (creep.room.storage) {
      const links = creep.room.find(FIND_STRUCTURES, {
        filter: structure => (
          structure.structureType === STRUCTURE_LINK
        )
      });

      if (links.length) {
        links.forEach((link) => {
          const storagePos = creep.room.storage.pos;
          const distX = Math.abs(storagePos.x - link.pos.x);
          const distY = Math.abs(storagePos.y - link.pos.y);
          if (distX <= 2 && distY <= 2) {
            masterLink = link;
          }
        });
      }

      if (masterLink && masterLink.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        selectedSource = masterLink;
      }
    }

    const spawnRelated = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: obj => {
        return (obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN) &&
                obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }
    });

    if (!spawnRelated) {
      for (const flag in Game.flags) {
        if (flag.charAt(0) === '$') {
          const parts = flag.split(';');
          const roomName = parts[1];
          const action = parts[2];
          const resource = parts[3];

          if (roomName === creep.room.name) {
            if (action === 'D') {
              const atPos = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags[flag].pos).filter((structure) => {
                return structure.structureType === STRUCTURE_LAB
              });
              if (atPos.length && atPos[0].store.getUsedCapacity(resource) < 2000) {
                if (creep.room.storage.store.getUsedCapacity(resource) > 0) {
                  if (creep.withdraw(creep.room.storage, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { reusePath: 10 });
                    creep.status("moving");
                    return false;
                  }
                } else if (creep.room.terminal.store.getUsedCapacity(resource) > 0) {
                  if (creep.withdraw(creep.room.terminal, resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal, { reusePath: 10 });
                    creep.status("moving");
                    return false;
                  }
                }
              }
            } else if (action === 'R') {
              const atPos = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags[flag].pos).filter((structure) => {
                return structure.structureType === STRUCTURE_LAB
              });
              if (atPos.length && atPos[0].store.getUsedCapacity(resource) > 500) {
                if (creep.withdraw(atPos[0], resource) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(atPos[0], { reusePath: 10 });
                  creep.status("moving");
                  return false;
                }
              }
            }
          }
        }
      }

      // if (creep.room.name === 'W28N14') {
      //   if (creep.withdrawAnyExcept(creep.room.storage, [RESOURCE_ENERGY]) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(creep.room.storage, { reusePath: 10 });
      //     creep.status("moving");
      //   }
      //   return false;
      // }

      // if (creep.room.name === 'W28N13' && creep.room.terminal.store.getUsedCapacity(RESOURCE_BATTERY) > 0) {
      //   if (creep.withdraw(creep.room.terminal, RESOURCE_BATTERY) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(creep.room.terminal, { reusePath: 10 });
      //     creep.status("moving");
      //   }
      //   return false;
      // }

      // if (creep.room.name === 'W28N13' && creep.room.terminal.store.getUsedCapacity(RESOURCE_SILICON) > 0) {
      //   const factory = Game.getObjectById('662ba59f3139bc7b6167174b');
      //   if (factory) {
      //     if (creep.withdraw(creep.room.terminal, RESOURCE_SILICON) == ERR_NOT_IN_RANGE) {
      //       creep.moveTo(creep.room.terminal, { reusePath: 10 });
      //       creep.status("moving");
      //     }
      //   }
      //   return false;
      // }

      // const factory = Game.getObjectById('662ba59f3139bc7b6167174b');
      // if (factory && creep.room.name == 'W28N13') {
      //   if (creep.withdraw(factory, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(factory, { reusePath: 10 });
      //     creep.status("moving");
      //   }
      // }
    }

    if (!selectedSource && creep.room.storage && creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
      if (creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity()) {
        selectedSource = creep.room.storage;
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
          creep.moveTo(selectedSource, { reusePath: 10 });
          creep.status("moving");
        }
      } else {
        if (creep.withdrawAny(selectedSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(selectedSource, { reusePath: 10 });
          creep.status("moving");
        }
      }
      creep.target(selectedSource.id);
    }
  }
}
