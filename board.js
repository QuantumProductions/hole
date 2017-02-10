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
    let spawn = false;
    if (tile.status == "ridge_recent") {
      ridge = true;
      recent = true;
    } else if (tile.status == "recent") {
      recent = true;
    } else if (tile.status == "ridge") {
      ridge = true;
    } else if (tile.status == "spawn") {
      spawn = true;
    }
    
    if (recent || spawn) {
      ctt.beginPath();
      ctt.strokeStyle = Color.recent;
      if (tile.owner == 'x') {
        ctx.moveTo(x + 1/3 * size, y + 1/3 * size);
        ctx.lineTo(x + 2/3 * size, y + 2/3 * size);
        ctx.moveTo(x + 2/3 * size, y + 1/3 * size);
        ctx.lineTo(x + 1/3 * size, y + 2/3 * size);
        ctx.stroke();
      } else if (tile.owner == 'o') {
        ctx.lineWidth = 2;
        ctt.arc(x + (0.5 * size), y + 0.5 * size, 1/4 * size, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      // ctt.fillRect(x + 0.4 * size, y + 0.4 * size, size * 0.2, size * 0.2);

      ctt.fill();
    }

    if (ridge) {
      ctt.beginPath();
      var centerMargin = 0.3* size;

      var wallSize = 0.1 * size;
      var topLeft = [x + wallSize, y + wallSize];
      var bottomLeft = [x + wallSize, y + size - wallSize];
      var topRight = [x + size - wallSize, y  +wallSize];
      var bottomRight = [x + size - wallSize, y  + size - wallSize];

      ctt.beginPath();
      ctt.moveTo(topLeft[0], topLeft[1]);
      ctt.lineTo(bottomLeft[0], bottomLeft[1]);
      ctt.lineTo(bottomRight[0], bottomRight[1]);
      ctt.lineTo(topRight[0], topRight[1]);
      ctt.lineTo(topLeft[0], topLeft[1]);
      ctt.strokeStyle = Color.ridge;
      ctt.stroke();
      ctt.closePath();
    } else if (tile.wall != "none") {
      this.drawWall(x, y, tile.wall, ctt, size);
    }
  }

  drawWall(x, y, direction, ctt, size) {
    var wallOrigin = null;
    var wallEnd = null;
    var wallSize = 0.1 * size;
    var topLeft = [x + wallSize, y + wallSize];
    var bottomLeft = [x+ wallSize, y + size - wallSize];
    var topRight = [x + size - wallSize, y + wallSize];
    var bottomRight = [x + size - wallSize, y + size - wallSize];

    if (direction == "west") {
      wallOrigin = bottomLeft;
      wallEnd = topLeft;
    } else if (direction == "south") {
      wallOrigin = bottomLeft;
      wallEnd = bottomRight;
    } else if (direction == "east") {
      wallOrigin = bottomRight;
      wallEnd = topRight;
    } else if (direction == "north") {
      wallOrigin = topRight;
      wallEnd = topLeft;
    }

    ctt.beginPath();
    ctt.moveTo(wallOrigin[0], wallOrigin[1]);
    ctt.lineTo(wallEnd[0], wallEnd[1]);
    ctt.strokeStyle = Color.wall;
    ctt.lineWidth = 2;
    ctt.stroke();
    ctt.closePath();
    ctt.lineWidth = 1;
  }
}