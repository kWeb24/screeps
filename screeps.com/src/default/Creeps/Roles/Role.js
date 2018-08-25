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
    if (this.countCreeps() < this.POPULATION) {
      return true;
    }

    return false;
  }

  getCreeps() {
    return _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE);
  }

  countCreeps() {
    return this.getCreeps().length;
  }

  /** @param {Creep} fromCreep **/
  dropRoad(creep) {
    const CONSTRUCTION_SITES = CACHE.ROOMS[creep.room.name].getMyConstructionSites();

    if (CONSTRUCTION_SITES.length < 10) {
      const tileContent = creep.room.lookAt(creep.pos);

      if (tileContent.type != 'structure' && tileContent.type != 'constructionSite') {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
      }
    }
  }

  /** @param {Room} room **/
  getPrimarySource(room) {
    const SOURCES = CACHE.ROOMS[room.name].getSources();
    let creepsInSource = [];

    for (const SOURCE in SOURCES) {
      const CREEP_COUNT = _.filter(Game.creeps, (creep) => creep.memory.primarySource == SOURCES[SOURCE].id);
      creepsInSource.push(CREEP_COUNT.length);
    }

    let lastSourceVal;
    let bestSourceIndex;
    creepsInSource.forEach((val, i) => {
      if (lastSourceVal === undefined || val < lastSourceVal) {
        lastSourceVal = val;
        bestSourceIndex = i;
      }
    });

    return SOURCES[bestSourceIndex].id;
  }
}
