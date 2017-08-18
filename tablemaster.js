"use strict";

class TableMaster {
  static getTableInfo(t, table_id) {
    //network request
    //t.m('table-update', ..);

    http.get({
      url: "http://localhost:8080/tables/status/" + tableName,
      onload: this.handleTableInfo.bind(this)
    });    
  }

  handleTableInfo(res) {
    var json = JSON.parse(res);
    t.m('table-update', json);
  }

  static emptyTable() {
    return new Table();
  }
}