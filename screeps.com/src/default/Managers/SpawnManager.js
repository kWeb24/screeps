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
        const ROOM = Game.spawns['CipciaObfita'].room;
        const GENOME = this.createAffordableGenome(role, ROOM);

        if (!GENOME) return false;
        
        Game.spawns['CipciaObfita'].createCreep(GENOME, NAME, {
          role: role.ROLE,
          primarySource: role.getPrimarySource(ROOM)
        });
      }
    });
  }

  /**
   * @memberof SpawnManager
   * @desc Create body parts array that could be spawned with given energy amount
   * @private
   **/
  createAffordableGenome(role, room) {
    const maxPrice = room.energyAvailable();
    const possiblePrice = room.energyCapacityAvailable();
    let currentPrice = 0;
    let finalGenome = [];

    let search = true;
    while (currentPrice < maxPrice && search) {
      role.GENOME.forEach((part) => {
        let priceOffset = 0;

        if (part == 'carry') {
          priceOffset = BODYPART_COST[MOVE];
        }

        if (currentPrice + BODYPART_COST[part] + priceOffset < maxPrice) {
          finalGenome += part;
          currentPrice += BODYPART_COST[part];
        } else {
          search = false;
        }
      });
    }

    return (finalGenome.length < role.GENOME) ? false : finalGenome;
  }
}
