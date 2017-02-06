"use strict";

class Board {
  static renderState(ctt, cnv, s) {
    const leftX = 0.2 * cnv.width;
    const topY = 0.2 * cnv.width;
    const r = 0.01 * cnv.width;
    const spacing = 0.16 * cnv.width
    ctt.fillStyle = "blue";
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        ctt.beginPath();
        ctt.arc(leftX + spacing * j, topY + spacing * i, r, 0, 2 * Math.PI, false);
        ctt.fill();
      }
    }
    
  }

}