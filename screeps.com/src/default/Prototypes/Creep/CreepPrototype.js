/*jshint esversion: 6 */

import {} from './Jobs/Harvester.js';

/**
 * @external Creep
 * @see {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
 * @desc Extends {@link https://docs.screeps.com/api/#Creep|Screeps Creep} prototype
 */

 /**
  * @func external:Creep#injectMemory
  * @desc Assign injectMemory method method do prototype
  * @extends external:Creep
  * @param {String} role
  * @param {String} job
  * @param {String} target
  * @param {String} status
  * @param {String} source
  **/
Object.assign(Creep.prototype, {
  injectMemory(role = 'none', job = 'none', target = 'none', status = 'bored', source = 'none') {
    this.memory.role = role;
    this.memory.job = job;
    this.memory.target = target;
    this.memory.status = status;
    this.memory.primarySource = source;
  }
});

Object.assign(Creep.prototype, {
  remember(key, value) {
    this.memory['key'] = value;
  }
});

Object.assign(Creep.prototype, {
  forget(key) {
    delete this.memory['key'];
  }
});

Object.assign(Creep.prototype, {
  role() {
    return this.memory.role;
  }
});

Object.assign(Creep.prototype, {
  job(job = false) {
    if (!job) {
      return this.memory.job;
    } else {
      this.memory.job = job;
    }
  }
});

Object.assign(Creep.prototype, {
  target(target = false) {
    if (!target) {
      return this.memory.target;
    } else {
      this.memory.target = target;
    }
  }
});

Object.assign(Creep.prototype, {
  status(status = false) {
    if (!status) {
      return this.memory.status;
    } else {
      this.memory.status = status;
    }
  }
});

Object.assign(Creep.prototype, {
  primarySource(source = false) {
    if (!source) {
      return this.memory.primarySource;
    } else {
      this.memory.primarySource = source;
    }
  }
});
