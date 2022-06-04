/*jshint esversion: 6 */
import layouts from '../../Layouts/Layouts';

console.log(">> Loading RoomPlanner module...");

/**
 * @class RoomPlanner
 * @classdesc RoomPlanner class
 * @global
 */
export default class RoomPlanner {
  constructor(room) {
    /**
     * @member {Object} RoomPlanner#ROOM
     * @desc {@link https://docs.screeps.com/api/#Room|Screeps Room} object reference
     **/
    this.ROOM = room;

    /**
     * @member {Object} RoomPlanner#ROOM
     * @desc First SPAWN object in {@link https://docs.screeps.com/api/#Room|Screeps Room}
     **/
    [this.SPAWN] = CACHE.ROOMS[this.ROOM.name].getMySpawns();

    /**
     * @member {Array<RoomPosition>} RoomPlanner#PATHS
     * @desc {@link https://docs.screeps.com/api/#RoomPosition|Screeps RoomPosition} objects array
     **/
    this.PATHS = [];

    this.planRoads();
    this.buildRoads();
    this.buildContainers();
  }

  /**
   * @memberof RoomPlanner
   * @desc Plan roads for given room based on predefined Points of Interest (PoI)
   * @private
   **/
  planRoads() {
    this.findPath(
      this.ROOM.controller.pos,
      CACHE.ROOMS[this.ROOM.name].getSources()
    );

    this.findPath(
      this.ROOM.controller.pos,
      CACHE.ROOMS[this.ROOM.name].getMinerals()
    );

    this.findPath(
      this.ROOM.controller.pos,
      CACHE.ROOMS[this.ROOM.name].getMySpawns()
    );
  }

  /**
   * @memberof RoomPlanner
   * @desc Find path from given position to given targets
   * @param {RoomPosition} from {@link https://docs.screeps.com/api/#RoomPosition|Screeps RoomPosition} object
   * @param {Object} targets SOURCE, MINERAL or SPAWN object
   * @private
   **/
  findPath(from, targets) {
    for (const target in targets) {
      const path = PathFinder.search(
        from,
        {
          pos: targets[target].pos,
          range: 1
        },
        {
          plainCost: 1,
          swampCost: 1,
          // heuristicWeight: 1.5,
        }
      );
      this.PATHS.push(path.path);
    }
  }

  /**
   * @memberof RoomPlanner
   * @desc BuildRoads method
   * @private
   **/
  buildRoads() {
    this.PATHS.forEach(path => {
      path.forEach(pos => {
        const tileContents = this.ROOM.lookAt(pos);

        tileContents.forEach(content => {
          if (
            content.type != "structure" &&
            content.type != "constructionSite"
          ) {
            this.ROOM.createConstructionSite(pos, STRUCTURE_ROAD);
          }
        });
      });
    });
  }

  /**
   * @memberof RoomPlanner
   * @desc DrawVisuals optional method. Require refresh each tick
   * @private
   **/
  drawVisuals() {
    this.PATHS.forEach(path => {
      this.ROOM.visual.poly(path, {
        opacity: 1,
        stroke: "#dfff1b",
        lineStyle: "dotted"
      });
    });

    this.findCoreBaseSpace();
  }

  findCoreBaseSpace() {
    for (const [name, base] of Object.entries(layouts)) {

      const solutions = CACHE.ROOMS[this.ROOM.name].getBasePossiblePositions(name, base);

      solutions.forEach((solution) => {
        // this.ROOM.visual.rect(solution.x, solution.y, solution.x2, solution.y2, {
        //   fill: 'transparent',
        //   stroke: '#60f542',
        //   opacity: 0.2,
        // });

        base.core.levels.forEach((level) => {
          level.forEach((site) => {
            if (site.type === 'road')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#ffffff',
                radius: 0.15,
              });
            }

            if (site.type === 'spawn')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#66c7ff',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'link')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#00fffb',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'powerSpawn')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#ff00e1',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'tower')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#ff0026',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'storage')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#ff0026',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'nuke')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#ff7300',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'factory')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#00ff88',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'terminal')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#a2ff00',
                radius: 0.30,
                opacity: 1,
              });
            }

            if (site.type === 'wall')
            {
              this.ROOM.visual.circle(solution.x + site.pos[0], solution.y + site.pos[1], {
                fill: '#000000',
                radius: 0.30,
                opacity: 1,
              });
            }

          });
        });
      });

    }
  }

  /**
   * @memberof RoomPlanner
   * @desc BuildContainers builds containers
   * @private
   **/
  buildContainers() {
    // containers.forEach(container => {
    //   const pos = this.ROOM.getPositionAt(
    //     this.SPAWN.pos.x + container.x,
    //     this.SPAWN.pos.y + container.y
    //   );
    //
    //   if (pos !== null) {
    //     const tileContents = this.ROOM.lookAt(pos);
    //
    //     tileContents.forEach(content => {
    //       if (
    //         content.type != "structure" &&
    //         content.type != "constructionSite"
    //       ) {
    //         this.ROOM.createConstructionSite(pos, STRUCTURE_CONTAINER);
    //       }
    //     });
    //   }
    // });
  }
}
