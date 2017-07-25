"use strict";

class Board extends Component {
  setup(o) {
    this.rows = Board.defaultRows();
  }

  defaultTopics() {
    return ['click', 'table_update'];
  }

  receive(t, b) {
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