"use strict";

class Board extends Component {
  init(o) {
    this.rows = Board.defaultRows();
    this.canvasId = 'board';
  }

  interestedTopics() {
    return ['click', 'board-update'];
  }

  paint(client, canvas) {
    console.log("Painting in board");
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
    if (t == 'board-update') {
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