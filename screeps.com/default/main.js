/*jshint esversion: 6 */

const Harvester = require('role.Harvester');
const Upgrader = require('role.Upgrader');
const Builder = require('role.Builder');

class Core {

  constructor() {
    this.Harvester = new Harvester();
    this.Builder = new Builder();
    this.Upgrader = new Upgrader();
  }

  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.handleTower();
    this.runCreeps();
  }

  clearDeadCreeps() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }

  spawnCreeps() {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    if(harvesters.length < 2) {
      var newName = Game.spawns['CipciaObfita'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
      console.log('Spawning new harvester: ' + newName);
    }

    if(upgraders.length < 2) {
      var newName = Game.spawns['CipciaObfita'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
      console.log('Spawning new upgrader: ' + newName);
    }

    if(builders.length < 1) {
      var newName = Game.spawns['CipciaObfita'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
      console.log('Spawning new builder: ' + newName);
    }
  }

  runCreeps() {
    for (var names in Game.creeps) {
      var creep = Game.creeps[names];
      if (creep.memory.role == 'harvester') {
        this.Harvester.run(creep);
      }

      if (creep.memory.role == 'upgrader') {
        this.Upgrader.run(creep);
      }

      if (creep.memory.role == 'builder') {
        this.Builder.run(creep);
      }
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
