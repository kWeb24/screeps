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
    this.POPULATION = 4;
    // this.GENOME = [WORK, CARRY, MOVE, WORK, WORK, WORK, WORK, WORK];
    // this.MAX_GENOME_LENGTH = 9;
    this.GENOME = [WORK, CARRY, MOVE];
    this.OPTIMAL_GENOME = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
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
    const areaLink = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y - 1, creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1, true);
    const links = [];
    areaLink.forEach((structure) => {
      if (structure.structure.structureType == STRUCTURE_LINK) {
        links.push(structure);
      }
    });

    const atMyPos = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
    const containerAtMyPos = _.filter(atMyPos, structure => {
      return (
        structure.structureType == STRUCTURE_CONTAINER
      )
    });

    if (links.length && containerAtMyPos.length) {
      if (
        links[0].structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 0 &&
        containerAtMyPos[0].store.getUsedCapacity(RESOURCE_ENERGY) >= 0
      ) {
        creep.withdraw(containerAtMyPos[0], RESOURCE_ENERGY);
      }
    }

    if (
      (creep.status() != "harvesting" && creep.store.getUsedCapacity() === 0) ||
      (creep.status() == "harvesting" && creep.store.getFreeCapacity() > 0)
    ) {
      this.harvest(creep);
    }

    // if standing on container drop
    if (
      (creep.status() != "transfering" && creep.store.getFreeCapacity() === 0) ||
      (creep.status() == "transfering" && creep.store.getUsedCapacity() > 0) ||
      (creep.status() == "moving" && creep.store.getUsedCapacity() > 0)
    ) {
      this.transfer(creep, links, containerAtMyPos);
    }

    // this.dropRoad(creep);
  }

  harvest(creep) {
    const t = Game.getObjectById(creep.memory.primarySource);
    if (creep.harvest(t) == ERR_NOT_IN_RANGE) {
      creep.moveTo(t);
      creep.status("moving");
    }
    creep.target(t.id);
    creep.status("harvesting");
  }

  /**
   * @memberof Harvester
   * @desc Transfering energy to given container
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
  transfer(creep, links, containerAtMyPos) {
    if (!containerAtMyPos.length) {
      const primarySource = Game.getObjectById(creep.memory.primarySource);
      const area = creep.room.lookForAtArea(LOOK_STRUCTURES, primarySource.pos.y - 2, primarySource.pos.x - 2, primarySource.pos.y + 2, primarySource.pos.x + 2, true);
      const containers = [];
      area.forEach((structure) => {
        if (structure.structure.structureType == STRUCTURE_CONTAINER) {
          containers.push(structure);
        }
      });
      if (containers.length) {
        creep.moveTo(containers[0].structure.pos);
        return false;
      }
    }

    if (links.length) {
      const t = Game.cpu.getUsed();
      
      if (links[0].structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 0) {
        const r = creep.transfer(links[0].structure, RESOURCE_ENERGY);
        if (r !== ERR_FULL) {
          return false;
        }
      }
    }

    if (containerAtMyPos.length) {
      if (containerAtMyPos[0].store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
        creep.drop(RESOURCE_ENERGY);
        return false;
      }
    }

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

    // let extensions = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    //   filter: obj => {
    //     return (
    //       obj.structureType == STRUCTURE_EXTENSION
    //     );
    //   }
    // });

    if (targets.length > 0) {
      creep.target(targets[0].id);
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
        creep.status("moving");
      }
    // } else if (extensions !== null) {
    //   if (creep.build(extensions) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(extensions);
    //     creep.status("moving");
    //     creep.target(extensions.id);
    //   }
    } else {
      creep.target(creep.room.controller.name);

      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
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
    const sourcesCount = Memory.rooms[room.name].sources.length;

    const harvestersCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'harvester' && creep.memory.room == room.name && creep.ticksToLive > 80
    ).length;

    return harvestersCount < sourcesCount;
  }

  getOptimalGenome(room) {
    if (!room.storage) return false;
    return this.OPTIMAL_GENOME;
  }
}
