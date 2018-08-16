/*jshint esversion: 6 */

export default class Logger {

  constructor(params) {
    this.ENABLED = params.enabled;
    this.COLORS = {
      white: 'rgb(255, 255, 255)',
      grey: 'rgba(255, 255, 255, 0.6)',
      light: 'rgba(255, 255, 255, 0.2)',
      red: 'rgb(255, 65, 65)',
      green: 'rgb(105, 212, 29)',
      yellow: 'rgb(217, 169, 0)',
      blue: 'rgb(54, 211, 221)',
      violet: 'rgb(212, 29, 127)',
      black: 'rgb(0,0,0)'
    };
  }

  log(log, lvl = false) {
    this.buildLog(log, this.COLORS.white, lvl);
  }

  error(error, lvl = false) {
    this.buildLog(error, this.COLORS.red, lvl);
  }

  stateChange(log, lvl = false) {
    this.buildLog(log, this.COLORS.blue, lvl);
  }

  success(log, lvl = false) {
    this.buildLog(log, this.COLORS.green, lvl);
  }

  warning(log, lvl = false) {
    this.buildLog(log, this.COLORS.yellow, lvl);
  }

  note(log, lvl = false) {
    this.buildLog(log, this.COLORS.grey, lvl);
  }

  finish(log, lvl = false) {
    if (!this.ENABLED) return false;
    let html = this.buildLadder(lvl);
    html += '<span style="padding: 0 5px; background: ' + this.COLORS.green + '; color: ' + this.COLORS.black + '">' + log + '</span>';
    console.log(html);
  }

  ignore(log, lvl = false) {
    if (!this.ENABLED) return false;
    let html = this.buildLadder(lvl);
    html += '<span style="padding: 0 5px; background: ' + this.COLORS.grey + '; color: ' + this.COLORS.black + '">' + log + '</span>';
    console.log(html);
  }

  countLoop(log, lvl = false) {
    if (!this.ENABLED) return false;
    let html = this.buildLadder(lvl);
    html += '<span style="padding: 0 5px; background: ' + this.COLORS.white + '; color: ' + this.COLORS.black + '">' + log + '</span>';
    console.log(html);
  }

  buildLog(log, color, lvl) {
    if (!this.ENABLED) return false;
    let html = '';
    if (!lvl) {
      html = '<span style="color: ' + color + '">' + log + '</span>';
    } else {
      html += this.buildLadder(lvl);
      html += '<span style="color: ' + color + '">' + log + '</span>';
    }

    console.log(html);
  }

  buildLadder(lvl) {
    if (lvl) {
      let html = '<span style="color: ' + this.COLORS.light + '">';
      for (var i = 0; i < lvl; i++) {
        html += '|&nbsp;&nbsp;&nbsp;';
      }
      html += '</span>';
      return html;
    }
  }
}
