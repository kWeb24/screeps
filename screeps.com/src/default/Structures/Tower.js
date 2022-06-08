/*jshint esversion: 6 */

export default class Tower {
  constructor() {}

  run(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (closestHostile) {
      tower.attack(closestHostile);
    } else {
      if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > tower.store.getCapacity(RESOURCE_ENERGY) / 2) {
        // tower.repair(this.findClosestDamagedStructureNotRoad(tower));
      } else {
        // tower.repair(this.findClosestDamagedStructure(tower));
      }
    }
  }

  findClosestDamagedStructure(tower) {
    var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: building => building.hits < building.hitsMax
    });

    return structure;
  }

  findClosestDamagedStructureNotRoad(tower) {
    var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: building =>
        building.hits < building.hitsMax &&
        building.structureType != STRUCTURE_ROAD
    });

    return structure;
  }
}
