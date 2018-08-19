/*jshint esversion: 6 */

import {} from './Prototypes/Prototypes.js';

import Core from './Core/Core.js';
import GlobalCache from './Cache/GlobalCache.js';
import Planner from './Planners/Planner.js';
import RoleManager from './Managers/RoleManager.js';

global.CACHE = new GlobalCache();
global.CORE = new Core();
global.PLANNER = new Planner();
global.ROLE_MANAGER = new RoleManager();

module.exports.loop = () => CORE.loop();
