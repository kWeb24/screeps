/*jshint esversion: 6 */
import Role from "./Role.js";

/**
 * @class Harvester
 * @classdesc Harvester role class
 * @abstract
 * @augments Role
 */
export default class Harvester extends Role {
  constructor() {
    super();

    this.ROLE = "harvester";
    this.POPULATION = 5;
    this.GENOME = [WORK, CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 15;
    this.CAPABLE_OF = ["upgrader", "builder"];
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

    this.dropRoad(creep);
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep) {
    const sinks = creep.getEnergySinks();

    const spawnRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_EXTENSION ||
          sink.structureType == STRUCTURE_SPAWN) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    });

    const storageRelated = _.filter(sinks, sink => {
      return (
        (sink.structureType == STRUCTURE_CONTAINER ||
          sink.structureType == STRUCTURE_STORAGE) &&
        sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    });

    const haulersCount = _.filter(
      Game.creeps,
      creep2 => creep2.memory.role == 'hauler' && creep2.memory.room == creep.memory.room
    ).length;

    let targets = [];

    if (spawnRelated.length && (!haulersCount)) {
    // if (spawnRelated.length) {
      targets = spawnRelated;
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
    const sourcesCount = CACHE.ROOMS[room.name].getSources().length;

    const harvestersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'harvester' && creep.memory.room == room.name
    ).length;

    const dyingHarvestersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'harvester' && creep.memory.room == room.name && creep.ticksToLive < 100
    ).length;

    const maxPrice = room.energyAvailable;
    const possiblePrice = room.energyCapacityAvailable;

    return harvestersCount < sourcesCount || (dyingHarvestersCount && harvestersCount - 1 < sourcesCount);
  }
}
