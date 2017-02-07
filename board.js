"use strict";

class Board extends View {
  colors() {
    return {"empty" : "#000000",
            "x" : "#d35400",
            "o" : "#16a085"};
  }

  draw(ctt, x, y, w, h, s) {
    ctt.fillStyle = "blue";
    const m = w / 30;
    const tileR = (m * 4) / 2;
    
    for (var i = 0; i < s.length; i++) {
      var row = s[i];
      for (var j = 0; j < row.length; j++) {
        let tile = row[j];

        ctt.fillStyle = Color.outline;
        ctt.beginPath();
        ctt.arc(x + (j * (5 * m)), y + (i * (5 *m)), 0.9 * tileR, 2 * Math.PI, false);
        ctt.fill();

        ctt.fillStyle = Color[tile];
        ctt.beginPath();
        ctt.arc(x + (j * (5 * m)), y + (i * (5 *m)), 0.9 * tileR, 2 * Math.PI, false);
        ctt.fill();
      }
    }
    
  }
}