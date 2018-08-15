/*jshint esversion: 6 */

class Tower {

  constructor() {
  }

	run() {
    for (var structure in Game.structures) {
      if (structure.structureType == STRUCTURE_TOWER) {
        var tower = structure;

        if (this.findClosestDamagedStructure(tower)) {
          tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
          tower.attack(closestHostile);
        }
      }
    }
	}

  findClosestDamagedStructure(tower) {
    var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (building) => building.hits < building.hitsMax
    });

    return structure;
  }
}

module.exports = Tower;
