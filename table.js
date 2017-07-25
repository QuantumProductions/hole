"use strict";

class Table extends Component {
  defaultState() {
    return {tableId: null};
  }

  defaultInstalls() {
    return [Board, Dashboard, TableProxy];
  }

  loop() {
    if (this.tableId) {
      //var proxy = this.grab('proxy');
      //proxy.getTableInfo(this.tableId);
    }

  }
}