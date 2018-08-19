/*jshint esversion: 6 */

console.log('>> Loading RoomPlanner module...');

export default class RoomPlanner {

  constructor(room) {
    this.ROOM = room;
    this.PATHS = [];
    this.planRoads();
    this.buildRoads();
  }

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
