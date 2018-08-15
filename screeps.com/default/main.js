/*jshint esversion: 6 */

const Harvester = require('role.Harvester');
const Upgrader = require('role.Upgrader');
const Builder = require('role.Builder');

class Core {

  constructor() {
    this.Harvester = new Harvester();
    this.Builder = new Builder();
    this.Upgrader = new Upgrader();

    this.ROLES = [
      {
        role: 'harvester',
        population: 2,
        genome: [WORK, CARRY, MOVE],
        run: (creep) => this.Harvester.run(creep)
      },{
        role: 'upgrader',
        population: 2,
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
    this.handleTower();
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
        var newName = Game.spawns['CipciaObfita'].createCreep(role.genome, undefined, {role: role});
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

  handleTower() {
    var tower = Game.getObjectById('500ebcb8c1a48083e1f72c79');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
  }
}

const GameCore = new Core();
module.exports.loop = () => GameCore.loop();
