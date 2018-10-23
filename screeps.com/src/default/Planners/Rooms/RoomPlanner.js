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
    * @member {Object} RoomPlanner#ROOM
    * @desc First SPAWN object in {@link https://docs.screeps.com/api/#Room|Screeps Room}
    **/
    [this.SPAWN] = this.ROOM.find(FIND_MY_SPAWNS);

    /**
    * @member {Array<RoomPosition>} RoomPlanner#PATHS
    * @desc {@link https://docs.screeps.com/api/#RoomPosition|Screeps RoomPosition} objects array
    **/
    this.PATHS = [];

    /**
    * @member {Array} RoomPlanner#RLC2_EXTENSIONS
    * @desc Array of objects with relative position to Room Spawn (RLC2)
    **/
    this.RLC2_EXTENSIONS = [
      {x: 0, y: -2},
      {x: -1, y: -2},
      {x: -2, y: -1},
      {x: -2, y: 0},
      {x: 2, y: 1},
    ];

    /**
    * @member {Array} RoomPlanner#RLC3_EXTENSIONS
    * @desc Array of objects with relative position to Room Spawn (RLC3)
    **/
    this.RLC3_EXTENSIONS = [
      {x: 2, y: 0},
      {x: 1, y: 2},
      {x: 0, y: 2},
      {x: -2, y: 1},
      {x: -1, y: 2},
    ];

    /**
    * @member {Array} RoomPlanner#RLC4_EXTENSIONS
    * @desc Array of objects with relative position to Room Spawn (RLC4)
    **/
    this.RLC4_EXTENSIONS = [
      {x: 1, y: -2},
      {x: 2, y: -1},
      {x: 2, y: 3},
      {x: 1, y: 3},
      {x: 0, y: 3},
    ];

    /**
    * @member {Array} RoomPlanner#RLC5_EXTENSIONS
    * @desc Array of objects with relative position to Room Spawn (RLC5)
    **/
    this.RLC5_EXTENSIONS = [
      {x: 3, y: 2},
      {x: 3, y: 1},
      {x: 3, y: 0},
      {x: -3, y: 0},
      {x: -3, y: -1},
    ];

    /**
    * @member {Array} RoomPlanner#RLC5_EXTENSIONS
    * @desc Array of objects with relative position to Room Spawn (RLC6)
    **/
    this.RLC6_EXTENSIONS = [
      {x: -3, y: -2},
      {x: -2, y: -3},
      {x: -1, y: -3},
      {x: 0, y: -3},
      // {x: -3, y: -1},
    ];

    this.selectExtensions();
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

  /**
   * @memberof RoomPlanner
   * @desc SelectExtensions builds room extensions based on controller level
   * @private
   **/
  selectExtensions() {
    if (this.ROOM.controller.owner.username == 'kWeb24') {
      switch(this.ROOM.controller.level) {
        case 2: this.buildExtensions(this.RLC2_EXTENSIONS, '#6bf7ff'); break;
        case 3: this.buildExtensions(this.RLC3_EXTENSIONS, '#f95eff'); break;
        case 4: this.buildExtensions(this.RLC4_EXTENSIONS, '#a4ff4'); break;
        case 5: this.buildExtensions(this.RLC5_EXTENSIONS, '#ffd749'); break;
        case 6: this.buildExtensions(this.RLC6_EXTENSIONS, '#ff4949'); break;
      }

      // this.buildExtensions(this.RLC2_EXTENSIONS, '#6bf7ff');
      // this.buildExtensions(this.RLC3_EXTENSIONS, '#f95eff');
      // this.buildExtensions(this.RLC4_EXTENSIONS, '#a4ff49');
      // this.buildExtensions(this.RLC5_EXTENSIONS, '#ffd749');
      // this.buildExtensions(this.RLC6_EXTENSIONS, '#ff4949');
    }
  }

  /**
   * @memberof RoomPlanner
   * @desc BuildExtensions builds given extensions
   * @param {Array} extensions with extension relative positions
   * @param {String} color Visuals color
   * @private
   **/
  buildExtensions(extensions, color) {
    extensions.forEach((extension) => {
      const pos = this.ROOM.getPositionAt(this.SPAWN.pos.x + extension.x, this.SPAWN.pos.y + extension.y);

      if (pos !== null) {
        const tileContents = this.ROOM.lookAt(pos);

        tileContents.forEach((content) => {
          if (content.type != 'structure' && content.type != 'constructionSite') {
            this.ROOM.createConstructionSite(pos, STRUCTURE_EXTENSION);
          }
        });
      }

      // this.ROOM.visual.circle(pos.x, pos.y, {
      //   fill: color
      // });
    });
  }
}
