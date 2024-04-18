import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Thief extends Role {

  constructor() {
      super();
      this.ROLE = "thief";
      this.POPULATION = 1;
      this.GENOME = [MOVE];
      this.MAX_GENOME_LENGTH = 1;
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
    creep.moveTo(new RoomPosition(33, 48, 'W28N15'));
	}

	needsHelp(fromCreep) {
		return false;
	}

  shouldSpawn(room) {
    return false;
    
    if (room.name === 'W28N14') {
      return true;
    }

    return false;
  }
}
