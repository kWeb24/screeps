/*jshint esversion: 6 */

console.log('>> Loading Core...');

import Logger from '../Utils/Logger.js';

import {} from '../Prototypes/CreepPrototype.js';
import Tower from '../Structures/Tower.js';
import RoleManager from '../Managers/RoleManager.js';

const LOGGER = new Logger({
  enabled: false
});

export default class Core {

  constructor() {
    this.PARAM_ADAPTIVE_ROLES = true;
    this.LOOP = 1;

    console.log('-- -- CORE_LOGGER_ENABLED: ' + LOGGER.ENABLED);
    console.log('-- -- PARAM_ADAPTIVE_ROLES:' + this.PARAM_ADAPTIVE_ROLES);

    this.Tower = new Tower();
    this.RoleManager = new RoleManager();
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
    this.RoleManager.ROLES.forEach((role) => {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
      if (creeps.length < role.population) {
        var newName = Game.spawns['CipciaObfita'].createCreep(role.genome, undefined, {role: role.role});
      }
    });
  }

  runCreeps() {
    for (var names in Game.creeps) {
      var creep = Game.creeps[names];
      this.RoleManager.ROLES.forEach((role) => {
        if (creep.memory.role == role.role) {
          if (this.PARAM_ADAPTIVE_ROLES) {
            this.RoleManager.selectRole(creep);
          } else {
            role.run(creep);
          }
        }
      });
    }
  }
}
