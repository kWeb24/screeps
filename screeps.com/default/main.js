module.exports=function(e){var t={};function r(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(s,i,function(t){return e[t]}.bind(null,i));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading Role...");t.default=class{constructor(){this.ROLE="universal",this.POPULATION=2,this.GENOME=[WORK,CARRY,MOVE],this.CAPABLE_OF=[],this.ON_DEMAND=!0,this.USE_ENERGY_DEPOSITS=!0}run(e){}needsHelp(e){return!1}shouldSpawn(){return this.countCreeps()<this.POPULATION}getCreeps(){return _.filter(Game.creeps,e=>e.memory.role==this.ROLE)}countCreeps(){return this.getCreeps().length}dropRoad(e){if(CACHE.ROOMS[e.room.name].getMyConstructionSites().length<10){const t=e.room.lookAt(e.pos);"structure"!=t.type&&"constructionSite"!=t.type&&e.room.createConstructionSite(e.pos,STRUCTURE_ROAD)}}getPrimarySource(e){const t=CACHE.ROOMS[e.name].getSources();let r,s,i=[];for(const e in t){const r=_.filter(Game.creeps,r=>r.memory.primarySource==t[e].id);i.push(r.length)}return i.forEach((e,t)=>{(void 0===r||e<r)&&(r=e,s=t)}),t[s].id}selectSource(e){let t=e.getSources();const r=_.filter(t,t=>t.id==e.memory.primarySource);let s=r[0];return(r.energy<e.carryCapacity||r.ticksToRegeneration>10)&&(s=e.getClosestActiveSource()),s}selectEnergyDeposit(e){const t=CACHE.ROOMS[e.room.name].getContainers(),r=CACHE.ROOMS[e.room.name].getMyStorage()[0];if(void 0!==r&&r.isActive&&r.store[RESOURCE_ENERGY]>=e.carryCapacity)return r;if(void 0!==t){const r=_.filter(t,t=>t.isActive()&&t.store[RESOURCE_ENERGY]>=e.carryCapacity);if(r.length)return r[0]}return!1}harvest(e){e.status("harvesting");let t=this.selectEnergyDeposit(e);!1!==t&&void 0!==t&&this.USE_ENERGY_DEPOSITS?e.withdraw(t,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE&&(e.moveTo(t),e.status("moving")):(t=this.selectSource(e),e.harvest(t)==ERR_NOT_IN_RANGE&&(e.moveTo(t),e.status("moving"))),e.target(t.id)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e){this.ENABLED=e.enabled,this.COLORS={white:"rgb(255, 255, 255)",grey:"rgba(255, 255, 255, 0.6)",light:"rgba(255, 255, 255, 0.2)",red:"rgb(255, 65, 65)",green:"rgb(105, 212, 29)",yellow:"rgb(217, 169, 0)",blue:"rgb(54, 211, 221)",violet:"rgb(212, 29, 127)",black:"rgb(0,0,0)"}}log(e,t=!1){this.buildLog(e,this.COLORS.white,t)}error(e,t=!1){this.buildLog(e,this.COLORS.red,t)}stateChange(e,t=!1){this.buildLog(e,this.COLORS.blue,t)}success(e,t=!1){this.buildLog(e,this.COLORS.green,t)}warning(e,t=!1){this.buildLog(e,this.COLORS.yellow,t)}note(e,t=!1){this.buildLog(e,this.COLORS.grey,t)}finish(e,t=!1){if(!this.ENABLED)return!1;let r=this.buildLadder(t);r+='<span style="padding: 0 5px; background: '+this.COLORS.green+"; color: "+this.COLORS.black+'">'+e+"</span>",console.log(r)}ignore(e,t=!1){if(!this.ENABLED)return!1;let r=this.buildLadder(t);r+='<span style="padding: 0 5px; background: '+this.COLORS.grey+"; color: "+this.COLORS.black+'">'+e+"</span>",console.log(r)}countLoop(e,t=!1){if(!this.ENABLED)return!1;let r=this.buildLadder(t);r+='<span style="padding: 0 5px; background: '+this.COLORS.white+"; color: "+this.COLORS.black+'">'+e+"</span>",console.log(r)}buildLog(e,t,r){if(!this.ENABLED)return!1;let s="";r?(s+=this.buildLadder(r),s+='<span style="color: '+t+'">'+e+"</span>"):s='<span style="color: '+t+'">'+e+"</span>",console.log(s)}buildLadder(e){if(e){let r='<span style="color: '+this.COLORS.light+'">';for(var t=0;t<e;t++)r+="|&nbsp;&nbsp;&nbsp;";return r+="</span>"}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(0));console.log(">> Loading Repairer Role...");t.default=class extends s.default{constructor(){super(),this.ROLE="repairer",this.POPULATION=2,this.GENOME=[WORK,CARRY,MOVE],this.CAPABLE_OF=["upgrader"],this.ON_DEMAND=!1,this.USE_ENERGY_DEPOSITS=!0}run(e){("harvesting"!=e.status()&&0==e.carry.energy||"harvesting"==e.status()&&!e.isEnergyCapFull())&&this.harvest(e),("repairing"!=e.status()&&e.isEnergyCapFull()||"repairing"==e.status()&&e.carry.energy>0||"bored"==e.status()&&e.carry.energy>0||"moving"==e.status()&&e.carry.energy>0)&&this.repair(e),this.dropRoad(e)}repair(e){var t=this.findClosestRepairableStructure(e);e.status("repairing"),t?(e.target(t.id),e.repair(t)==ERR_NOT_IN_RANGE&&(e.moveTo(t),e.status("moving"))):(e.moveTo(Game.flags.BuildersGatherPoint),e.status("bored"),e.target("none"))}needsHelp(e){return!!this.findClosestRepairableStructure(e)}findClosestRepairableStructure(e){return e.pos.findClosestByRange(FIND_STRUCTURES,{filter:e=>e.hits<e.hitsMax/1.3&&e.structureType!=STRUCTURE_WALL&&e.structureType!=STRUCTURE_ROAD})}}},function(e,t,r){e.exports=r(4)},function(e,t,r){"use strict";(function(t){r(6);var s=l(r(9)),i=l(r(11)),o=l(r(13)),n=l(r(15)),a=l(r(20)),u=l(r(21));function l(e){return e&&e.__esModule?e:{default:e}}t.CACHE=new i.default,t.CORE=new s.default,t.PLANNER=new o.default,t.ROLE_MANAGER=new n.default,t.SPAWN_MANAGER=new a.default,t.UTILS=new u.default,e.exports.loop=(()=>CORE.loop())}).call(this,r(5))},function(e,t,r){"use strict";var s;s=function(){return this}();try{s=s||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(s=window)}e.exports=s},function(e,t,r){"use strict";r(7),console.log(">> Loading Prototypes...")},function(e,t,r){"use strict";r(8),console.log(">> Loading Creep prototype..."),Object.assign(Creep.prototype,{injectMemory(e="none",t="none",r="none",s="bored",i="none"){this.memory.role=e,this.memory.job=t,this.memory.target=r,this.memory.status=s,this.memory.primarySource=i}}),Object.assign(Creep.prototype,{remember(e,t){this.memory.key=t}}),Object.assign(Creep.prototype,{forget(e){delete this.memory.key}}),Object.assign(Creep.prototype,{role(){return this.memory.role}}),Object.assign(Creep.prototype,{job(e=!1){if(!e)return this.memory.job;this.memory.job=e}}),Object.assign(Creep.prototype,{target(e=!1){if(!e)return this.memory.target;this.memory.target=e}}),Object.assign(Creep.prototype,{status(e=!1){if(!e)return this.memory.status;this.memory.status=e}}),Object.assign(Creep.prototype,{primarySource(e=!1){if(!e)return this.memory.primarySource;this.memory.primarySource=e}}),Object.assign(Creep.prototype,{isEnergyCapFull(){return this.carry.energy>=this.carryCapacity}})},function(e,t,r){"use strict";console.log(">> Loading Harvester Creep prototype..."),Object.assign(Creep.prototype,{getSources(){return CACHE.ROOMS[this.room.name].getSources()}}),Object.assign(Creep.prototype,{getActiveSources(){return CACHE.ROOMS[this.room.name].getActiveSources()}}),Object.assign(Creep.prototype,{getClosestActiveSource(){return this.pos.findClosestByRange(FIND_ACTIVE_SOURCES)}}),Object.assign(Creep.prototype,{getEnergySinks(){return CACHE.ROOMS[this.room.name].getEnergySinks()}})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=o(r(1)),i=o(r(10));function o(e){return e&&e.__esModule?e:{default:e}}console.log(">> Loading Core...");const n=new s.default({enabled:!1});t.default=class{constructor(){this.PARAM_ADAPTIVE_ROLES=!1,this.LOOP=1,console.log("-- -- CORE_LOGGER_ENABLED: "+n.ENABLED),console.log("-- -- PARAM_ADAPTIVE_ROLES:"+this.PARAM_ADAPTIVE_ROLES),this.Tower=new i.default}loop(){this.clearDeadCreeps(),this.spawnCreeps(),this.Tower.run(),this.runCreeps(),this.LOOP++}clearDeadCreeps(){for(var e in Memory.creeps)Game.creeps[e]||delete Memory.creeps[e]}spawnCreeps(){SPAWN_MANAGER.spawn()}runCreeps(){for(var e in Game.creeps){var t=Game.creeps[e];ROLE_MANAGER.ROLES.forEach(e=>{t.memory.role==e.ROLE&&(this.PARAM_ADAPTIVE_ROLES?ROLE_MANAGER.selectRole(t):e.run(t))})}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading Tower Structure...");t.default=class{constructor(){}run(){for(var e in Game.structures)if(e.structureType==STRUCTURE_TOWER){var t=e;this.findClosestDamagedStructure(t)&&t.repair(closestDamagedStructure);var r=t.pos.findClosestByRange(FIND_HOSTILE_CREEPS);r&&t.attack(r)}}findClosestDamagedStructure(e){return e.pos.findClosestByRange(FIND_STRUCTURES,{filter:e=>e.hits<e.hitsMax})}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(12));console.log(">> Loading Cache module...");t.default=class{constructor(){this.ROOMS=[],this.initRoomCache()}initRoomCache(){for(const e in Game.rooms)void 0===this.ROOMS[e]&&(this.ROOMS[e]=new s.default(Game.rooms[e]))}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading Room Cache module...");t.default=class{constructor(e){this.ROOM=e,this.SOURCES=void 0,this.SOURCES_ACTIVE=void 0,this.CREEPS=void 0,this.MY_CREEPS=void 0,this.HOSTILE_CREEPS=void 0,this.DROPPED_ENERGY=void 0,this.DROPPED_RESOURCES=void 0,this.FLAGS=void 0,this.CONSTRUCTION_SITES=void 0,this.MY_SPAWNS=void 0,this.HOSTILE_SPAWNS=void 0,this.MY_CONSTRUCTION_SITES=void 0,this.HOSTILE_CONSTRUCTION_SITES=void 0,this.MINERALS=void 0,this.NUKES=void 0,this.TOMBSTONES=void 0,this.STRUCTURES=void 0,this.MY_STRUCTURES=void 0,this.HOSTILE_STRUCTURES=void 0,this.ENERGY_SINKS=void 0,this.CONTAINERS=void 0,this.MY_STORAGE=void 0,this.KEEPERLIARS=void 0,this.PORTALS=void 0,this.POWERBANKS=void 0,this.MY_EXTENSIONS=void 0,this.MY_CONTROLLER=void 0,this.MY_EXTRACTOR=void 0,this.MY_LINKS=void 0,this.MY_NUKERS=void 0,this.MY_OBSERVERS=void 0,this.MY_POWERSPAWNS=void 0,this.MY_RAMPARTS=void 0,this.MY_TERMINALS=void 0,this.MY_TOWERS=void 0,this.MY_WALLS=void 0}getSources(){return void 0===this.SOURCES&&(this.SOURCES=this.ROOM.find(FIND_SOURCES)),this.SOURCES}getActiveSources(){return void 0===this.SOURCES_ACTIVE&&(this.SOURCES_ACTIVE=this.ROOM.find(FIND_SOURCES_ACTIVE)),this.SOURCES_ACTIVE}getCreeps(){return void 0===this.CREEPS&&(this.CREEPS=this.ROOM.find(FIND_CREEPS)),this.CREEPS}getMyCreeps(){return void 0===this.MY_CREEPS&&(this.MY_CREEPS=this.ROOM.find(FIND_MY_CREEPS)),this.MY_CREEPS}getHostileCreeps(){return void 0===this.HOSTILE_CREEPS&&(this.HOSTILE_CREEPS=this.ROOM.find(FIND_HOSTILE_CREEPS)),this.HOSTILE_CREEPS}getDroppedEnergy(){return void 0===this.DROPPED_ENERGY&&(this.DROPPED_ENERGY=this.ROOM.find(FIND_DROPPED_ENERGY)),this.DROPPED_ENERGY}getDroppedResources(){return void 0===this.DROPPED_RESOURCES&&(this.DROPPED_RESOURCES=this.ROOM.find(FIND_DROPPED_RESOURCES)),this.DROPPED_RESOURCES}getFlags(){return void 0===this.FLAGS&&(this.FLAGS=this.ROOM.find(FIND_FLAGS)),this.FLAGS}getConstructionSites(){return void 0===this.CONSTRUCTION_SITES&&(this.CONSTRUCTION_SITES=this.ROOM.find(FIND_CONSTRUCTION_SITES)),this.CONSTRUCTION_SITES}getMyConstructionSites(){return void 0===this.MY_CONSTRUCTION_SITES&&(this.MY_CONSTRUCTION_SITES=this.ROOM.find(FIND_MY_CONSTRUCTION_SITES)),this.MY_CONSTRUCTION_SITES}getHostileConstructionSites(){return void 0===this.HOSTILE_CONSTRUCTION_SITES&&(this.HOSTILE_CONSTRUCTION_SITES=this.ROOM.find(FIND_HOSTILE_CONSTRUCTION_SITES)),this.HOSTILE_CONSTRUCTION_SITES}getMySpawns(){return void 0===this.MY_SPAWNS&&(this.MY_SPAWNS=this.ROOM.find(FIND_MY_SPAWNS)),this.MY_SPAWNS}getHostileSpawns(){return void 0===this.HOSTILE_SPAWNS&&(this.HOSTILE_SPAWNS=this.ROOM.find(FIND_HOSTILE_SPAWNS)),this.HOSTILE_SPAWNS}getMinerals(){return void 0===this.MINERALS&&(this.MINERALS=this.ROOM.find(FIND_MINERALS)),this.MINERALS}getNukes(){return void 0===this.NUKES&&(this.NUKES=this.ROOM.find(FIND_NUKES)),this.NUKES}getTombstones(){return void 0===this.TOMBSTONES&&(this.TOMBSTONES=this.ROOM.find(FIND_TOMBSTONES)),this.TOMBSTONES}getStructures(){return void 0===this.STRUCTURES&&(this.STRUCTURES=this.ROOM.find(FIND_STRUCTURES)),this.STRUCTURES}getMyStructures(){return void 0===this.MY_STRUCTURES&&(this.MY_STRUCTURES=this.ROOM.find(FIND_MY_STRUCTURES)),this.MY_STRUCTURES}getHostileStructures(){return void 0===this.HOSTILE_STRUCTURES&&(this.HOSTILE_STRUCTURES=this.ROOM.find(FIND_HOSTILE_STRUCTURES)),this.HOSTILE_STRUCTURES}getEnergySinks(){return void 0===this.ENERGY_SINKS&&(this.ENERGY_SINKS=this.ROOM.find(FIND_STRUCTURES,{filter:e=>(e.structureType==STRUCTURE_SPAWN||e.structureType==STRUCTURE_EXTENSION||e.structureType==STRUCTURE_STORAGE||e.structureType==STRUCTURE_CONTAINER||e.structureType==STRUCTURE_TOWER)&&e.energy<e.energyCapacity})),this.ENERGY_SINKS}getContainers(){if(void 0===this.CONTAINERS){const e=this.getStructures();this.CONTAINERS=_.filter(e,e=>e.structureType==STRUCTURE_CONTAINER)}return this.CONTAINERS}getMyStorage(){if(void 0===this.MY_STORAGE){const e=this.getStructures();this.MY_STORAGE=_.filter(e,e=>e.structureType==STRUCTURE_STORAGE)}return this.MY_STORAGE}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(14));console.log(">> Loading Planner module...");t.default=class{constructor(){this.ROOMS=[],this.initRoomPlanning()}initRoomPlanning(){for(const e in Game.rooms)void 0===this.ROOMS[e]&&Game.rooms[e].controller.my&&(this.ROOMS[e]=new s.default(Game.rooms[e]))}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading RoomPlanner module...");t.default=class{constructor(e){this.ROOM=e,this.PATHS=[],this.planRoads(),this.buildRoads()}planRoads(){this.findPath(this.ROOM.controller.pos,CACHE.ROOMS[this.ROOM.name].getSources()),this.findPath(this.ROOM.controller.pos,CACHE.ROOMS[this.ROOM.name].getMinerals()),this.findPath(this.ROOM.controller.pos,CACHE.ROOMS[this.ROOM.name].getMySpawns())}findPath(e,t){for(const r in t){const s=PathFinder.search(e,{pos:t[r].pos,range:1},{plainCost:1,swampCost:1});this.PATHS.push(s.path)}}buildRoads(){this.PATHS.forEach(e=>{e.forEach(e=>{this.ROOM.lookAt(e).forEach(t=>{"structure"!=t.type&&"constructionSite"!=t.type&&this.ROOM.createConstructionSite(e,STRUCTURE_ROAD)})})})}drawVisuals(){this.PATHS.forEach(e=>{this.ROOM.visual.poly(e,{opacity:1,stroke:"#dfff1b",lineStyle:"dotted"})})}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=l(r(1)),i=l(r(16)),o=l(r(17)),n=l(r(18)),a=l(r(2)),u=l(r(19));function l(e){return e&&e.__esModule?e:{default:e}}console.log(">> Loading RoleManager...");const S=new s.default({enabled:!1});t.default=class{constructor(){this.Harvester=new i.default,this.Builder=new n.default,this.Upgrader=new o.default,this.Repairer=new a.default,this.RoadKeeper=new u.default,this.ROLES=[this.Harvester,this.Builder,this.Upgrader,this.Repairer,this.RoadKeeper]}selectRole(e){const t=this.getCreepRoleReference(e);if(t[0].needsHelp(e)||"upgrader"==t[0].role)t[0].run(e);else{const r=this.findRoleInNeed(e,t);r?(r.run(e),S.note(e.name+" ("+e.memory.role+") role was changed to: "+r.role,4)):t[0].run(e)}}findRoleInNeed(e,t){let r=!1;return t[0].capableOf.forEach(t=>{const s=this.ROLES.filter(r=>r.role===t&&r.needsHelp(e));r||void 0===s[0]||(r=s[0])}),r}getCreepRoleReference(e){return this.ROLES.filter(t=>t.role===e.memory.role)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(0));console.log(">> Loading Harvester Role...");t.default=class extends s.default{constructor(){super(),this.ROLE="harvester",this.POPULATION=3,this.GENOME=[WORK,CARRY,MOVE],this.CAPABLE_OF=["upgrader","builder"],this.ON_DEMAND=!1,this.USE_ENERGY_DEPOSITS=!1}run(e){("harvesting"!=e.status()&&0==e.carry.energy||"harvesting"==e.status()&&!e.isEnergyCapFull())&&this.harvest(e),("transfering"!=e.status()&&e.isEnergyCapFull()||"transfering"==e.status()&&e.carry.energy>0||"moving"==e.status()&&e.carry.energy>0)&&this.transfer(e),this.dropRoad(e)}transfer(e){const t=e.getEnergySinks();e.status("transfering"),t.length>0&&(e.target(t[0].id),e.transfer(t[0],RESOURCE_ENERGY)==ERR_NOT_IN_RANGE&&(e.moveTo(t[0]),e.status("moving")))}needsHelp(e){return!e.isEnergyCapFull()&&e.getSources().length}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(0));console.log(">> Loading Upgrader Role...");t.default=class extends s.default{constructor(){super(),this.ROLE="upgrader",this.POPULATION=2,this.GENOME=[WORK,CARRY,MOVE],this.CAPABLE_OF=["harvester","builder"],this.ON_DEMAND=!1,this.USE_ENERGY_DEPOSITS=!0}run(e){("harvesting"!=e.status()&&0==e.carry.energy||"harvesting"==e.status()&&!e.isEnergyCapFull())&&this.harvest(e),("upgrading"!=e.status()&&e.isEnergyCapFull()||"upgrading"==e.status()&&e.carry.energy>0||"moving"==e.status()&&e.carry.energy>0)&&this.upgrade(e),this.dropRoad(e)}upgrade(e){e.status("upgrading"),e.target(e.room.controller.name),e.upgradeController(e.room.controller)==ERR_NOT_IN_RANGE&&(e.moveTo(e.room.controller),e.status("moving"))}needsHelp(e){return e.carry.energy==e.carryCapacity}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(0));console.log(">> Loading Builder Role...");t.default=class extends s.default{constructor(){super(),this.ROLE="builder",this.POPULATION=1,this.GENOME=[WORK,CARRY,MOVE],this.CAPABLE_OF=["upgrader"],this.ON_DEMAND=!0,this.USE_ENERGY_DEPOSITS=!0}run(e){("harvesting"!=e.status()&&0==e.carry.energy||"harvesting"==e.status()&&!e.isEnergyCapFull())&&this.harvest(e),("building"!=e.status()&&e.isEnergyCapFull()||"building"==e.status()&&e.carry.energy>0||"bored"==e.status()&&e.carry.energy>0||"moving"==e.status()&&e.carry.energy>0)&&this.build(e)}build(e){var t=e.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);e.status("building"),t?e.build(t)==ERR_NOT_IN_RANGE&&(e.moveTo(t),e.status("moving"),e.target(t.id)):(e.moveTo(Game.flags.BuildersGatherPoint),e.status("bored"),e.target("BuildersGatherPoint"))}needsHelp(e){return e.room.find(FIND_CONSTRUCTION_SITES).length}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){return e&&e.__esModule?e:{default:e}}(r(2));console.log(">> Loading Road Keeper...");t.default=class extends s.default{constructor(){super(),this.ROLE="roadKeeper",this.POPULATION=1,this.GENOME=[WORK,CARRY,MOVE,MOVE],this.CAPABLE_OF=["upgrader"],this.ON_DEMAND=!1,this.USE_ENERGY_DEPOSITS=!0}findClosestRepairableStructure(e){return e.pos.findClosestByRange(FIND_STRUCTURES,{filter:e=>e.hits<e.hitsMax/1.3&&e.structureType==STRUCTURE_ROAD})}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading SpawnManager...");t.default=class{constructor(){this.MAX_BODY_PARTS=50}spawn(){ROLE_MANAGER.ROLES.forEach(e=>{if(_.filter(Game.creeps,t=>t.memory.role==e.ROLE),e.shouldSpawn()){const t=e.ROLE+"_"+UTILS.guidGenerator(),r=Game.spawns.CipciaObfita.room,s=this.createAffordableGenome(e,r);if(!s)return!1;Game.spawns.CipciaObfita.createCreep(s,t,{role:e.ROLE,primarySource:e.getPrimarySource(r)})}})}createAffordableGenome(e,t){const r=t.energyAvailable;t.energyCapacityAvailable;let s=0,i=[],o=!0;for(;s<r&&o;)e.GENOME.forEach(e=>{let t=0;"carry"==e&&(t=BODYPART_COST[MOVE]),s+BODYPART_COST[e]+t<r?(i.push(e),s+=BODYPART_COST[e]):o=!1});return!(i.length<e.GENOME.length)&&i}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),console.log(">> Loading Utilities...");t.default=class{constructor(){}guidGenerator(){let e=()=>(65536*(1+Math.random())|0).toString(16).substring(1);return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}}}]);