/*jshint esversion: 6 */

import Role from './Role.js';

/**
 * @class Scout
 * @classdesc Scout role class
 * @abstract
 * @augments Scout
 */
export default class Scout extends Role {

  constructor() {
    super();

		this.ROLE = 'scout';
    this.POPULATION = 1;
    this.GENOME = [MOVE];
    this.MAX_GENOME_LENGTH = 4;
    this.CAPABLE_OF = [];
    this.ON_DEMAND = false;
    this.USE_ENERGY_DEPOSITS = false;
  }

  /**
   * @memberof Scout
   * @desc Run actual Scout Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
    if (!creep.room.memory.scouted) {
      const sources = creep.room.find(FIND_SOURCES);
      const minerals = creep.room.find(FIND_MINERALS);
      let sourcesArr = [];
      sources.forEach((source) => {
        sourcesArr.push({ pos: { x: source.pos.x, y: source.pos.y } });
      });
      let mineralsArr = [];
      minerals.forEach((mineral) => {
        mineralsArr.push({
          pos: { x: mineral.pos.x, y: mineral.pos.y },
          type: mineral.mineralType,
        });
      });
      creep.room.memory.scouted = {
        sources: sourcesArr,
        controller: {
          pos: {
            x: creep.room.controller ? creep.room.controller.pos.x : 0,
            y: creep.room.controller ? ccreep.room.controller.pos.y : 0,
          }
        },
        minerals: mineralsArr,
        exits: {
          top: null,
          right: null,
          bottom: null,
          left: null,
        }
      }
    }

    // rewrite it to below method
    // Game.map.describeExits()

    if (creep.memory.room !== creep.room.name) {
      if (creep.memory.lastExit === 'top') {
        if (creep.room.memory.scouted.exits.bottom === null) {
          creep.room.memory.scouted.exits.bottom = creep.memory.room;
        }
        if (Memory.rooms[creep.memory.room].scouted.exits.top === null) {
          Memory.rooms[creep.memory.room].scouted.exits.top = creep.room.name;
        }
      } else if (creep.memory.lastExit === 'right') {
        if (creep.room.memory.scouted.exits.left === null) {
          creep.room.memory.scouted.exits.left = creep.memory.room;
        }
        if (Memory.rooms[creep.memory.room].scouted.exits.right === null) {
          Memory.rooms[creep.memory.room].scouted.exits.right = creep.room.name;
        }
      } else if (creep.memory.lastExit === 'bottom') {
        if (creep.room.memory.scouted.exits.top === null) {
          creep.room.memory.scouted.exits.top = creep.memory.room;
        }
        if (Memory.rooms[creep.memory.room].scouted.exits.bottom === null) {
          Memory.rooms[creep.memory.room].scouted.exits.bottom = creep.room.name;
        }
      } else if (creep.memory.lastExit === 'left') {
        if (creep.room.memory.scouted.exits.right === null) {
          creep.room.memory.scouted.exits.right = creep.memory.room;
        }
        if (Memory.rooms[creep.memory.room].scouted.exits.left === null) {
          Memory.rooms[creep.memory.room].scouted.exits.left = creep.room.name;
        }
      }
      creep.moveTo(CACHE.ROOMS[creep.memory.room].ROOM.controller.pos);
    } else {
      if (creep.room.memory.scouted.exits.top === null) {
        const exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
        if (exit === null) {
          creep.room.memory.scouted.exits.top = false;
        } else {
          creep.moveTo(exit);
          creep.memory.lastExit = 'top';
        }
      } else if (creep.room.memory.scouted.exits.right === null) {
        const exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
        if (exit === null) {
          creep.room.memory.scouted.exits.right = false;
        } else {
          creep.moveTo(exit);
          creep.memory.lastExit = 'right';
        }
      } else if (creep.room.memory.scouted.exits.bottom === null) {
        const exit = creep.pos.findClosestByRange(FIND_EXIT_BOTTOM);
        if (exit === null) {
          creep.room.memory.scouted.exits.bottom = false;
        } else {
          creep.moveTo(exit);
          creep.memory.lastExit = 'bottom';
        }
      } else if (creep.room.memory.scouted.exits.left === null) {
        const exit = creep.pos.findClosestByRange(FIND_EXIT_LEFT);
        if (exit === null) {
          creep.room.memory.scouted.exits.left === false
        } else {
          creep.moveTo(exit);
          creep.memory.lastExit = 'left';
        }
      }
    }
  }

  shouldSpawn(room) {
    const scoutsCount = _.filter(
      Game.creeps,
      creep => creep.memory.role == 'scout' && creep.memory.room == room.name
    ).length;

    if (!room.memory.scouted && scoutsCount < this.POPULATION) return true;

    const needsScouting = (
      room.memory.scouted.exits.top === null ||
      room.memory.scouted.exits.right === null ||
      room.memory.scouted.exits.bottom === null ||
      room.memory.scouted.exits.left === null
    );

    return needsScouting && scoutsCount < this.POPULATION;
  }
}
