"use strict";

class Board extends Component {
  init(o) {
    this.rows = Board.defaultRows();
    this.canvasId = 'board';
  }

  interestedTopics() {
    return ['click', 'board-update', 'draw'];
  }

  paint(canvas, context) {
    // if (!this.rows) {
    //   return;
    // }
    var w = canvas.width;
    var squaresize = w / 5;
    var tilesize = squaresize * 0.96;
    var sepsize = squaresize * 0.04;
    var halfsep = sepsize * 0.5;
    var size = this.rows.length;
    var x = 0;
    var y = 0;
    context.fillStyle = Color.outline;
    for (var i = 0; i < size + 1; i++) {
      context.beginPath();
      context.moveTo(0, y - halfsep);
      context.lineTo(canvas.width, y - halfsep);
      context.lineTo(canvas.width, y + halfsep);
      context.lineTo(0, y + halfsep);
      context.lineTo(0, y);
      context.fill();
      y += squaresize;
    }
    y = 0;
    for (var i = 0; i < size + 1; i++) {
      context.beginPath();
      context.moveTo(x - halfsep, 0);
      context.lineTo(x + halfsep, 0);
      context.lineTo(x + halfsep, canvas.height);
      context.lineTo(x - halfsep, canvas.height);
      context.lineTo(x - halfsep, 0);
      context.fill();
      x += squaresize;
    }

    for (var i = 0; i < size; i++) {
      var row = this.rows[i];
      if (!row) { return;}
      for (var j = 0; j < row.length; j++) {
        var tileData = row[j];
        this.drawTile(tileData, j, i, context, canvas);
      }
    }
  }

  drawTile(tileData, x, y, context, canvas) {
    var w = canvas.width;
    var squaresize = w / 5;
    var tilesize = squaresize * 0.96;
    var sepsize = squaresize * 0.04;
    var halfsep = sepsize * 0.5;

    context.beginPath();
    context.fillStyle = tileData.bgColor();

    var UL = [(x * squaresize) + halfsep, y * squaresize + halfsep];
    var UR = [((x + 1) * squaresize) - halfsep, (y * squaresize) + halfsep];
    var BR = [((x + 1) * squaresize) - halfsep, ((y + 1) * squaresize) - halfsep];
    var BL = [((x * squaresize) + halfsep), ((y + 1) * squaresize) - halfsep];

    context.moveTo(UL[0], UL[1]);
    context.lineTo(UR[0], UR[1]);
    context.lineTo(UR[0], UR[1]);
    context.lineTo(BR[0], BR[1]);
    context.lineTo(BL[0], BL[1]);
    context.lineTo(UL[0], UL[1]);
    context.fill();
  }

  assignRows(json) {
    this.rows = [];
    for (var jrow of json) {
      var row = [];
      for (var jtile of jrow) {
        row.push(new Tile(jtile));
      }
      this.rows.push(row);
    }
  }

  handleMessage(t, b) {
    if (t == 'draw') {
      if (b.canvas.id != this.canvasId) { return; }
      this.paint(b.canvas, b.context);
    } else if (t == 'board-update') {
      this.assignRows(b);
    }
    return;
    if (t == 'click') {
      console.log("clicked x/y", b.x + "/" + b.y);
      //handle walling state here too
      //convert to coordinates, this.t.m('make-move', ..._)
    } else {
      this.rows = b.rows;
    }
  }

  static defaultRows(n, rows) {
    var rows = [];
    for (var i = 0; i < 5; i++) {
      rows.push(Board.defaultRow());
    }
    return rows;
  }

  static defaultRow() {
    var row = [];
    for (var i = 0; i < 5; i++) {
      row.push(Board.defaultTile());
    }
  }

  static defaultTile() {
    return {owner: null, status: "empty", wall: null};
  }
}