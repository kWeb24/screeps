/*jshint esversion: 6 */
const Logger = require('utils.Logger');

const Harvester = require('role.Harvester');
const Upgrader = require('role.Upgrader');
const Builder = require('role.Builder');

const LOGGER = new Logger();

class RoleManager {

  constructor() {
    this.Harvester = new Harvester();
    this.Builder = new Builder();
    this.Upgrader = new Upgrader();

    this.ROLES = [
      {
        role: 'harvester',
        population: 2,
        genome: [WORK, CARRY, MOVE],
        capableOf: ['upgrader', 'builder'],
        run: (creep) => this.Harvester.run(creep),
        needsHelp: (fromCreep) => this.Harvester.needsHelp(fromCreep)
      },{
        role: 'upgrader',
        population: 1,
        genome: [WORK, CARRY, MOVE],
        capableOf: ['harvester', 'builder'],
        run: (creep) => this.Upgrader.run(creep),
        needsHelp: (fromCreep) => this.Upgrader.needsHelp(fromCreep)
      },{
        role: 'builder',
        population: 1,
        genome: [WORK, CARRY, MOVE],
        capableOf: ['harvester', 'upgrader'],
        run: (creep) => this.Builder.run(creep),
        needsHelp: (fromCreep) => this.Builder.needsHelp(fromCreep)
      },
    ];
  }

	selectRole(creep) {
    const matchedRole = this.getCreepRoleReference(creep);

    if (!matchedRole[0].needsHelp(creep)) {
      const roleInNeed = this.findRoleInNeed(creep, matchedRole);

      if (roleInNeed) {
        roleInNeed.run(creep);
        LOGGER.note(creep.name + ' (' + creep.memory.role + ') role was changed to: ' + roleInNeed.role, 4);
      } else {
        matchedRole[0].run(creep);
        LOGGER.note(creep.name  + ' (' + creep.memory.role + ') not changed', 4);
      }
    } else {
      matchedRole[0].run(creep);
      LOGGER.note(creep.name  + ' (' + creep.memory.role + ') not changed', 4);
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

module.exports = RoleManager;
