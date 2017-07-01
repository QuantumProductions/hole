'use strict';

class Clock extends View {
   draw(ctt, x, y, w, h, s) {
    this.state = s;
    ctt.font = '250pt Courier New';
    ctt.fillStyle = Color.x;
    ctt.textAlign = 'left';
    let xtime = this.time(s.x.time);
    ctt.fillText(xtime, 0.05 * w, 0.1 * h - 2, 0.5 * w);  
    ctt.fillStyle = Color.o;
    let otime = this.time(s.o.time);
    ctt.fillText(otime, 0.05 * w, 0.6 * h, 0.5 * w);  
  }

  time(t) {
    let min = Math.floor(t / 600);
    let seconds = Math.floor(t / 10);
    var sec = seconds % 60;
    if (sec == 0) {
      sec = "00";
    } else if (sec < 10) {
      sec = "0" + sec;
    }
    return "" + min + ":" + sec;
  }


}