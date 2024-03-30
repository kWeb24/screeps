/**
 * @class Governor
 * @classdesc Governor class, manages rooms
 * @global
 */

export default class Governor {

  constructor() {
    
  }

  run(roomName) {
    const room = Game.rooms[roomName];
    this.initRoom(room);
    this.refreshRoomStatus(room);
    // console.log(room.memory);
    const status = {};
    // if (room.controller.my && room.controller.level > 0) {
    //     if (!room.memory.staticContainers) {
    //         const points = this.getStaticContainers(roomName);
    //         const staticContainers = [];
    //         points.forEach((point) => {
    //             // console.log(point);
    //             staticContainers.push({
    //                 x: point.x,
    //                 y: point.y,
    //             })
    //         });
    //         console.log(staticContainers.length);
    //         // room.memory.staticContainers = staticContainers;
    //     } else {
    //         // points.forEach((point) => {
    //       //   if (point) {
    //       //     Game.rooms[room].visual.circle(point, {
    //       //       fill: '#ff0026',
    //       //       radius: 0.30,
    //       //       opacity: 1,
    //       //     });
    //       //   }
    //       // });
    //     }

    // }
    return status;
  }

  refreshRoomStatus(room) {
    if (room.controller !== undefined) {
        room.memory.controller.my = room.controller.my;
    }

    const invaderCore = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
    if (invaderCore.length) {
        room.memory.invaderCore = {
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
        sourcesArr.push({ pos: { x: source.pos.x, y: source.pos.y } });
    });
    let mineralsArr = [];
    minerals.forEach((mineral) => {
        mineralsArr.push({
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
    };

    if (room.controller !== undefined) {
        memory.controller = {
            pos: {
                x: room.controller.pos.x,
                y: room.controller.pos.y,
            },
            my: room.controller.my
        };
    }

    const invaderCore = room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
    if (invaderCore.length) {
        memory.invaderCore = {
            pos: {
                x: invaderCore[0].pos.x,
                y: invaderCore[0].pos.y,
                level: invaderCore[0].level,
            }
        }
    }

    room.memory = memory;
  }

  getStaticContainers(room) {
      const spawns = CACHE.ROOMS[room].getMySpawns();
      const sources = CACHE.ROOMS[room].getSources();
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

}
