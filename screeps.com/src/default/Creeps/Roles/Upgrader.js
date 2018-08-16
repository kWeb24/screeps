/*jshint esversion: 6 */

export default class Upgrader {

  constructor() {

    console.log('-- Loading Upgrader Role...');
  }

  /** @param {Creep} creep **/
  run(creep) {
    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('harvesting');
    }

    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrading');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#0e9db0'}});
      }
    }
  }

  needsHelp(fromCreep) {
    return fromCreep.carry.energy == fromCreep.carryCapacity;
  }
}