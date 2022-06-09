/*jshint esversion: 6 */

/**
 * @class RoomCache
 * @classdesc Room cache object
 * @global
 */

export default class RoomCache {
  constructor(room, id) {
    /**
     * @member {Object} RoomCache#ROOM
     * @desc {@link https://docs.screeps.com/api/#Room|Screeps Room} object reference
     **/
    this.ROOM = room;
    this.ID = id;
    /**
     * @member {Array<Source>} RoomCache#SOURCES
     * @desc Array of {@link https://docs.screeps.com/api/#Source|Screeps Source}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.SOURCES = undefined;

    /**
     * @member {Array<Source>} RoomCache#SOURCES_ACTIVE
     * @desc Array of {@link https://docs.screeps.com/api/#Source|Screeps Source}
     * objects that contains energy in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.SOURCES_ACTIVE = undefined;

    /**
     * @member {Array<Creep>} RoomCache#CREEPS
     * @desc Array of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.CREEPS = undefined;

    /**
     * @member {Array<Creep>} RoomCache#MY_CREEPS
     * @desc Array of player controlled {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_CREEPS = undefined;

    /**
     * @member {Array<Creep>} RoomCache#MY_CREEPS
     * @desc Array of hostile {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.HOSTILE_CREEPS = undefined;

    /**
     * @member {Array<Resource>} RoomCache#DROPPED_ENERGY
     * @desc Array of energy type {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
     * objects dropped on the groud in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.DROPPED_ENERGY = undefined;

    /**
     * @member {Array<Resource>} RoomCache#DROPPED_RESOURCES
     * @desc Array of all {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
     * objects dropped on the groud in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.DROPPED_RESOURCES = undefined;

    /**
     * @member {Array<Flag>} RoomCache#FLAGS
     * @desc Array of {@link https://docs.screeps.com/api/#Flag|Screeps Flags}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.FLAGS = undefined;

    /**
     * @member {Array<ConstructionSite>} RoomCache#CONSTRUCTION_SITES
     * @desc Array of all {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.CONSTRUCTION_SITES = undefined;

    /**
     * @member {Array<StructureSpawn>} RoomCache#MY_SPAWNS
     * @desc Array of player controlled {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_SPAWNS = undefined;

    /**
     * @member {Array<StructureSpawn>} RoomCache#HOSTILE_SPAWNS
     * @desc Array of hostile {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.HOSTILE_SPAWNS = undefined;

    /**
     * @member {Array<ConstructionSite>} RoomCache#MY_CONSTRUCTION_SITES
     * @desc Array of player controlled {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_CONSTRUCTION_SITES = undefined;

    /**
     * @member {Array<ConstructionSite>} RoomCache#HOSTILE_CONSTRUCTION_SITES
     * @desc Array of hostile {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.HOSTILE_CONSTRUCTION_SITES = undefined;

    /**
     * @member {Array<Mineral>} RoomCache#MINERALS
     * @desc Array of {@link https://docs.screeps.com/api/#Mineral|Screeps Mineral}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MINERALS = undefined;

    /**
     * @member {Array<StructureNuker>} RoomCache#NUKES
     * @desc Array of {@link https://docs.screeps.com/api/#StructureNuker|Screeps StructureNuker}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.NUKES = undefined;

    /**
     * @member {Array<Tombstone>} RoomCache#TOMBSTONES
     * @desc Array of {@link https://docs.screeps.com/api/#Tombstone|Screeps Tombstone}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.TOMBSTONES = undefined;

    /**
     * @member {Array<Tombstone>} RoomCache#STRUCTURES
     * @desc Array of all {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.STRUCTURES = undefined;

    /**
     * @member {Array<Tombstone>} RoomCache#MY_STRUCTURES
     * @desc Array of player controlled {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_STRUCTURES = undefined;

    /**
     * @member {Array<Tombstone>} RoomCache#HOSTILE_STRUCTURES
     * @desc Array of hostile {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.HOSTILE_STRUCTURES = undefined;

    /**
     * @member {Array<Tombstone>} RoomCache#ENERGY_SINKS
     * @desc Array of {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     * that are Structure with one of given types: STRUCTURE_SPAWN, STRUCTURE_EXTENSION,
     * STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_TOWER
     **/
    this.ENERGY_SINKS = undefined;

    /**
     * @member {Array<StructureContainer>} RoomCache#CONTAINERS
     * @desc Array of {@link https://docs.screeps.com/api/#StructureContainer|Screeps StructureContainer}
     * objects in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.CONTAINERS = undefined;

    /**
     * @member {Array<StructureStorage>} RoomCache#MY_STORAGE
     * @desc {@link https://docs.screeps.com/api/#StructureStorage|Screeps StructureStorage}
     * object in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_STORAGE = undefined;

    /**
     * @member {Array<StructureTower>} RoomCache#MY_TOWERS
     * @desc {@link https://docs.screeps.com/api/#StructureTower|Screeps StructureTower}
     * object in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    this.MY_TOWERS = undefined;

    this.BASE_POSSIBLE_POSITIONS = {};
    this.BASE_POSSIBLE_POLY = {};
    this.MY_EXTRACTORS = undefined;
    this.MY_LABS = undefined;
    this.MY_TERMINALS = undefined;
    this.MY_FACTORIES = undefined;

    // Not implemented yet
    this.KEEPERLIARS = undefined;
    this.PORTALS = undefined;
    this.POWERBANKS = undefined;

    this.MY_EXTENSIONS = undefined;
    this.MY_CONTROLLER = undefined;
    this.MY_LINKS = undefined;
    this.MY_NUKERS = undefined;
    this.MY_OBSERVERS = undefined;
    this.MY_POWERSPAWNS = undefined;
    this.MY_RAMPARTS = undefined;
    this.MY_WALLS = undefined;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Source|Screeps Source}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Source>} Array of {@link https://docs.screeps.com/api/#Source|Screeps Source}
   **/
  getSources() {
    // if (this.SOURCES === undefined) {
      this.SOURCES = this.ROOM.find(FIND_SOURCES);
    // }

    return this.SOURCES;
  }

  /**
   * @memberof RoomCache
   * @desc Find active {@link https://docs.screeps.com/api/#Source|Screeps Source}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Source>} Array of {@link https://docs.screeps.com/api/#Source|Screeps Source}
   **/
  getActiveSources() {
    // if (this.SOURCES_ACTIVE === undefined) {
      this.SOURCES_ACTIVE = this.ROOM.find(FIND_SOURCES_ACTIVE);
    // }

    return this.SOURCES_ACTIVE;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Creep>} Array of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   **/
  getCreeps() {
    // if (this.CREEPS === undefined) {
      this.CREEPS = this.ROOM.find(FIND_CREEPS);
    // }

    return this.CREEPS;
  }

  /**
   * @memberof RoomCache
   * @desc Find player controlled {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Creep>} Array of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   **/
  getMyCreeps() {
    // if (this.MY_CREEPS === undefined) {
      this.MY_CREEPS = this.ROOM.find(FIND_MY_CREEPS);
    // }

    return this.MY_CREEPS;
  }

  /**
   * @memberof RoomCache
   * @desc Find hostile {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Creep>} Array of {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   **/
  getHostileCreeps() {
    // if (this.HOSTILE_CREEPS === undefined) {
    this.HOSTILE_CREEPS = this.ROOM.find(FIND_HOSTILE_CREEPS);
    // }

    return this.HOSTILE_CREEPS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all ENERGY type {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
   * dropped on the ground in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Resource>} Array of {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
   **/
  getDroppedEnergy() {
    // if (this.DROPPED_ENERGY === undefined) {
    this.DROPPED_ENERGY = this.ROOM.find(FIND_DROPPED_ENERGY);
    // }

    return this.DROPPED_ENERGY;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
   * dropped on the ground in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Resource>} Array of {@link https://docs.screeps.com/api/#Resource|Screeps Resource}
   **/
  getDroppedResources() {
    // if (this.DROPPED_RESOURCES === undefined) {
    this.DROPPED_RESOURCES = this.ROOM.find(FIND_DROPPED_RESOURCES);
    // }

    return this.DROPPED_RESOURCES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Flag|Screeps Flag}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Flag>} Array of {@link https://docs.screeps.com/api/#Flag|Screeps Flag}
   **/
  getFlags() {
    if (this.FLAGS === undefined) {
      this.FLAGS = this.ROOM.find(FIND_FLAGS);
    }

    return this.FLAGS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<ConstructionSite>} Array of {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   **/
  getConstructionSites() {
    // if (this.CONSTRUCTION_SITES === undefined) {
      this.CONSTRUCTION_SITES = this.ROOM.find(FIND_CONSTRUCTION_SITES);
    // }

    return this.CONSTRUCTION_SITES;
  }

  /**
   * @memberof RoomCache
   * @desc Find player controlled {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<ConstructionSite>} Array of {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   **/
  getMyConstructionSites() {
    // if (this.MY_CONSTRUCTION_SITES === undefined) {
      this.MY_CONSTRUCTION_SITES = this.ROOM.find(FIND_MY_CONSTRUCTION_SITES);
    // }

    return this.MY_CONSTRUCTION_SITES;
  }

  /**
   * @memberof RoomCache
   * @desc Find hostile {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<ConstructionSite>} Array of {@link https://docs.screeps.com/api/#ConstructionSite|Screeps ConstructionSite}
   **/
  getHostileConstructionSites() {
    if (this.HOSTILE_CONSTRUCTION_SITES === undefined) {
      this.HOSTILE_CONSTRUCTION_SITES = this.ROOM.find(
        FIND_HOSTILE_CONSTRUCTION_SITES
      );
    }

    return this.HOSTILE_CONSTRUCTION_SITES;
  }

  /**
   * @memberof RoomCache
   * @desc Find player controlled {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<StructureSpawn>} Array of {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
   **/
  getMySpawns() {
    // if (this.MY_SPAWNS === undefined) {
      this.MY_SPAWNS = this.ROOM.find(FIND_MY_SPAWNS);
    // }

    return this.MY_SPAWNS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all hostile {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<StructureSpawn>} Array of {@link https://docs.screeps.com/api/#StructureSpawn|Screeps StructureSpawn}
   **/
  getHostileSpawns() {
    if (this.HOSTILE_SPAWNS === undefined) {
      this.HOSTILE_SPAWNS = this.ROOM.find(FIND_HOSTILE_SPAWNS);
    }

    return this.HOSTILE_SPAWNS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all  {@link https://docs.screeps.com/api/#Mineral|Screeps Mineral}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Mineral>} Array of {@link https://docs.screeps.com/api/#Mineral|Screeps Mineral}
   **/
  getMinerals() {
    // if (this.MINERALS === undefined) {
      this.MINERALS = this.ROOM.find(FIND_MINERALS);
    // }

    return this.MINERALS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#StructureNuker|Screeps StructureNuker}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<StructureNuker>} Array of {@link https://docs.screeps.com/api/#StructureNuker|Screeps StructureNuker}
   **/
  getNukes() {
    if (this.NUKES === undefined) {
      this.NUKES = this.ROOM.find(FIND_NUKES);
    }

    return this.NUKES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Tombstone|Screeps Tombstone}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Tombstone>} Array of {@link https://docs.screeps.com/api/#Tombstone|Screeps Tombstone}
   **/
  getTombstones() {
    // if (this.TOMBSTONES === undefined) {
    this.TOMBSTONES = this.ROOM.find(FIND_TOMBSTONES);
    // }

    return this.TOMBSTONES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Structure>} Array of {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   **/
  getStructures() {
    // if (this.STRUCTURES === undefined) {
      this.STRUCTURES = this.ROOM.find(FIND_STRUCTURES);
    // }

    return this.STRUCTURES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all player controlled {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Structure>} Array of {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   **/
  getMyStructures() {
    // if (this.MY_STRUCTURES === undefined) {
      this.MY_STRUCTURES = this.ROOM.find(FIND_MY_STRUCTURES);
    // }

    return this.MY_STRUCTURES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all hostile {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * and cache if not cached
   * @public
   * @returns {Array<Structure>} Array of {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   **/
  getHostileStructures() {
    if (this.HOSTILE_STRUCTURES === undefined) {
      this.HOSTILE_STRUCTURES = this.ROOM.find(FIND_HOSTILE_STRUCTURES);
    }

    return this.HOSTILE_STRUCTURES;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * that are one of the given types: STRUCTURE_SPAWN, STRUCTURE_EXTENSION,
   * STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_TOWER and cache if not cached
   * @public
   * @returns {Array<Structure>} Array of {@link https://docs.screeps.com/api/#Structure|Screeps Structure}
   **/
  getEnergySinks() {
    // if (this.ENERGY_SINKS === undefined) {
    this.ENERGY_SINKS = this.ROOM.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER ||
          structure.structureType == STRUCTURE_TOWER
        );
      }
    });
    // }

    return this.ENERGY_SINKS;
  }

  /**
   * @memberof RoomCache
   * @desc Find all {@link https://docs.screeps.com/api/#StructureContainer|Screeps StructureContainer}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * @public
   * @returns {Array<StructureContainer>} Array of {@link https://docs.screeps.com/api/#StructureContainer|Screeps StructureContainer}
   **/
  getContainers() {
    // if (this.CONTAINERS === undefined) {
      const structures = this.getStructures();
      this.CONTAINERS = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_CONTAINER
      );
    // }

    return this.CONTAINERS;
  }

  /**
   * @memberof RoomCache
   * @desc Find {@link https://docs.screeps.com/api/#StructureStorage|Screeps StructureStorage}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * @public
   * @returns {Array<StructureStorage>} object of {@link https://docs.screeps.com/api/#StructureStorage|Screeps StructureStorage} type
   **/
  getMyStorage() {
    // if (this.MY_STORAGE === undefined) {
      const structures = this.getStructures();
      this.MY_STORAGE = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_STORAGE
      );
    // }

    return this.MY_STORAGE;
  }

  getMyExtractors() {
    // if (this.MY_EXTRACTORS === undefined) {
      const structures = this.getStructures();
      this.MY_EXTRACTORS = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_EXTRACTOR
      );
    // }

    return this.MY_EXTRACTORS;
  }

  getMyLabs() {
    // if (this.MY_LABS === undefined) {
      const structures = this.getStructures();
      this.MY_LABS = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_LAB
      );
    // }

    return this.MY_LABS;
  }

  getMyTerminals() {
    // if (this.MY_LABS === undefined) {
      const structures = this.getStructures();
      this.MY_TERMINALS = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_TERMINAL
      );
    // }

    return this.MY_LABS;
  }

  getMyFactories() {
    // if (this.MY_LABS === undefined) {
      const structures = this.getStructures();
      this.MY_FACTORIES = _.filter(
        structures,
        structure => structure.structureType == STRUCTURE_FACTORY
      );
    // }

    return this.MY_LABS;
  }

  /**
   * @memberof RoomCache
   * @desc Find {@link https://docs.screeps.com/api/#StructureStorage|Screeps StructureStorage}
   * in current {@link https://docs.screeps.com/api/#Room|Screeps Room}
   * @public
   * @returns {Array<StructureTower>} object of {@link https://docs.screeps.com/api/#StructureTower|Screeps StructureTower} type
   **/
  getMyTowers() {
    // if (this.MY_TOWERS === undefined) {
    const structures = this.getStructures();
    this.MY_TOWERS = _.filter(
      structures,
      structure => structure.structureType == STRUCTURE_TOWER
    );
    // }

    return this.MY_TOWERS;
  }

  getBasePossiblePositions(name, layout) {
    if (this.BASE_POSSIBLE_POSITIONS[name] === undefined) {
      const base = layout;
      this.BASE_POSSIBLE_POSITIONS[name] = [];
      const positions = [];

      for (let x = 0; x < 50 - base.core.size.x; x++) {
        for (let y = 0; y < 50 - base.core.size.y; y++) {
          const area = this.ROOM.lookAtArea(y, x, y + base.core.size.y, x + base.core.size.x, true);
          let hasObstacles = false;
          area.forEach((tile) => {
            if (tile.type === 'structure' && tile[tile.type].structureType !== 'road') {
              hasObstacles = true;
            } else if (tile[tile.type] === 'wall') {
              hasObstacles = true;
            }
          });

          if (!hasObstacles) {
            const distToController = PathFinder.search(
              this.ROOM.getPositionAt(x + Math.ceil(base.core.size.x / 2), Math.ceil(base.core.size.y/2)),
              {
                pos: this.ROOM.controller.pos,
                range: 1
              },
              {
                plainCost: 1,
                swampCost: 1,
              }
            ).path.length;

            let sourcesSum = 0;
            this.getSources().forEach((src) => {
              sourcesSum += PathFinder.search(
                this.ROOM.getPositionAt(x + Math.ceil(base.core.size.x / 2), Math.ceil(base.core.size.y/2)),
                {
                  pos: src.pos,
                  range: 1
                },
                {
                  plainCost: 1,
                  swampCost: 1,
                }
              ).path.length;
            })

            positions.push({
              x,
              y,
              x2: base.core.size.x,
              y2: base.core.size.y,
              totalPathsRequired: distToController
            });

            y += Math.ceil(base.core.size.y / 2);
          }
        }
      }

      let lowest = positions[0];
      positions.forEach((pos) => {
        if (pos.totalPathsRequired < lowest.totalPathsRequired) {
          lowest = pos;
        }
      });

      this.BASE_POSSIBLE_POSITIONS[name].push(lowest);
      // this.BASE_POSSIBLE_POSITIONS[name] = positions;
    }

    return this.BASE_POSSIBLE_POSITIONS[name];
  }
}
