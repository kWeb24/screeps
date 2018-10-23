/*jshint esversion: 6 */

console.log('>> Loading Role...');

/**
 * @class Role
 * @classdesc Role basic class
 * @abstract
 * @global
 */

export default class Role {

  constructor() {
    /**
    * @member {String} Role#ROLE
    * @desc Role name
    **/
    this.ROLE = 'universal';

    /**
    * @member {Integer} Role#POPULATION
    * @desc Target population of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
    * with gieven role per room
    **/
    this.POPULATION = 2;

    /**
    * @member {Integer} Role#GENOME
    * @desc Base {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
    * Genome that contains body parts
    **/
    this.GENOME = [WORK, CARRY, MOVE];

    /**
    * @member {Array} Role#CAPABLE_OF
    * @desc List of Roles that could be executed when given one has nothing to do
    **/
    this.CAPABLE_OF = [];

    /**
    * @member {Boolean} Role#ON_DEMAND
    * @desc Flag that indicates if {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
    * should be spawned only if there's demand of it's role work
    **/
    this.ON_DEMAND = true;

    /**
    * @member {Boolean} Role#USE_ENERGY_DEPOSITS
    * @desc Flag that indicates if {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
    * should withdraw energy from energy deposits
    **/
    this.USE_ENERGY_DEPOSITS = true;
  }

  /**
   * @memberof Role
   * @desc Run actual Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
	run(creep) {

	}

  /**
   * @memberof Role
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
   **/
	needsHelp(fromCreep) {
		return false;
	}

  /**
   * @memberof Role
   * @desc Check if given role should spawn new
   * {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @returns {Boolean}
   **/
  shouldSpawn() {
    if (this.countCreeps() < this.POPULATION) {
      return true;
    }

    return false;
  }

  /**
   * @memberof Role
   * @desc Filters {@link https://docs.screeps.com/api/#Creep|Screeps Creep} based on Role
   * @private
   * @returns {Array<Creep>} Array of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   **/
  getCreeps() {
    return _.filter(Game.creeps, (creep) => creep.memory.role == this.ROLE);
  }

  /**
   * @memberof Role
   * @desc Count current role {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @private
   * @returns {Integer} Current role {@link https://docs.screeps.com/api/#Creep|Screeps Creep} count
   **/
  countCreeps() {
    return this.getCreeps().length;
  }

  /**
   * @memberof Role
   * @desc Drop Road {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   * on {@link https://docs.screeps.com/api/#Creep|Screeps Creep} position
   * if not too many {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   * in queue
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   **/
  dropRoad(creep) {
    const CONSTRUCTION_SITES = CACHE.ROOMS[creep.room.name].getMyConstructionSites();

    if (CONSTRUCTION_SITES.length < 10) {
      const tileContent = creep.room.lookAt(creep.pos);

      if (tileContent.type != 'structure' && tileContent.type != 'constructionSite') {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
      }
    }
  }

  /**
   * @memberof Role
   * @desc Find primary (less occupied) source for gieven
   * {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * @public
   * @returns {string} ID of {@link https://docs.screeps.com/api/#Source|Screeps Source}
   **/
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

  /**
   * @memberof Role
   * @desc Finding best energy source for given {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @returns {Source} matched {@link https://docs.screeps.com/api/#Source|Screeps Source}
   **/
  selectSource(creep) {
    let sources = creep.getSources();
    const primarySource = _.filter(sources, (source) => source.id == creep.memory.primarySource);
    let selectedSource = primarySource[0];

    if (primarySource.energy < creep.carryCapacity || primarySource.ticksToRegeneration > 10) {
      selectedSource = creep.getClosestActiveSource();
    }

    return selectedSource;
  }

  /**
   * @memberof Role
   * @desc Finding best energy deposit for given {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @returns {Structure} matched {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   **/
  selectEnergyDeposit(creep) {
    const roomContainers = CACHE.ROOMS[creep.room.name].getContainers();
    const roomStorage = CACHE.ROOMS[creep.room.name].getMyStorage()[0];
    let shouldWait = false;

    if (roomStorage !== undefined) {
      if (roomStorage.isActive()) {
        shouldWait = roomStorage.id;
        if (roomStorage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
          return roomStorage;
        }
      }
    }

    if (roomContainers !== undefined) {
      const activeContainers = _.filter(roomContainers, (container) => {
        return container.isActive();
      });

      if (activeContainers.length) {
        shouldWait = activeContainers[0].id;
        const notEmptyContainers = _.filter(activeContainers, (container) => {
          return container.store[RESOURCE_ENERGY] >= creep.carryCapacity;
        });
        if (notEmptyContainers.length) {
          return notEmptyContainers[0];
        }
      }
    }

    return shouldWait;
  }

  /**
   * @memberof Role
   * @desc Harvest energy, support both harvesting and withdrawal for USE_ENERGY DEPOSITS ROLE
   * @private
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @todo refactor needed
   **/
	harvest(creep) {
    creep.status('harvesting');

    let selectedSource = this.selectEnergyDeposit(creep);
    if (selectedSource !== false && typeof selectedSource != 'string' && selectedSource !== undefined && this.USE_ENERGY_DEPOSITS) {

      if (creep.withdraw(selectedSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource);
        creep.status('moving');
      }
      creep.target(selectedSource.id);
    } else if (typeof selectedSource != 'string' || !this.USE_ENERGY_DEPOSITS) {
      selectedSource = this.selectSource(creep);

      if (creep.harvest(selectedSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(selectedSource);
        creep.status('moving');
      }
      creep.target(selectedSource.id);
    } else {
      const t = creep.getSources();

      if (creep.harvest(t[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(t[1]);
        creep.status('moving');
      }
      creep.target(t[1].id);
    }
	}
}
