/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Harvester
 * @classdesc Harvester role class
 * @abstract
 * @augments Role
 */
export default class RemoteHarvester extends Role {
  constructor() {
    super();

    this.ROLE = "remoteHarvester";
    this.POPULATION = 2;
    this.GENOME = [WORK, CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 15;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Harvester
   * @desc Run actual Harvester Role loop
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
  }

  harvest(creep) {
    creep.status("harvesting");

    const roomToHarvest = this.getRoomToHarvest(CACHE.ROOMS[creep.memory.room].ROOM);
    if (roomToHarvest) {
      const pos = new RoomPosition(roomToHarvest.value.sources[0].pos.x, roomToHarvest.value.sources[0].pos.y, roomToHarvest.name);
      if (creep.room.name !== roomToHarvest.name) {
        creep.moveTo(pos);
        creep.status("moving");
      } else if (creep.pos.x > 48 && creep.pos.x < 2 && creep.pos.y > 48 && creep.pos.y < 2) {
        creep.moveTo(pos);
        creep.status("moving");
      } else {
        let sources = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (sources) {
          if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources);
            creep.status("moving");
          }
          creep.target(sources.id);
        }
      }
    }
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const sinks = CACHE.ROOMS[creep.memory.room].getEnergySinks()

    const spawnRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_EXTENSION ||
          sink.structureType == STRUCTURE_SPAWN) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    });

    const storageRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_STORAGE) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    });

    let targets = [];

    if (storageRelated.length) {
      targets = storageRelated;
    } else if (spawnRelated.length) {
      targets = spawnRelated;
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

  /**
   * @memberof Harvester
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
    let targetRoom = this.getRoomToHarvest(room);

    if (targetRoom) {
      const harvestersCount = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'remoteHarvester' && creep.memory.room == room.name
      ).length;

      return harvestersCount < this.POPULATION;
    }

    return false;
  }

  getRoomToHarvest(room) {
    let targetRoom = false;
    if (room.memory.scouted) {
      for (const [key, value] of Object.entries(room.memory.scouted.exits)) {
        if (value !== null && value !== false) {
          const newRoom = Memory.rooms[value].scouted;
          if (newRoom.sources.length) {
            if (CACHE.ROOMS[value] !== undefined && !this.isMyRoom(value)) {
              targetRoom = { name: value, value: newRoom };
            } else if (CACHE.ROOMS[value] === undefined) {
              targetRoom = { name: value, value: newRoom };
            }
          }
        }
      }
    }
    return targetRoom;
  }

  isMyRoom(name) {
    let isMy = false;
    for (const room in Game.rooms) {
      if (name === room && Game.rooms[room].controller.my) {
        isMy = true;
      }
    }
    return isMy;
  }
}
