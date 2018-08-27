/*jshint esversion: 6 */

console.log('>> Loading Harvester Creep prototype...');

Object.assign(Creep.prototype, {
  getSources() {
    return CACHE.ROOMS[this.room.name].getSources();
  }
});

Object.assign(Creep.prototype, {
  getActiveSources() {
    return CACHE.ROOMS[this.room.name].getActiveSources();
  }
});

Object.assign(Creep.prototype, {
  getClosestActiveSource() {
    return this.pos.findClosestByRange(FIND_ACTIVE_SOURCES);
  }
});

Object.assign(Creep.prototype, {
  getEnergySinks() {
    return CACHE.ROOMS[this.room.name].getEnergySinks();
  }
});
