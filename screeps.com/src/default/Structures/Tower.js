/*jshint esversion: 6 */

export default class Tower {
  constructor() {}

  run(tower, repairQueue, index) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    tower.room.visual.circle(
      tower.pos,
      {fill: 'transparent', radius: 5, opacity: 0.5, stroke: '#ff0000', lineStyle: 'dashed'}
    );

    tower.room.visual.circle(
      tower.pos,
      {fill: 'transparent', radius: 20, opacity: 0.5, stroke: '#ff0000', lineStyle: 'dashed'}
    );

    if (closestHostile) {
      tower.attack(closestHostile);
    } else {
      if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > tower.store.getCapacity(RESOURCE_ENERGY) / 2) {
        if (repairQueue.length) {
          let target = repairQueue[0];

          if (repairQueue.length >= index) {
            target = repairQueue[index];
          }

          const targetStructure = Game.getObjectById(target);

          tower.repair(targetStructure);
        }
      }
    }
  }
}
