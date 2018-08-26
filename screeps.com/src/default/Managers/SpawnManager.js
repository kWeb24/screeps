/*jshint esversion: 6 */

console.log('>> Loading SpawnManager...');

/**
 * @class SpawnManager
 * @classdesc SpawnManager class, manages spawns
 * @global
 */
export default class SpawnManager {

  constructor() {
    /**
    * @member {Object} SpawnManager#BODY_PARTS_PRICES
    * @desc Set fixed energy price for each body part
    **/
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

    /**
    * @member {Integer} SpawnManager#MAX_BODY_PARTS
    * @desc Set max {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
    * body parts limit
    **/
    this.MAX_BODY_PARTS = 50;
  }

  /**
   * @memberof SpawnManager
   * @desc Spawn {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   **/
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
