/*jshint esversion: 6 */

export default class Harvester {

  constructor() {

    console.log('-- Loading Harvester Role...');
  }

  /** @param {Creep} creep **/
  run(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      const sources = creep.room.find(FIND_SOURCES);

      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    } else {
      const targets = this.findTargets(creep);

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0eb05d'}});
        }
      } else {
        creep.moveTo(Game.flags['HarvestersGather'], {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
  }

  findTargets(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) &&
                  structure.energy < structure.energyCapacity;
        }
    });
  }

  needsHelp(fromCreep) {
    const targets = this.findTargets(fromCreep);
    return targets.length > 0;
  }
}
