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

  getSpawnQueue() {
    let queue = {};
    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined && CACHE.ROOMS[room].getMySpawns().length) {
        queue[room] = [];
        ROLE_MANAGER.ROLES.forEach(role => {          
          if (role.shouldSpawn(Game.rooms[room])) {
            queue[room].push(role);
          }
        });
      }
    }

    return queue;
  }

  /**
   * @memberof SpawnManager
   * @desc Spawn {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   **/
  spawn() {
    const queue = this.getSpawnQueue();

    for (const [room, roles] of Object.entries(queue)) {
      const ROOM = Game.rooms[room];
      const SPAWN = CACHE.ROOMS[room].getMySpawns()[0];
      if (SPAWN.spawning === null && roles.length) {
        const NAME = roles[0].ROLE + "_" + UTILS.guidGenerator();
        let GENOME = roles[0].getOptimalGenome(ROOM);

        if (GENOME !== false) {
          const dryRun = SPAWN.spawnCreep(GENOME.slice(0, 50), NAME, { dryRun: true });
          if (dryRun !== OK) {
            GENOME = false;
          }
        }
        
        if (GENOME === false) {
          GENOME = this.createAffordableGenome(roles[0], ROOM);
        }
        
        if (GENOME) {
          let result = SPAWN.spawnCreep(GENOME.slice(0, 50), NAME, {
            memory: {
              role: roles[0].ROLE,
              primarySource: roles[0].getPrimarySource(ROOM),
              room: ROOM.name
            }
          });

          // if (result === OK) {
          //   if (ROOM.memory.population === undefined) {
          //     ROOM.memory.population = {};
          //   }
          //   if (ROOM.memory.population[roles[0].ROLE] === undefined) {
          //     ROOM.memory.population[roles[0].ROLE] = 0;
          //   }
          //   ROOM.memory.population[roles[0].ROLE] = ROOM.memory.population[roles[0].ROLE] + 1;
          // }
        }
      }
    };
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
        // should break when search false too otherwise it's still adding parts
        // this logic should be rewritten in governors anyway
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
