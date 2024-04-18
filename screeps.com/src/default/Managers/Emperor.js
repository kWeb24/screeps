import Governor from './Governor';

/**
 * @class Emperor
 * @classdesc Emperor class, manages colony
 * @global
*/

export default class Emperor {

  constructor() {
    console.log('>> Raising of the new emperor');
    console.log('>> Assigning governors');
    
    this.Governor = new Governor();

    if (!Memory.empire) {
        Memory.empire = {
            
        }
    }
  }

  run() {
    this.runGovernors();
  }

  runGovernors() {
    // clear old room memory objects
    // for (const room in Memory.rooms) {
    //   if (typeof Memory.rooms[room].scouted === 'object') {
    //     delete Memory.rooms[room];
    //   }
    // }

    const orders = [];
    // const orders = Game.market.getAllOrders({type: ORDER_BUY}); //pricy
    // const orders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: RESOURCE_ENERGY});

    for (const room in Game.rooms) {
        const status = this.Governor.run(room, orders);
    }
  }

}
