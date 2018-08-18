/*jshint esversion: 6 */

console.log('>> Loading Creep prototype...');

import {} from './Jobs/Harvester.js';

Object.assign(Creep.prototype, {
  injectMemory(job, target, status) {
    this.memory.job = '';
    this.memory.target = '';
    this.memory.status = '';
  }
});
