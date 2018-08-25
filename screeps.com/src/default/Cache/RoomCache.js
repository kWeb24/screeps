/*jshint esversion: 6 */

console.log('>> Loading Room Cache module...');

export default class RoomCache {

  constructor(room) {
    this.ROOM = room;
    this.SOURCES = undefined;
    this.SOURCES_ACTIVE = undefined;
    this.EXIT_TOP = undefined;
    this.EXIT_RIGHT = undefined;
    this.EXIT_BOTTOM = undefined;
    this.EXIT_LEFT = undefined;
    this.EXIT = undefined;
    this.CREEPS = undefined;
    this.MY_CREEPS = undefined;
    this.HOSTILE_CREEPS = undefined;
    this.DROPPED_ENERGY = undefined;
    this.DROPPED_RESOURCES = undefined;
    this.FLAGS = undefined;
    this.CONSTRUCTION_SITES = undefined;
    this.MY_SPAWNS = undefined;
    this.HOSTILE_SPAWNS = undefined;
    this.MY_CONSTRUCTION_SITES = undefined;
    this.HOSTILE_CONSTRUCTION_SITES = undefined;
    this.MINERALS = undefined;
    this.NUKES = undefined;
    this.TOMBSTONES = undefined;

    this.STRUCTURES = undefined;
    this.MY_STRUCTURES = undefined;
    this.HOSTILE_STRUCTURES = undefined;

    this.ENERGY_SINKS = undefined;

    // Not implemented yet
    this.KEEPERLIARS = undefined;
    this.PORTALS = undefined;
    this.POWERBANKS = undefined;

    this.MY_EXTENSIONS = undefined;
    this.MY_CONTAINERS = undefined;
    this.MY_CONTROLLER = undefined;
    this.MY_EXTRACTOR = undefined;
    this.MY_LINKS = undefined;
    this.MY_NUKERS = undefined;
    this.MY_OVSERVERS = undefined;
    this.MY_POWERSPAWNS = undefined;
    this.MY_RAMPARTS = undefined;
    this.MY_STORAGES = undefined;
    this.MY_TERMINALS = undefined;
    this.MY_TOWERS = undefined;
    this.MY_WALLS = undefined;
  }

  getSources() {
    if (this.SOURCES === undefined) {
      this.SOURCES = this.ROOM.find(FIND_SOURCES);
    }

    return this.SOURCES;
  }

  getActiveSources() {
    if (this.SOURCES_ACTIVE === undefined) {
      this.SOURCES_ACTIVE = this.ROOM.find(FIND_SOURCES_ACTIVE);
    }

    return this.SOURCES_ACTIVE;
  }

  getExitTop() {
    if (this.EXIT_TOP === undefined) {
      this.EXIT_TOP = this.ROOM.find(FIND_EXIT_TOP);
    }

    return this.EXIT_TOP;
  }

  getExitRight() {
    if (this.EXIT_RIGHT === undefined) {
      this.EXIT_RIGHT = this.ROOM.find(FIND_EXIT_RIGHT);
    }

    return this.EXIT_RIGHT;
  }

  getExitBottom() {
    if (this.EXIT_BOTTOM === undefined) {
      this.EXIT_BOTTOM = this.ROOM.find(FIND_EXIT_BOTTOM);
    }

    return this.EXIT_BOTTOM;
  }

  getExitLeft() {
    if (this.EXIT_LEFT === undefined) {
      this.EXIT_LEFT = this.ROOM.find(FIND_EXIT_LEFT);
    }

    return this.EXIT_LEFT;
  }

  getExit() {
    if (this.EXIT === undefined) {
      this.EXIT = this.ROOM.find(FIND_EXIT);
    }

    return this.EXIT;
  }

  getCreeps() {
    if (this.CREEPS === undefined) {
      this.CREEPS = this.ROOM.find(FIND_CREEPS);
    }

    return this.CREEPS;
  }

  getMyCreeps() {
    if (this.MY_CREEPS === undefined) {
      this.MY_CREEPS = this.ROOM.find(FIND_MY_CREEPS);
    }

    return this.MY_CREEPS;
  }

  getHostileCreeps() {
    if (this.HOSTILE_CREEPS === undefined) {
      this.HOSTILE_CREEPS = this.ROOM.find(FIND_HOSTILE_CREEPS);
    }

    return this.HOSTILE_CREEPS;
  }

  getDroppedEnergy() {
    if (this.DROPPED_ENERGY === undefined) {
      this.DROPPED_ENERGY = this.ROOM.find(FIND_DROPPED_ENERGY);
    }

    return this.DROPPED_ENERGY;
  }

  getDroppedResources() {
    if (this.DROPPED_RESOURCES === undefined) {
      this.DROPPED_RESOURCES = this.ROOM.find(FIND_DROPPED_RESOURCES);
    }

    return this.DROPPED_RESOURCES;
  }

  getFlags() {
    if (this.FLAGS === undefined) {
      this.FLAGS = this.ROOM.find(FIND_FLAGS);
    }

    return this.FLAGS;
  }

  getConstructionSites() {
    if (this.CONSTRUCTION_SITES === undefined) {
      this.CONSTRUCTION_SITES = this.ROOM.find(FIND_CONSTRUCTION_SITES);
    }

    return this.CONSTRUCTION_SITES;
  }

  getMyConstructionSites() {
    if (this.MY_CONSTRUCTION_SITES === undefined) {
      this.MY_CONSTRUCTION_SITES = this.ROOM.find(FIND_MY_CONSTRUCTION_SITES);
    }

    return this.MY_CONSTRUCTION_SITES;
  }

  getHostileConstructionSites() {
    if (this.HOSTILE_CONSTRUCTION_SITES === undefined) {
      this.HOSTILE_CONSTRUCTION_SITES = this.ROOM.find(FIND_HOSTILE_CONSTRUCTION_SITES);
    }

    return this.HOSTILE_CONSTRUCTION_SITES;
  }

  getMySpawns() {
    if (this.MY_SPAWNS === undefined) {
      this.MY_SPAWNS = this.ROOM.find(FIND_MY_SPAWNS);
    }

    return this.MY_SPAWNS;
  }

  getHostileSpawns() {
    if (this.HOSTILE_SPAWNS === undefined) {
      this.HOSTILE_SPAWNS = this.ROOM.find(FIND_HOSTILE_SPAWNS);
    }

    return this.HOSTILE_SPAWNS;
  }

  getMinerals() {
    if (this.MINERALS === undefined) {
      this.MINERALS = this.ROOM.find(FIND_MINERALS);
    }

    return this.MINERALS;
  }

  getNukes() {
    if (this.NUKES === undefined) {
      this.NUKES = this.ROOM.find(FIND_NUKES);
    }

    return this.NUKES;
  }

  getTombstones() {
    if (this.TOMBSTONES === undefined) {
      this.TOMBSTONES = this.ROOM.find(FIND_TOMBSTONES);
    }

    return this.TOMBSTONES;
  }

  getStructures() {
    if (this.STRUCTURES === undefined) {
      this.STRUCTURES = this.ROOM.find(FIND_STRUCTURES);
    }

    return this.STRUCTURES;
  }

  getMyStructures() {
    if (this.MY_STRUCTURES === undefined) {
      this.MY_STRUCTURES = this.ROOM.find(FIND_MY_STRUCTURES);
    }

    return this.MY_STRUCTURES;
  }

  getHostileStructures() {
    if (this.HOSTILE_STRUCTURES === undefined) {
      this.HOSTILE_STRUCTURES = this.ROOM.find(FIND_HOSTILE_STRUCTURES);
    }

    return this.HOSTILE_STRUCTURES;
  }

  getEnergySinks() {
    if (this.ENERGY_SINKS === undefined) {
      this.ENERGY_SINKS = this.ROOM.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
          }
      });
    }

    return this.ENERGY_SINKS;
  }
}
