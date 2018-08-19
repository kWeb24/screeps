/*jshint esversion: 6 */

console.log('>> Loading Road Keeper...');

export default class RoadKeeper {

  constructor() {
    // Since road upkeep is the most work but required little energy
    // roadkeepers should be mainly fast with low build and storage
  }

	/** @param {Creep} creep **/
	run(creep) {

	}

	needsHelp(fromCreep) {
		return false;
	}
}
