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
    Player.name = Player.makeName();
    this.status = {};
    http.get({
      url: "http://localhost:8080/join/" + Player.name,
      onload: this.handleJoin.bind(this)
    });
  }

  handleJoin(res) {
    var json = JSON.parse(JSON.parse(this.responseText));
    console.log("join" + j);
    console.log(j.name);
    this.status.auth = j.auth;
    this.status.name = j.name;
    // this.status.status = "searching";
    this.getPlayerInfo();
  }

  getPlayerInfo() {
    let name = this.status.name;
    console.log("Getting player info: " + name);
    http.get({
      url: "http://localhost:8080/player/status/" + name,
      onload: this.handlePlayerInfo.bind(this);
        console.log(this.responseText);
        window.display.handlePlayerInfo(JSON.parse(JSON.parse(this.responseText)));
      }
    })
  }
}