import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Drainer extends Role {

  constructor() {
      super();
      this.ROLE = "thief";
      this.POPULATION = 1;
      this.GENOME = [MOVE, TOUGH, TOUGH];
      this.MAX_GENOME_LENGTH = 6;
      this.CAPABLE_OF = [];
      this.ON_DEMAND = false;
      this.USE_ENERGY_DEPOSITS = false;
  }

	/**
   * @memberof Destroyer
   * @desc Run actual Destroyer Role loop
   * @public
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
	 * @override
	 * @see Role
   **/
	run(creep) {
      // if (creep.room.name !== )
	}

	needsHelp(fromCreep) {
		return false;
	}

  shouldSpawn(room) {
    
  }
}
