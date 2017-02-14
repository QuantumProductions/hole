'use strict';

class Clock extends View {
   draw(ctt, x, y, w, h, s) {
    ctt.font = '120pt Courier New';
    ctt.fillStyle = Color.x;
    let xtime = this.time(s.x);
    ctt.fillText(xtime, (116 / 1200) * w, (150 / 1200) * h);  
    ctt.font = '120pt Courier New';
    ctt.fillStyle = Color.o;
    let otime = this.time(s.o);
    ctt.fillText(otime, (796/1200) * w, (1149/1200) * h);  
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