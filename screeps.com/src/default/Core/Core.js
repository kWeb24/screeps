/*jshint esversion: 6 */

console.log('>> Loading Core...');

import Logger from '../Utils/Logger.js';
import Tower from '../Structures/Tower.js';

const LOGGER = new Logger({
  enabled: false
});

export default class Core {

  constructor() {
    // TODO: Fix Adaptive roles, doesn't work with new prototypes
    this.PARAM_ADAPTIVE_ROLES = false;
    this.LOOP = 1;

    console.log('-- -- CORE_LOGGER_ENABLED: ' + LOGGER.ENABLED);
    console.log('-- -- PARAM_ADAPTIVE_ROLES:' + this.PARAM_ADAPTIVE_ROLES);

    this.Tower = new Tower();
  }

  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.Tower.run();
    this.runCreeps();
    this.LOOP++;
  }

  clearDeadCreeps() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }

  spawnCreeps() {
    SPAWN_MANAGER.spawn();
  }

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
}
