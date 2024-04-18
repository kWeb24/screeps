import Tower from "../Structures/Tower.js";

/**
 * @class Governor
 * @classdesc Governor class, manages rooms
 * @global
 */

export default class Governor {

  constructor() {
    this.repairQueue = [];

    this.maxRepairValue = 100000;
    this.repailThreshold = 0.9;
    this.repairSortOrder = [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_WALL];
  }

  run(roomName, orders) {
    this.repairQueue = [];
    const room = Game.rooms[roomName];
    this.initRoom(room);
    this.refreshRoomStatus(room);
    this.runOwnedRoom(room);
    this.runStructures(roomName, orders);
    // console.log(room.memory);
    const status = {};
    // if (room.controller.my && room.controller.level > 0) {
        // if (!room.memory.staticContainers) {
        //     const points = this.getStaticContainers(roomName, room);
        //     const staticContainers = [];
        //     points.forEach((point) => {
        //         // console.log(point);
        //         staticContainers.push({
        //             x: point.x,
        //             y: point.y,
        //         })
        //     });
        //     // console.log(staticContainers.length);
        //     // room.memory.staticContainers = staticContainers;
        // } else {
          //   const points = this.getStaticContainers(roomName, room);
          //   points.forEach((point) => {
          //   if (point) {
          //     room.visual.circle(point, {
          //       fill: '#ff0026',
          //       radius: 0.30,
          //       opacity: 1,
          //     });
          //   }
          // });
        // }

    // }
    return status;
  }

  runOwnedRoom(room) {
    if (room.controller === undefined || !room.controller.my) return false;

    const structures = room.find(FIND_STRUCTURES, {
      filter: structure => (
        structure.my || 
        structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_ROAD ||
        structure.structureType === STRUCTURE_WALL
      )
    });

    this.repairQueue = this.getRepairQueue(room, structures);
  }

  getRepairQueue(room, structures) {
    // const t = Game.cpu.getUsed()
    const toRepair = _.filter(structures, structure => (
      structure.hits < structure.hitsMax * this.repailThreshold && 
      structure.hits < this.maxRepairValue
    )).sort((a, b) => {
      return this.repairSortOrder.indexOf(a.structureType) - this.repairSortOrder.indexOf(b.structureType)
    }).map((structure) => structure.id);
    // console.log(Game.cpu.getUsed() - t);
    // console.log(toRepair);
    // console.log(toRepair.length);
    return toRepair;
  }

  refreshRoomStatus(room) {
    if (room.controller !== undefined) {
        room.memory.controller.my = room.controller.my;
        room.memory.controller.otherPlayer = room.controller.owner && room.controller.owner.username !== 'kWeb24' ? true : false;
    }

    // update
    if (room.memory.queue === undefined) {
      room.memory.queue = {
        repair: [],
        haul: [],
        build: [],
      };
    }

    const invaderCore = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
    if (invaderCore.length) {
        let unreachable = false;

        if (
            room.memory.invaderCore !== undefined &&
            room.memory.invaderCore !== false &&
            room.memory.invaderCore.unreachable === true &&
            room.memory.invaderCore.id === invaderCore[0].id
        ) {
            unreachable = true;
        }
        room.memory.invaderCore = {
            id: invaderCore[0].id,
            unreachable: unreachable,
            pos: {
                x: invaderCore[0].pos.x,
                y: invaderCore[0].pos.y,
                level: invaderCore[0].level,
            }
        }
    } else {
        room.memory.invaderCore = false;
    }
  }

  initRoom(room) {
    if (room.memory.scouted === true) return false;

    const sources = room.find(FIND_SOURCES);
    const minerals = room.find(FIND_MINERALS);
    let sourcesArr = [];
    sources.forEach((source) => {
        sourcesArr.push({ 
            id: source.id,
            pos: { x: source.pos.x, y: source.pos.y } 
        });
    });
    let mineralsArr = [];
    minerals.forEach((mineral) => {
        mineralsArr.push({
            id: mineral.id,
            pos: { x: mineral.pos.x, y: mineral.pos.y },
            type: mineral.mineralType,
            density: mineral.density
        });
    });
    const memory = {
        scouted: true,
        sources: sourcesArr,
        controller: false,
        minerals: mineralsArr,
        exits: Game.map.describeExits(room.name),
        invaderCore: false,
        queue: {
          repair: [],
          haul: [],
          build: [],
        }
    };

    if (room.controller !== undefined) {
        memory.controller = {
            id: room.controller.id,
            pos: {
                x: room.controller.pos.x,
                y: room.controller.pos.y,
            },
            my: room.controller.my,
            otherPlayer: room.controller.owner && room.controller.owner.username !== 'kWeb24' ? true : false
        };
    }

    const invaderCore = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
    if (invaderCore.length) {
        memory.invaderCore = {
            id: invaderCore[0].id,
            unreachable: false,
            pos: {
                x: invaderCore[0].pos.x,
                y: invaderCore[0].pos.y,
                level: invaderCore[0].level,
            }
        }
    }

    room.memory = memory;
  }

  getStaticContainers(room, roomObj) {
    //   const spawns = CACHE.ROOMS[room].getMySpawns();
      const spawns = [];
      spawns.push(roomObj.controller);
      const sources = roomObj.find(FIND_SOURCES);
      const minerals = CACHE.ROOMS[room].getMinerals();
      if (!spawns.length) return [];
      const points = [];
      if (spawns.length) {
        sources.forEach((source) => {
          let path = PathFinder.search(
            spawns[0].pos,
            {
              pos: source.pos,
              range: 1
            }
          );
          points.push(path.path[path.path.length - 1]);
        });
        
        let path = PathFinder.search(
          spawns[0].pos,
          {
            pos: minerals[0].pos,
            range: 1
          }
        );
        points.push(path.path[path.path.length - 1]);
      }

      return points;
  }

  /**
   * @memberof Governor
   * @desc Running structures like towers, labs etc
   * @private
   **/
  runStructures(room, orders) {
    this.Tower = new Tower();

    if (CACHE.ROOMS[room] !== undefined) {
      CACHE.ROOMS[room].getStructures(true);
      if (CACHE.ROOMS[room].getMyTowers().length) {
        const towers = CACHE.ROOMS[room].getMyTowers();
        towers.forEach((tower, index) => {
          this.Tower.run(tower, this.repairQueue, index);
        });
      }

      // const terminal = Game.rooms[room].terminal;
      // if (terminal) {
      //   orders.forEach((order) => {
      //     if (order.resourceType !== RESOURCE_ENERGY && terminal.store.getUsedCapacity(order.resourceType) > 1000) {
      //       const result = Game.market.deal(order.id, terminal.store.getUsedCapacity(order.resourceType) - 1000, room);
      //       console.log(`sell ${order.resourceType} result: ${result}`);
      //     }
      //   })
      //   // if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 10000) {
      //   //   const r = Game.market.deal(orders[0].id, 2000, room);
      //   //   console.log(r);
      //   // }
      // }
    }
  }
}
