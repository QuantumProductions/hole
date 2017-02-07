"use strict";

class Board extends View {
  colors() {
    return {"empty" : "#000000",
            "x" : "#d35400",
            "o" : "#16a085"};
  }

  draw(ctt, x, y, w, h, s) {
    ctt.beginPath();
    ctt.fillStyle = Color.boardBg;
    ctt.fillRect(x,y,w,h);

    const m = w / 30;
    const size = (m * 6);
    
    for (var i = 0; i < s.length; i++) {
      var row = s[i];
      for (var j = 0; j < row.length; j++) {
        let tile = row[j];
        let tileX = x + (j * 5 * m);
        let tileY = y + (i * 5 * m);
        ctt.beginPath();
        ctt.fillStyle = Color[s[i][j]];
        ctt.fillRect(x + j * size + 0.05 * size,y + i * size + 0.05 * size, size * 0.9, size * 0.9);
      }
    }
    
  }
}