/*jshint esversion: 6 */

console.log('>> Loading Core...');

import Logger from '../Utils/Logger.js';
import Tower from '../Structures/Tower.js';

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
    this.LOOP = 1;

    console.log('-- -- CORE_LOGGER_ENABLED: ' + LOGGER.ENABLED);
    console.log('-- -- PARAM_ADAPTIVE_ROLES:' + this.PARAM_ADAPTIVE_ROLES);

    this.Tower = new Tower();
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
    this.LOOP++;
    // PLANNER.ROOMS['E4N27'].selectExtensions(); // when visuals on
    // PLANNER.ROOMS['E4N27'].selectContainers(); // when visuals on
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
      ROLE_MANAGER.ROLES.forEach((role) => {
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
    const [tower] = CACHE.ROOMS['E4N27'].getMyTowers();
    this.Tower.run(tower);

    // for (let structure in CACHE.ROOMS['E4N27'].getMyTowers()) {
    //   this.Tower.run(structure);
    // }
  }
}
