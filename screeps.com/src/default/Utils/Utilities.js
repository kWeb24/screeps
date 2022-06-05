/*jshint esversion: 6 */

export default class Utilities {

  constructor() {

  }

  guidGenerator() {
    let S4 = () => {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
}
