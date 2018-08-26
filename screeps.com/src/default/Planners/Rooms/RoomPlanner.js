/*jshint esversion: 6 */

console.log('>> Loading RoomPlanner module...');

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
    * @member {Array<RoomPosition>} RoomPlanner#PATHS
    * @desc {@link https://docs.screeps.com/api/#RoomPosition|Screeps RoomPosition} objects array
    **/
    this.PATHS = [];
    this.planRoads();
    this.buildRoads();
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
      const path = PathFinder.search(from, {
        pos: targets[target].pos,
        range: 1
      }, {
        plainCost: 1,
        swampCost: 1
      });
      this.PATHS.push(path.path);
    }
  }

  /**
   * @memberof RoomPlanner
   * @desc BuildRoads method
   * @private
   **/
  buildRoads() {
    this.PATHS.forEach((path) => {
      path.forEach((pos) => {
        const tileContents = this.ROOM.lookAt(pos);

        tileContents.forEach((content) => {
          if (content.type != 'structure' && content.type != 'constructionSite') {
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
    this.PATHS.forEach((path) => {
      this.ROOM.visual.poly(path, {
        opacity: 1,
        stroke: '#dfff1b',
        lineStyle: 'dotted'
      });
    });
  }
}
