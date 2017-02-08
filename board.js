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
        this.drawTile(x + (j * size), y + (i * size), s[i][j], ctt, size);
      }
    }
  }

  drawTile(x, y, tile, ctt, size) {
    ctt.beginPath();
    let owner = tile.owner;
    ctt.fillStyle = Color[owner]; 
    ctt.fillRect(x + 0.05 * size, y + 0.05 * size, size * 0.9, size * 0.9);

    let ridge = false;
    let recent = false;
    if (tile.status == "ridge_recent") {
      ridge = true;
      recent = true;
    } else if (tile.status == "recent") {
      recent = true;
    } else if (tile.status == "ridge") {
      ridge = true;
    }

    ctt.beginPath();
    if (recent) {
      ctt.fillRect(x + 0.4 * size, y + 0.4 * size, size * 0.2, size * 0.2);
      ctt.fill();
    }
  }
}