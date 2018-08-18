/*jshint esversion: 6 */

console.log('>> Loading Creep prototype...');

Object.assign(Creep.prototype, {
  injectMemory(job, target, status) {
    this.memory.job = '';
    this.memory.target = '';
    this.memory.status = '';
  }
});

Object.assign(Creep.prototype, {
  getSources() {
    return CACHE.ROOMS[this.room.name].getSources();
  }
});
