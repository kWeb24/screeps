/*jshint esversion: 6 */

console.log(">> Loading Core...");

import Logger from "../Utils/Logger.js";
import Tower from "../Structures/Tower.js";

const LOGGER = new Logger({
  enabled: false
});

/**
 * @class Core
 * @classdesc AI Core
 * @global
 */

export default class Core {
  constructor() {
    /**
     * @member {Boolean} Core#PARAM_ADAPTIVE_ROLES
     * @desc {@link RoleManager} adaptive roles flag
     * @todo Fix Adaptive roles, doesn't work with new prototypes
     **/
    this.PARAM_ADAPTIVE_ROLES = false;

    /**
     * @member {Integer} Core#LOOP
     * @desc Current Loop of Core instance
     **/
    this.LOOP = true;

    console.log("-- -- CORE_LOGGER_ENABLED: " + LOGGER.ENABLED);
    console.log("-- -- PARAM_ADAPTIVE_ROLES:" + this.PARAM_ADAPTIVE_ROLES);
  }

  /**
   * @memberof Core
   * @desc Actual Core loop that handle game ticks
   * @public
   **/
  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.runStructures();
    this.runCreeps();
    this.LOOP = !this.LOOP;
    // this.LOOP++;
    // PLANNER.ROOMS['E4N27'].selectExtensions(); // when visuals on
    // PLANNER.ROOMS['E4N27'].selectContainers(); // when visuals on
    // PLANNER.ROOMS['W7N3'].drawVisuals();

    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined) {
        CACHE.ROOMS[room].ROOM.visual.rect(
          1, 1, 10, 14,
          {fill: 'rgba(0,0,0,0.5)', stroke: 'rgba(255,255,255,0.3)'}
        );

        CACHE.ROOMS[room].ROOM.visual.text(room, 3, 2, {color: 'white', font: 0.8}); 

        CACHE.ROOMS[room].ROOM.visual.circle(6, 10, {fill: 'transparent', radius: 5, stroke: 'white'}); 

        CACHE.ROOMS[room].ROOM.visual.text('⮘', 0.75, 10.25, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('W', 2, 10.25, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('(S, N)', 4, 10.25, {color: 'gray', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('(HRV)', 4, 11.25, {color: 'cyan', font: 0.8}); 
        
        CACHE.ROOMS[room].ROOM.visual.text('⮙', 6, 5.1, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('N', 6, 6, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('(S, H, I)', 6, 7, {color: 'red', font: 0.8}); 
        // CACHE.ROOMS[room].ROOM.visual.text('(-)', 6, 8, {color: 'gray', font: 0.8}); 

        CACHE.ROOMS[room].ROOM.visual.text('⮚', 11.15, 10.25, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('E', 10.25, 10.25, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('(S, N)', 8, 10.25, {color: 'gray', font: 0.8}); 
        // CACHE.ROOMS[room].ROOM.visual.text('(-)', 8, 11.25, {color: 'gray', font: 0.8}); 
        
        CACHE.ROOMS[room].ROOM.visual.text('⮛', 6, 15.5, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('S', 6, 14.5, {color: 'white', font: 0.8}); 
        CACHE.ROOMS[room].ROOM.visual.text('(No exit)', 6, 13.5, {color: 'gray', font: 0.8}); 
        // CACHE.ROOMS[room].ROOM.visual.text('(No exit)', 6, 12.5, {color: 'gray', font: 0.8}); 

      }
    }
  }

  /**
   * @memberof Core
   * @desc Clear dead {@link https://docs.screeps.com/api/#Creep|Screeps Creep} from memory
   * @private
   **/
  clearDeadCreeps() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }

  /**
   * @memberof Core
   * @desc Spawning {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @private
   **/
  spawnCreeps() {
    SPAWN_MANAGER.spawn();
  }

  /**
   * @memberof Core
   * @desc Running {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * based on role and handles Adaptive Roles conditions
   * @private
   **/
  runCreeps() {
    for (var names in Game.creeps) {
      var creep = Game.creeps[names];
      ROLE_MANAGER.ROLES.forEach(role => {
        if (creep.memory.role == role.ROLE) {
          if (this.PARAM_ADAPTIVE_ROLES) {
            ROLE_MANAGER.selectRole(creep);
          } else {
            role.run(creep);
          }
        }
      });
    }
  }

  /**
   * @memberof Core
   * @desc Running structures like towers, labs etc
   * @private
   **/
  runStructures() {
    this.Tower = new Tower();

    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined) {
        if (CACHE.ROOMS[room].getMyTowers().length) {
          const towers = CACHE.ROOMS[room].getMyTowers();
          towers.forEach((tower, index) => {
            this.Tower.run(tower);
          });
        }
      }
    }
  }
}
