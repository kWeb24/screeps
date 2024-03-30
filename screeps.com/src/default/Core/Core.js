console.log(">> Loading Core...");

import Emperor from '../Managers/Emperor.js';

import Tower from "../Structures/Tower.js";

/**
 * @class Core
 * @classdesc Core
 * @global
 */

export default class Core {
  constructor() {
    /**
     * @member {Emperor} Core#Emperor
     * @desc {@link Emperor} Colony manager entity
     **/
    this.Emperor = new Emperor();
  }

  /**
   * @memberof Core
   * @desc Actual Core loop that handle game ticks
   * @public
   **/
  loop() {
    this.clearDeadCreeps();
    this.spawnCreeps();
    this.runStructures();
    this.runCreeps();
    this.Emperor.run();
  }

  /**
   * @memberof Core
   * @desc Clear dead {@link https://docs.screeps.com/api/#Creep|Screeps Creep} from memory
   * @private
   **/
  clearDeadCreeps() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }

  /**
   * @memberof Core
   * @desc Spawning {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @private
   **/
  spawnCreeps() {
    SPAWN_MANAGER.spawn();
  }

  /**
   * @memberof Core
   * @desc Running {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * based on role and handles Adaptive Roles conditions
   * @private
   **/
  runCreeps() {
    for (var names in Game.creeps) {
      var creep = Game.creeps[names];
      ROLE_MANAGER.ROLES.forEach(role => {
        if (creep.memory.role == role.ROLE) {
          if (this.PARAM_ADAPTIVE_ROLES) {
            ROLE_MANAGER.selectRole(creep);
          } else {
            role.run(creep);
          }
        }
      });
    }
  }

  /**
   * @memberof Core
   * @desc Running structures like towers, labs etc
   * @private
   **/
  runStructures() {
    this.Tower = new Tower();

    for (const room in Game.rooms) {
      if (CACHE.ROOMS[room] !== undefined) {
        CACHE.ROOMS[room].getStructures(true);
        if (CACHE.ROOMS[room].getMyTowers().length) {
          const towers = CACHE.ROOMS[room].getMyTowers();
          towers.forEach((tower, index) => {
            this.Tower.run(tower);
          });
        }

        const terminals = CACHE.ROOMS[room].getMyTerminals();
        if (terminals.length) {
          const orders = Game.market.getAllOrders({type: ORDER_BUY});
          orders.forEach((order) => {
            if ( terminals[0].store.getUsedCapacity(order.resourceType) > 1000) {
              Game.market.deal(order.id, terminals[0].store.getUsedCapacity(order.resourceType) - 1000, room);
            }
          })
        }
      }
    }
  }
}
