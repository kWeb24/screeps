/*jshint esversion: 6 */

import Role from "./Role.js";

/**
 * @class Builder
 * @classdesc Builder role class
 * @abstract
 * @augments Role
 */
export default class Builder extends Role {
  constructor() {
    super();

    this.ROLE = "builder";
    this.POPULATION = 1;
    this.GENOME = [WORK, CARRY, MOVE];
    this.MAX_GENOME_LENGTH = 6;
    this.CAPABLE_OF = ["upgrader"];
    this.ON_DEMAND = true;
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Builder
   * @desc Run actual Builder Role loop
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
      (creep.status() != "building" && creep.store.getFreeCapacity() === 0) ||
      (creep.status() == "building" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "bored" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    ) {
      this.build(creep);
    }
  }

  /**
   * @memberof Builder
   * @desc Build {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * @private
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  build(creep) {
    let targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
      filter: obj => {
        return (
          obj.structureType == STRUCTURE_EXTENSION ||
          obj.structureType == STRUCTURE_TOWER ||
          obj.structureType == STRUCTURE_CONTAINER
        );
      }
    });

    let sites = null;
    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined && CACHE.ROOMS[room].ROOM.controller.my) {
        const found = CACHE.ROOMS[room].ROOM.controller.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
          filter: obj => {
            return (
              obj.structureType == STRUCTURE_SPAWN
            );
          }
        });
        if (found) sites = found;
      }
    }

    if (sites) {
      targets = sites;
    }

    if (!targets) {
      targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }

    if (!targets) {
      for (const room in Game.rooms) {
        if (CACHE.ROOMS[room] !== undefined && CACHE.ROOMS[room].ROOM.controller.my) {
          const found = CACHE.ROOMS[room].ROOM.controller.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
          if (found) sites = found;
        }
      }

      targets = sites;
    }

    creep.status("building");

    if (targets) {
      if (creep.build(targets) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets);
        creep.status("moving");
        creep.target(targets.id);
      }
    } else {
      const wallToBuild = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure =>
          structure.structureType == STRUCTURE_WALL &&
          (
            structure.hits < structure.hitsMax &&
            creep.room.storage !== undefined &&
            creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 50000
          ) || structure.hits < 100000
      });

      if (wallToBuild) {
        if (creep.repair(wallToBuild) == ERR_NOT_IN_RANGE) {
          creep.moveTo(wallToBuild);
          creep.status("moving");
        }
      } else {
        // const [spawn] = CACHE.ROOMS[creep.room.name].getMySpawns();
        // const pos = CACHE.ROOMS[creep.room.name].ROOM.getPositionAt(
        //   spawn.pos.x - 4,
        //   spawn.pos.y - 5
        // );
        creep.moveTo(CACHE.ROOMS[creep.room.name].ROOM.controller.pos);
        creep.status("bored");
        // creep.target("BuildersGatherPoint");
      }
    }
  }

  /**
   * @memberof Builder
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
   * @override
   * @see Role
   **/
  needsHelp(fromCreep) {
    var targets = fromCreep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length;
  }

  shouldSpawn(room) {
    let sitesCount = 0;

    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined && CACHE.ROOMS[room].ROOM.controller.my) {
        sitesCount += CACHE.ROOMS[room].getConstructionSites().length;
      }
    }

    const buildersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'builder' && creep.memory.room == room.name
    ).length;

    if (sitesCount > 5) {
      return buildersCount < 2 && sitesCount;
    }

    return !buildersCount && sitesCount;
  }
}
