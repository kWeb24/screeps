/*jshint esversion: 6 */

import {} from './Prototypes/Prototypes.js';

import Core from './Core/Core.js';
import GlobalCache from './Cache/GlobalCache.js';
import Planner from './Planners/Planner.js';
import RoleManager from './Managers/RoleManager.js';
import SpawnManager from './Managers/SpawnManager.js';
import Utilities from './Utils/Utilities.js';

global.CACHE = new GlobalCache();
global.CORE = new Core();
global.PLANNER = new Planner();
global.ROLE_MANAGER = new RoleManager();
global.SPAWN_MANAGER = new SpawnManager();
global.UTILS = new Utilities();

module.exports.loop = () => CORE.loop();

// TODO: Get shit done

// role tier system
// build builders only if construction site is present
// priority queues

// energyManagers to distribute energy from link spawn and storage to MY_EXTENSIONS

// Spawn meele and ranged when enemy detected

// prefab layouts droppend near core far exits
// core with storage spawns MY_TOWERS
