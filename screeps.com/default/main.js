/*jshint esversion: 6 */

const Harvester = require('role.Harvester');
const Upgrader = require('role.Upgrader');
const Builder = require('role.Builder');
const Tower = require('structure.Tower');

class Core {

  constructor() {
    this.Harvester = new Harvester();
    this.Builder = new Builder();
    this.Upgrader = new Upgrader();
    this.Tower = new Tower();

    this.ROLES = [
      {
        role: 'harvester',
        population: 2,
        genome: [WORK, CARRY, MOVE],
        run: (creep) => this.Harvester.run(creep)
      },{
        role: 'upgrader',
        population: 1,
        genome: [WORK, CARRY, MOVE],
        run: (creep) => this.Upgrader.run(creep)
      },{
        role: 'builder',
        population: 1,
        genome: [WORK, CARRY, MOVE],
        run: (creep) => this.Builder.run(creep)
      },
    ];
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
    this.ROLES.forEach((role) => {
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
      this.ROLES.forEach((role) => {
        if (creep.memory.role == role.role) {
          role.run(creep);
        }
      });
    }
  }
}

const GameCore = new Core();
module.exports.loop = () => GameCore.loop();
