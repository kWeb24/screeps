import Core from './Core/Core.js';
import GlobalCache from './Cache/GlobalCache.js';

global.CACHE = new GlobalCache();
const CORE = new Core();

module.exports.loop = () => CORE.loop();
