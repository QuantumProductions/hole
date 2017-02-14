'use strict';

class Clock extends View {
   draw(ctt, x, y, w, h, s) {
    ctt.font = '250pt Courier New';
    ctt.fillStyle = Color.x;
    ctt.textAlign = 'left';
    let xtime = this.time(s.x);
    ctt.fillText(xtime, 0.05 * w, 0.1 * h - 2, 0.5 * w);  
    ctt.fillStyle = Color.o;
    let otime = this.time(s.o);
    ctt.fillText(otime, 0.05 * w, 0.6 * h, 0.5 * w);  
  }

  time(t) {
    let seconds = t / 100;
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    if (sec == 0) {
      sec = "00";
    } else if (sec < 10) {
      sec = "0" + sec;
    }
    return "" + min + ":" + sec;
  }


}