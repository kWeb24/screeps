/*jshint esversion: 6 */

console.log('>> Loading RoleManager...');

import Logger from '../Utils/Logger.js';

import Harvester from '../Creeps/Roles/Harvester.js';
import Upgrader from '../Creeps/Roles/Upgrader.js';
import Builder from '../Creeps/Roles/Builder.js';
import Repairer from '../Creeps/Roles/Repairer.js';

const LOGGER = new Logger({
  enabled: false
});

export default class RoleManager {

  constructor() {
    this.Harvester = new Harvester();
    this.Builder = new Builder();
    this.Upgrader = new Upgrader();
    this.Repairer = new Repairer();

    this.ROLES = [
      this.Harvester,
      this.Builder,
      this.Upgrader,
      this.Repairer
    ];
  }

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

  getCreepRoleReference(creep) {
    return this.ROLES.filter(role => {
      return role.role === creep.memory.role;
    });
  }
}
