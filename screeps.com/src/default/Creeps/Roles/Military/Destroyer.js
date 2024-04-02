import Role from "../Role.js";

/**
 * @class Destroyer
 * @classdesc Destroyer role class. Removes invader cores
 * @abstract
 * @augments Role
 */

export default class Destroyer extends Role {

  constructor() {
      super();
      this.ROLE = "destroyer";
      this.POPULATION = 4;
      this.GENOME = [MOVE, ATTACK];
      this.MAX_GENOME_LENGTH = 8;
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
      if (!creep.memory.invaderTargetRoom) {
         for (const [dir, exit] of Object.entries(creep.room.memory.exits)) {
            if (
               Memory.rooms[exit] !== undefined && 
               Memory.rooms[exit].scouted === true &&
               Memory.rooms[exit].invaderCore !== false && 
               Memory.rooms[exit].invaderCore !== undefined
               ) {
               creep.memory.invaderTargetRoom = exit;
            }
         }
      } 
      if (creep.memory.toRecycle) {
         if (creep.memory.room === creep.room.name) {
            const spawn = creep.room.find(FIND_MY_SPAWNS);
            if (spawn[0].recycleCreep(creep) === ERR_NOT_IN_RANGE) {
               creep.moveTo(spawn[0]);
            }
         } else {
            creep.moveTo(Game.rooms[creep.memory.room].controller);
         }
         // Game.rooms[creep.memory.room].controller.recycle(creep);
      } else if (creep.memory.invaderTargetRoom !== undefined && creep.room.name !== creep.memory.invaderTargetRoom) {
         const exitPos = creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.invaderTargetRoom));
         creep.moveTo(exitPos);
      } else if (creep.room.name === creep.memory.invaderTargetRoom) {
         const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_INVADER_CORE});
         if (invaderCore.length) {
            if (creep.attack(invaderCore[0]) === ERR_NOT_IN_RANGE) {
               if (creep.moveTo(invaderCore[0]) === ERR_NO_PATH) {
                  creep.memory.toRecycle = true;
                  creep.room.memory.invaderCore.unreachable = true;
               }
            }
         } else {
            creep.memory.toRecycle = true;
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
      const count = _.filter(
         Game.creeps,
         creep => creep.memory.role == 'destroyer' && creep.memory.room == room.name
       ).length;
   
       if (room.memory !== undefined && room.memory.scouted !== true) return false;
   
       let needsDestroyer = false;
   
       for (const [dir, exit] of Object.entries(room.memory.exits)) {
         if (
            Memory.rooms[exit] !== undefined && 
            Memory.rooms[exit].scouted === true &&
            Memory.rooms[exit].invaderCore !== false && 
            Memory.rooms[exit].invaderCore !== undefined &&
            Memory.rooms[exit].invaderCore.unreachable !== true
            ) {
            needsDestroyer = true;
         }
       }
       return needsDestroyer && count < this.POPULATION;
   }
}
