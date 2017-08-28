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
    var w = canvas.width;
    var squaresize = w / 5;
    var tilesize = squaresize * 0.9;
    var sepsize = squaresize * 0.1;
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