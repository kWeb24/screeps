/*jshint esversion: 6 */

console.log('>> Loading Harvester Creep prototype...');

Object.assign(Creep.prototype, {
  getSources() {
    return CACHE.ROOMS[this.room.name].getSources();
  }
});

Object.assign(Creep.prototype, {
  getEnergySinks() {
    return CACHE.ROOMS[this.room.name].getEnergySinks();
  }
});

Object.assign(Creep.prototype, {
  isEnergyCapFull() {
    return this.carry.energy >= this.carryCapacity
  }
});
