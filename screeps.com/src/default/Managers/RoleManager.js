/*jshint esversion: 6 */

console.log('>> Loading RoleManager...');

import Logger from '../Utils/Logger.js';

import Harvester from '../Creeps/Roles/Harvester.js';
import Upgrader from '../Creeps/Roles/Upgrader.js';
import Builder from '../Creeps/Roles/Builder.js';
import Repairer from '../Creeps/Roles/Repairer.js';
import RoadKeeper from '../Creeps/Roles/RoadKeeper.js';

const LOGGER = new Logger({
  enabled: false
});

/**
 * @class RoleManager
 * @classdesc RoleManager class, manages roles
 * @global
 */

export default class RoleManager {

  constructor() {
    /**
    * @member {Object<Harvester>} RoleManager#Harvester
    **/
    this.Harvester = new Harvester();

    /**
    * @member {Object<Builder>} RoleManager#Builder
    **/
    this.Builder = new Builder();

    /**
    * @member {Object<Upgrader>} RoleManager#Upgrader
    **/
    this.Upgrader = new Upgrader();

    /**
    * @member {Object<Repairer>} RoleManager#Repairer
    **/
    this.Repairer = new Repairer();

    /**
    * @member {Object<RoadKeeper>} RoleManager#RoadKeeper
    **/
    this.RoadKeeper = new RoadKeeper();

    /**
    * @member {Array<Role>} RoleManager#Roles
    **/
    this.ROLES = [
      this.RoadKeeper,
      this.Repairer,
      this.Builder,
      this.Upgrader,
      this.Harvester,
    ];
  }

  /**
   * @memberof RoleManager
   * @desc Select role based on current load and needs
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @public
   **/
	selectRole(creep) {
    const matchedRole = this.getCreepRoleReference(creep);

    if (!matchedRole[0].needsHelp(creep) && matchedRole[0].role != 'upgrader') {
      const roleInNeed = this.findRoleInNeed(creep, matchedRole);

      if (roleInNeed) {
        roleInNeed.run(creep);
        LOGGER.note(creep.name + ' (' + creep.memory.role + ') role was changed to: ' + roleInNeed.role, 4);
      } else {
        matchedRole[0].run(creep);
      }
    } else {
      matchedRole[0].run(creep);
    }
	}


  /**
   * @memberof RoleManager
   * @desc Find role that needs help
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @param {Role} matchedRole {@link Role} object
   * @public
   **/
  findRoleInNeed(creep, matchedRole) {
    let selectedRole = false;
    const roleArray = matchedRole[0].capableOf;
    roleArray.forEach((capableOf) => {
      const roleInNeed = this.ROLES.filter(possibleRole => {
        return possibleRole.role === capableOf && possibleRole.needsHelp(creep);
      });

      if (!selectedRole && roleInNeed[0] !== undefined) {
        selectedRole = roleInNeed[0];
      }
    });

    return selectedRole;
  }

  /**
   * @memberof RoleManager
   * @desc Find creep with selected(proposal) Role
   * @param {Creep} creep {@link https://docs.screeps.com/api/#Creep|Screeps Creep} object
   * @public
   **/
  getCreepRoleReference(creep) {
    return this.ROLES.filter(role => {
      return role.role === creep.memory.role;
    });
  }
}
