/*jshint esversion: 6 */

console.log('>> Loading Miner Role...');

/**
 * @class Miner
 * @classdesc Miner role class
 * @abstract
 * @augments Role
 */
export default class Miner {

  constructor() {

  }

  /**
   * @memberof Miner
   * @desc Run actual Miner Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
	}

	/**
   * @memberof Miner
   * @desc Check if given role needs help from asking {@link https://docs.screeps.com/api/#Creep|Screeps Creep}
   * @public
   * @param {Creep} fromCreep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object that call this method
   * @returns {Boolean}
	 * @override
	 * @see Role
   **/
	needsHelp(fromCreep) {
		return false;
	}
}
