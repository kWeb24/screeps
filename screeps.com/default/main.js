/*jshint esversion: 6 */

const Logger = require('utils.Logger');
const Tower = require('structure.Tower');
const RoleManager = require('manager.RoleManager');

const LOGGER = new Logger();

class Core {

  constructor() {
    this.PARAM_ADAPTIVE_ROLES = true;

    this.Tower = new Tower();
    this.RoleManager = new RoleManager();
    LOGGER.stateChange('Constructing game...');

    if (this.PARAM_ADAPTIVE_ROLES) {
      LOGGER.success('PARAM_ADAPTIVE_ROLES: ' + this.PARAM_ADAPTIVE_ROLES, 1);
    } else {
      LOGGER.note('PARAM_ADAPTIVE_ROLES: ' + this.PARAM_ADAPTIVE_ROLES, 1);
    }

    LOGGER.log('Available Roles', 1);
    this.RoleManager.ROLES.forEach((role) => {
      let message = role.role;
      message += ' (Population: ' + role.population + ') ';
      message += ' (Genome: ';
      role.genome.forEach((genome) => {
        message += '[' + genome + ']';
      });
      message +=') ';
      message += ' (Capable Of: ';
      role.capableOf.forEach((capableOf) => {
        message += '[' + capableOf + ']';
      });
      message +=') ';
      LOGGER.note(message, 2);
    });

    LOGGER.finish('Done', 2);
    LOGGER.stateChange('Game Loop...');
  }

  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.Tower.run();
    this.runCreeps();
  }

  clearDeadCreeps() {
    LOGGER.log('Clearing dead Creeps...', 1);
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        LOGGER.note('Deleting: ' + name, 2);
        delete Memory.creeps[name];
      }
    }
  }

  spawnCreeps() {
    LOGGER.log('Spawning Creeps...', 1);
    this.RoleManager.ROLES.forEach((role) => {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);

      if (creeps.length < role.population) {
        var newName = Game.spawns['CipciaObfita'].createCreep(role.genome, undefined, {role: role.role});
        LOGGER.note('Spawned: ' + name + ' as ' + role.role, 2);
      }
    });
  }

  runCreeps() {
    LOGGER.log('Running Creeps...', 1);
    LOGGER.log('Selecting roles... ', 2);

    if (this.PARAM_ADAPTIVE_ROLES) {
      LOGGER.success('PARAM_ADAPTIVE_ROLES: ' + this.PARAM_ADAPTIVE_ROLES + ' &#8594; GO', 3);
    } else {
      LOGGER.note('PARAM_ADAPTIVE_ROLES: ' + this.PARAM_ADAPTIVE_ROLES + ' &#8603; ABORT', 2);
    }

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

    LOGGER.finish('Done', 4);
  }
}

const GameCore = new Core();
module.exports.loop = () => GameCore.loop();
