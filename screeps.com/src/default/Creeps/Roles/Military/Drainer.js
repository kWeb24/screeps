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
      this.ROLE = "drainer";
      this.POPULATION = 1;
      this.GENOME = [MOVE, TOUGH, TOUGH];
      this.MAX_GENOME_LENGTH = 30;
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
    // creep.moveTo(new RoomPosition(38, 44, 'W28N15'));
    //   if (creep.room.name !== 'W28N15') {
    //   }
	}

	needsHelp(fromCreep) {
		return false;
	}

  shouldSpawn(room) {
    return false;
    if (room.name === 'W28N14') {

      const count = _.filter(
        Game.creeps,
        creep => creep.memory.role == 'drainer' && creep.memory.room == room.name
      ).length;
  
      if (count >= this.POPULATION) return false;
      return true;
    }

    return false;
  }
}
