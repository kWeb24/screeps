/*jshint esversion: 6 */

console.log('>> Loading SpawnManager...');

export default class SpawnManager {

  constructor() {

  }

  spawn() {
    ROLE_MANAGER.ROLES.forEach((role) => {
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.ROLE);
      if (role.shouldSpawn()) {
        const NAME = role.ROLE + '_' + UTILS.guidGenerator();
        Game.spawns['CipciaObfita'].createCreep(role.GENOME, NAME, {role: role.ROLE});
      }
    });
  }
}
