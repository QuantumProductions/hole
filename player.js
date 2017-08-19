"use strict";

class Player extends Component {
  static makeName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      
    return text;
  }

  interestedTopics() {
    return [];
  }

  

  static main() {
    if (Player.p1) {
      return Player.p1;
    }

    Player.p1 = new Player();
    return Player.p1;
  }

  join() {
    this.name = Player.makeName();
    this.status = {};
    Callback.hell = this;
    http.get({
      url: "http://localhost:8080/join/" + this.name,
      onload: this.handleJoin
    });
  }

  init() {
    this.name = null;
    this.status = {};
    Player.main = this;
  }

  handleJoin(res) {
    var j = JSON.parse(JSON.parse(this.responseText));
    // console.log("join" + j);
    // console.log(this.responseText);
    console.log(j.name);
    Callback.hell.status.auth = j.auth;
    Callback.hell.status.name = j.name;
    Callback.hell.getPlayerInfo();
  }

  getPlayerInfo() {
    let name = this.status.name;
    console.log("Getting player info: " + name);
    http.get({
      url: "http://localhost:8080/player/status/" + name,
      onload: this.handlePlayerInfo
    })
  }

  handlePlayerInfo(res) {
    console.log("player info" + this.responseText);
    console.log(res);
    var json = JSON.parse(JSON.parse(this.responseText));
    if (json.table_id) {
      console.log("Table_id" + json.table_id);
      this.tableId = json.table_id;
      this.t.m('got-table-id', this);
    } else if (json.status) {
      console.log("Joined Player Status" + json.status);
      //loop until challenge is met
    }
    console.log(Player.main().status);

  }

}