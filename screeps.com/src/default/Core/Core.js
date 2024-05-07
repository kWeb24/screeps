console.log(">> Loading Core...");

import Emperor from '../Managers/Emperor.js';


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
    // Game.map.visual.rect(new RoomPosition(0, 0, 'W28N13'), 
    //   25, 25,
    //   {fill: 'transparent', stroke: '#ff0000'}
    // );
    if (Game.cpu.bucket === 10000) {
      Game.cpu.generatePixel();
    }
    this.clearDeadCreeps();

    // const structures = {};
    // const t = Game.cpu.getUsed();
    // for (const structureId in Game.structures) {
    //   const structure = Game.structures[structureId];
    //   if (structures[structure.room.name] == undefined) {
    //     // structures[structure.room.name] = {};
    //   }
    //   if (structure.structureType == STRUCTURE_LINK) {
    //   //   if (structures[structure.room.name].links === undefined) {
    //   //     structures[structure.room.name].links = [];
    //   //   }
    //   //   structures[structure.room.name].links.push(structure);
    //   }
    // }
    // console.log(Game.cpu.getUsed() - t);
    // console.log(structures);
    
    this.runCreeps();
    this.spawnCreeps();
    // const t = Game.cpu.getUsed(); //0.6
    this.Emperor.run();
    // console.log(Game.cpu.getUsed() - t);
  }

  /**
   * @memberof Core
   * @desc Clear dead {@link https://docs.screeps.com/api/#Creep|Screeps Creep} from memory
   * @private
   **/
  clearDeadCreeps() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        const { role, room, primarySource } = Memory.creeps[name];
        // console.log(room);
        
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
    const cost = {};
    for (var names in Game.creeps) {
      var creep = Game.creeps[names];
      ROLE_MANAGER.ROLES.forEach(role => {
        if (!cost[role.ROLE]) {
          cost[role.ROLE] = { total: 0, count: 0, max: 0};
        }
        if (creep.memory.role == role.ROLE) {
          if (this.PARAM_ADAPTIVE_ROLES) {
            ROLE_MANAGER.selectRole(creep);
          } else {
            const start = Game.cpu.getUsed();
            role.run(creep);
            const end = Game.cpu.getUsed() - start;
            if (cost[role.ROLE].max < end) {
              cost[role.ROLE].max = end;
            }
            cost[role.ROLE].total += end;
            cost[role.ROLE].count++;
          }
        }
      });
    }
    // let str = '';
    // for (const [r, c] of Object.entries(cost)) {
    //   const avg = c.count > 0 ? c.total / c.count : 0;
    //   str += `${r.substring(0, 3)}: ${avg.toFixed(2)} (${c.max.toFixed(2)}) | `;
    // }
    // console.log(str);
  }

}
