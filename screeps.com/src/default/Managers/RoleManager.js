/*jshint esversion: 6 */

console.log('>> Loading RoleManager...');

import Logger from '../Utils/Logger.js';

import Harvester from '../Creeps/Roles/Harvester.js';
import Upgrader from '../Creeps/Roles/Upgrader.js';
import Builder from '../Creeps/Roles/Builder.js';
import Repairer from '../Creeps/Roles/Repairer.js';
import RoadKeeper from '../Creeps/Roles/RoadKeeper.js';
import Settler from '../Creeps/Roles/Settler.js';
import Hauler from '../Creeps/Roles/Hauler.js';
import Miner from '../Creeps/Roles/Miner.js';
import Scout from '../Creeps/Roles/Scout.js';
import RemoteHarvester from '../Creeps/Roles/RemoteHarvester.js';
import Manufacturer from '../Creeps/Roles/Manufacturer.js';
import RemoteMiner from '../Creeps/Roles/RemoteMiner.js';

import Destroyer from '../Creeps/Roles/Military/Destroyer.js';
import Thief from '../Creeps/Roles/Military/Thief.js';
import Drainer from '../Creeps/Roles/Military/Drainer.js';
import Janitor from '../Creeps/Roles/Military/Janitor.js';
import Degrader from '../Creeps/Roles/Military/Degrader.js';
import Transporter from '../Creeps/Roles/Transporter.js';

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
    * @member {Object<Settler>} RoleManager#Settler
    **/
    this.Settler = new Settler();

    /**
    * @member {Object<Hauler>} RoleManager#Hauler
    **/
    this.Hauler = new Hauler();

    /**
    * @member {Object<Miner>} RoleManager#Miner
    **/
    this.Miner = new Miner();

    /**
    * @member {Object<Scout>} RoleManager#Scout
    **/
    this.Scout = new Scout();

    /**
    * @member {Object<RemoteHarvester>} RoleManager#RemoteHarvester
    **/
    this.RemoteHarvester = new RemoteHarvester();

    this.Manufacturer = new Manufacturer();

    this.Destroyer = new Destroyer();

    this.Thief = new Thief();

    this.Drainer = new Drainer();
    this.RemoteMiner = new RemoteMiner();
    this.Janitor = new Janitor();
    this.Degrader = new Degrader();
    this.Transporter = new Transporter();

    /**
    * @member {Array<Role>} RoleManager#Roles
    **/
    this.ROLES = [
      this.Settler,
      this.Harvester,
      this.Upgrader,
      this.Hauler,
      this.RemoteHarvester,
      this.Miner,
      this.Builder,
      this.Repairer,
      this.RoadKeeper,
      this.Scout,
      this.Manufacturer,
      this.Destroyer,
      this.Thief,
      this.Drainer,
      this.RemoteMiner,
      this.Janitor,
      this.Degrader,
      this.Transporter
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
