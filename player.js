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
    return ['start', 'make-move'];
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
    this.ticks = 0;
    Player.p1 = this;
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
      Player.p1.tableId = json.table_id;
      Player.p1.t.msg('got-table-id', Player.p1);
    } else if (json.status) {
      console.log("Joined Player Status" + json.status);
    }
    Player.p1.startLooping();
    console.log(Player.main().status);
  }

  startLooping() {
    console.log("initializing looping");
    console.log("Table id is" + this.tableId);   

    setInterval(this.loop.bind(this), Player.tickrate());
  }

  loop() {
    this.ticks++;

    if (!this.tableId && this.ticks > 8) {
      console.log("Checking for game"); 
      this.ticks = 0;
    } else if (this.tableId && this.ticks > 2) {
      this.getTableInfo();
      this.ticks = 0;
    }
  }

  static tickrate() {
    return 250;
  }

  getTableInfo() {
    if (!this.tableId) {
      console.log("No Table Id!! + ERROR");
      return;
    }
    // console.log("Getting table info: " + this.tableId);
    http.get({
      url: "http://localhost:8080/tables/info/" + this.tableId,
      onload: this.handleTableInfo
    })
  }

  handleTableInfo(res) {
    //todo error handle
    var info = JSON.parse(JSON.parse(this.responseText));
    Player.p1.t.msg('got-table-info', info);
  }

  playing() {
    return this.tableId; //todo, status?
  }

  handleMessage(t, b) {
    if (!this.playing()) {return;}
    if (t == 'make-move') {
      http.get({
        url: "http://localhost:8080/tables/play/" + this.tableId + "/" + this.status.name + "/" + this.status.auth + "/" + b.action + "/" + b.x + "/" + b.y,
        onload: this.handleMadeMove
      });     
    }
  }

  handleMadeMove(res) {
    console.log(this.responseText);
  }
}