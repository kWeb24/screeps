/*jshint esversion: 6 */

/**
 * @class Guard
 * @classdesc Guard role class
 * @abstract
 * @augments Role
 */

export default class Guard {

  constructor() {

  }

	/**
   * @memberof Guard
   * @desc Run actual Guard Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
	}

	/**
   * @memberof Guard
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
