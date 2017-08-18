"use strict";

class Player {
  static makeName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      
    return text;
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
      url: "http://localhost:8080/join/" + Player.name,
      onload: this.handleJoin
    });
  }

  handleJoin(res) {
    var j = JSON.parse(JSON.parse(this.responseText));
    console.log("join" + j);
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
    console.log(json.table_id);    
  }

}