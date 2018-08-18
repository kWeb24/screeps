/*jshint esversion: 6 */

console.log('>> Loading Creep prototype...');

import {} from './Jobs/Harvester.js';

Object.assign(Creep.prototype, {
  injectMemory(job = 'none', target = 'none', status = 'bored') {
    this.memory.job = job;
    this.memory.target = target;
    this.memory.status = status;
  }
});
