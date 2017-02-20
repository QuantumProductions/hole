'use strict';

class Info extends View {
  draw(ctt, x, y, w, h, s) {
    ctt.font = '100pt Courier New';
    ctt.fillStyle = Color.text;
    ctt.textAlign = 'left';
    let xal = 0.08 * w;
    let maxWidth = 0.5 * w;
    let status = this.playStatus(s.playing ? s.playing : null);
    ctt.fillText(status, xal, 0.5 * h, w);    
  }

  playStatus(p) {
    switch (p){
      case 0:
        return "Welcome";
      case 1:
        return "Finding Game";
      case 2:
        return "Now Playing";
      default:
        return "MakeWay";
      }
  }


}