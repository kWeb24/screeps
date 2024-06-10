/*jshint esversion: 6 */

/**
 * @class Miner
 * @classdesc Miner role class
 * @abstract
 */
export default class SourceRegen {

  constructor() {
    this.NAME = 'SourceRegenF1';
    this.me  = Game.powerCreeps[this.NAME];
    this.powerSpawn = null;
  }

  /**
   * @memberof Engineer
   * @desc Run actual Engineer Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   **/
	run(powerSpawn) {
    this.powerSpawn = powerSpawn;
    this.spawnIfNeeded(powerSpawn);
    if (!this.me.ticksToLive) {
      return false;
    }

    if (this.renewIfNeeded()) {
      return false;
    }

    this.getOps();
    this.enablePowerIfNeeded();
    this.enableFactory();
  }

  spawnIfNeeded(powerSpawn) {
    if (!this.me.ticksToLive) {
      this.me.spawn(powerSpawn);
    }
  }

  renewIfNeeded() {
    if (this.me.ticksToLive < 300) {
      if (this.me.renew(this.powerSpawn) == ERR_NOT_IN_RANGE) {
        this.me.moveTo(this.powerSpawn, { reusePath: 10 });
      }

      return true;
    }

    return false;
  }

  getOps() {
    if (this.me.store.getUsedCapacity(RESOURCE_OPS) < 100) {
      let source = this.me.room.terminal;
      if (this.me.room.terminal.store.getUsedCapacity(RESOURCE_OPS) === 0) {
        source = this.me.room.storage;
      }
      if (this.me.withdraw(source, RESOURCE_OPS) == ERR_NOT_IN_RANGE) {
        this.me.moveTo(source, { reusePath: 10 });
      }
    }
  }

  enablePowerIfNeeded() {
    if (this.me.room.name === 'W28N13' && !this.me.room.controller.isPowerEnabled) {
      if (this.me.enableRoom(this.me.room.controller) === ERR_NOT_IN_RANGE) {
        this.me.moveTo(this.me.room.controller);
      }
    }
  }

  enableFactory() {
    const factory = Game.getObjectById('662ba59f3139bc7b6167174b');
    let isFactoryEnabled = false;
    factory.effects.forEach((effect) => {
      if (effect.effect === PWR_OPERATE_FACTORY && effect.ticksRemaining > 0) {
        isFactoryEnabled = true;
      }
    });
    if (!isFactoryEnabled) {
      if (this.me.usePower(PWR_OPERATE_FACTORY, factory) == ERR_NOT_IN_RANGE) {
        this.me.moveTo(factory, { reusePath: 10});
      }
    }
  }
}
