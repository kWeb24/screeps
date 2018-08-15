/*jshint esversion: 6 */


const Tower = require('structure.Tower');
const RoleManager = require('manager.RoleManager');

class Core {

  constructor() {
    this.PARAM_ADAPTIVE_ROLES = true;

    this.Tower = new Tower();
    this.RoleManager = new RoleManager();
  }

  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.Tower.run();
    this.runCreeps();
  }

  clearDeadCreeps() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }

  spawnCreeps() {
    this.RoleManager.ROLES.forEach((role) => {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);

      if (creeps.length < role.population) {
        var newName = Game.spawns['CipciaObfita'].createCreep(role.genome, undefined, {role: role.role});
        console.log('Spawning new ' + role.role + ' - ' + newName);
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

const GameCore = new Core();
module.exports.loop = () => GameCore.loop();
