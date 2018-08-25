/*jshint esversion: 6 */

console.log('>> Loading SpawnManager...');

export default class SpawnManager {

  constructor() {
    this.BODY_PARTS_PRICES = {
      move: 50,
      work: 100,
      carry: 50,
      attack: 80,
      rangedAttack: 150,
      heal: 250,
      claim: 600,
      tough: 10
    };

    this.MAX_BODY_PARTS = 50;
  }

  spawn() {
    ROLE_MANAGER.ROLES.forEach((role) => {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.ROLE);
      if (role.shouldSpawn()) {
        const NAME = role.ROLE + '_' + UTILS.guidGenerator();
        Game.spawns['CipciaObfita'].createCreep(role.GENOME, NAME, {
          role: role.ROLE,
          primarySource: role.getPrimarySource(Game.spawns['CipciaObfita'].room)
        });
      }
    });
  }
}
