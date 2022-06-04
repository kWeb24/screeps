/*jshint esversion: 6 */

console.log(">> Loading SpawnManager...");

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
    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined && CACHE.ROOMS[room].getMySpawns().length) {
        const ROOM = CACHE.ROOMS[room].ROOM;
        const SPAWN = CACHE.ROOMS[room].getMySpawns()[0];

        ROLE_MANAGER.ROLES.reverse().forEach(role => {
          var creeps = _.filter(
            Game.creeps,
            creep => creep.memory.role == role.ROLE && creep.memory.room == ROOM.name
          );
          if (role.shouldSpawn(ROOM)) {
            const NAME = role.ROLE + "_" + UTILS.guidGenerator();
            const GENOME = this.createAffordableGenome(role, ROOM);

            if (!GENOME) return false;

            SPAWN.createCreep(GENOME, NAME, {
              role: role.ROLE,
              primarySource: role.getPrimarySource(ROOM),
              room: ROOM.name
            });
          }
        });
      }
    }
  }

  /**
   * @memberof SpawnManager
   * @desc Create body parts array that could be spawned with given energy amount
   * @private
   * @returns {Array<BodyParts>} Array of body parts or false
   **/
  createAffordableGenome(role, room) {
    const maxPrice = room.energyAvailable;
    const possiblePrice = room.energyCapacityAvailable;
    let currentPrice = 0;
    let finalGenome = [];

    let search = true;
    while (currentPrice < maxPrice && search) {
      role.GENOME.forEach(part => {
        let priceOffset = 0;

        if (part == "carry") {
          priceOffset = BODYPART_COST[MOVE];
        }

        if (currentPrice + BODYPART_COST[part] + priceOffset < maxPrice) {
          finalGenome.push(part);
          currentPrice += BODYPART_COST[part];
        } else {
          search = false;
        }
      });
      if (
        finalGenome.length >= role.MAX_GENOME_LENGTH
      ) {
        search = false;
      }
    }

    return finalGenome.length < role.GENOME.length ? false : finalGenome;
  }
}
