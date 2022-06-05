/*jshint esversion: 6 */

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
    return this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  }
});

Object.assign(Creep.prototype, {
  getEnergySinks() {
    return CACHE.ROOMS[this.room.name].getEnergySinks();
  }
});
