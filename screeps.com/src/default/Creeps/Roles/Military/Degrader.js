import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Degrader extends Role {

  constructor() {
      super();
      this.ROLE = "degrader";
      this.POPULATION = 1;
      this.GENOME = [CLAIM, MOVE];
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
      const flag = Game.flags['Degrade'];
      if (!flag) {
         if (creep.room.name != creep.memory.room) {
            creep.moveTo(Game.rooms[creep.memory.room].controller);
         } else {
            const spawn = creep.room.find(FIND_MY_SPAWNS);
            if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
               creep.moveTo(spawn[0], { reusePath: 10 });
            }
         }
         return false;
      }
      if (flag.room === undefined) {
         creep.moveTo(flag);
      } else if (creep.room.name != flag.room.name) {
         creep.moveTo(flag);
      } else {
         if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
         }
      }
	}

   /**
   * @memberof Destroyer
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

   shouldSpawn(room) {
      return false;
      const flag = Game.flags['Degrade'];
      if (!flag || (room.name !== 'W28N14' && room.name !== 'W28N13')) return false;

      const count = _.filter(
         Game.creeps,
         creep => creep.memory.role == 'degrader' && creep.memory.room == room.name
      ).length;

      return count < this.POPULATION;
   }
}
