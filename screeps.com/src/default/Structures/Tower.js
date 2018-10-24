/*jshint esversion: 6 */

console.log('>> Loading Tower Structure...');

export default class Tower {

  constructor() {

  }

	run(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (closestHostile) {
      tower.attack(closestHostile);
    } else {
      tower.repair(this.findClosestDamagedStructure(tower));
    }
	}

  findClosestDamagedStructure(tower) {
    var structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (building) => building.hits < building.hitsMax
    });

    return structure;
  }
}
