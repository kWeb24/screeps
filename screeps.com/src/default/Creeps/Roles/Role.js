/*jshint esversion: 6 */

console.log('>> Loading Role...');

export default class Role {

  constructor() {
    this.ROLE = 'universal';
    this.POPULATION = 2;
    this.GENOME = [WORK, CARRY, MOVE];
    this.CAPABLE_OF = [];
    this.ON_DEMAND = true;
  }

	/** @param {Creep} creep **/
	run(creep) {

	}

  /** @param {Creep} fromCreep **/
	needsHelp(fromCreep) {
		return false;
	}

  shouldSpawn() {
    if (this.countCreeps < this.POPULATION) {
      return true;
    }

    return false;
  }

  getCreeps() {
    return _.filter(Game.creeps, (creep) => this.ROLE);
  }

  countCreeps() {
    return getCreeps().length;
  }
}
