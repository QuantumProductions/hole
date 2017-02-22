'use strict';

class Display {
  constructor() { 
    this.installTime();
    this.installLoops();
    this.getInfo();
    this.state = {"board" : []};
    this.boardCnv = document.getElementById("board");
    this.boardCnv.addEventListener("click", this.clicked.bind(this), false);
    this.boardCtt = this.boardCnv.getContext('2d');
    this.actionsCnv = document.getElementById("actions");
    this.actionsCtt = this.actionsCnv.getContext('2d');
    this.infoCnv = document.getElementById("info");
    this.infoCtt = this.infoCnv.getContext('2d');
    this.info = new Info(0, 0, 1, 1);
    this.infoCnv.addEventListener("click", this.infoClicked.bind(this), false);
    this.board = new Board(0, 0, 1, 1);
    this.clock = new Clock(0,0, 1, 1);
    this.actions = new Actions(0, 0, 1, 1);
    this.resetStatus();
    this.name = this.makeName();
    this.fresh = true;
  }

  resetStatus() {
    this.status = {tableName: "", playing: 0};
  }

  infoClicked(e) {
    let rect = this.infoCnv.getBoundingClientRect();
    let y = (1 + Math.floor((e.clientY - rect.top) / (rect.height / 3)));
    switch (y) {
      case 1:
        if (!this.isPlaying()) {
          this.join();
        } else if (this.status.playing == 1) {
          this.cancel();
        }
      default:
        return;
    }
  }

  isPlaying() {
    return this.status.playing == 1 || this.status.playing == 2;
  }

  // 0 not joined
  // 1 finding, 2 playing, 3 finished

  clicked(e) {
    let rect = this.boardCnv.getBoundingClientRect();
    let r  = {x: 1 + Math.floor((e.clientX - rect.left) / (rect.width / 5)), 
      y: 1 + Math.floor((e.clientY - rect.top) / (rect.height / 5))};
    console.log("R pos" + JSON.stringify(r));
    //calculate tile
    this.makeMove(r);
  }

  makeMove(r) { 
    if (r.x > 5) {
      r.x = 5;
    }
    if (r.y > 5) {
      r.y = 5;
    }
    if (r.x < 0) {
      r.x = 0;
    }
    if (r.y < 0) {
      r.y = 0;
    }
    let coords = "" + r.x + "/" + r.y;
    let url = "play/" + this.status.tableName + "/" + this.name + "/" + this.status.auth + "/" + this.status.team + "/" + "take/" + coords;
    
    console.log(url);
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        console.log("move response" + this.responseText);
        window.display.assignState(JSON.parse(JSON.parse(this.responseText)));
      }
    });
  }

  cancel() {
    let url = "cancel_join/" + this.name +"/" + this.status.auth;
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        console.log("cancel response" + this.responseText);
        window.display.resetStatus();
      }
    }); 
  }

  onMouseUp(e) {
    console.log(e);
  }

  makeName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      
    return text;
  }

  getInfo() {
    http.get({
      url: "http://localhost:8080/info",
      onload: function() {
        window.display.assignState(JSON.parse(JSON.parse(this.responseText)));
      }
    });    
  }

  join() {
    http.get({
      url: "http://localhost:8080/join/" + this.name,
      onload: function() {
        window.display.handleJoin(JSON.parse(JSON.parse(this.responseText)));
      }
    })
  }

  handleJoin(j) {
    this.status.auth = j.auth;
    this.status.playing = 1;
    // console.log("status" + JSON.stringify(this.status));
  }

  assignState(s) {
    this.state = s;

    if (!this.state.tableCache) {
      return;
    }
    let tables = this.state.tableCache;
    let tablePids = Object.keys(tables);
    for (let pid of tablePids) {
      let table = tables[pid];
      if (table.debug) {
        return;
      }
      let seats = table.seats;
      if (seats.x == this.name) {
        this.status.tableName = pid;
        this.status.team = "x";
        this.status.playing = 2;
        return;
      } else if (seats.o == this.name) {
        this.status.tableName = pid;
        this.status.team = "o";
        this.status.playing = 2;
        return;
      }
    }
  }

  installTime() {
    this.now, this.dt, this.last = Date.now();
    this.dt = 0.00;
    this.rate = 1000;
  }

  installLoops() {
    setTimeout(this.loop.bind(this), 500);
    setTimeout(this.draw.bind(this), 16);
  }

  draw() {
    this.boardCtt.fillStyle = Color.bg;
    this.boardCtt.fillRect(0,0,this.boardCnv.width, this.boardCnv.width);
    this.actionsCtt.fillStyle = Color.actions;
    this.actionsCtt.fillRect(0,0,this.actionsCnv.width, this.actionsCnv.height);
    this.infoCtt.fillStyle = Color.info;
    this.infoCtt.fillRect(0,0,this.infoCnv.width, this.infoCnv.height);

    if (this.state.tableCache) {
      let table = this.state.tableCache[this.status.tableName];
      if (table) {
        this.board.renderState(this.boardCtt, this.boardCnv, table.board);
        this.clock.renderState(this.actionsCtt, this.actionsCnv, table.clock);
        this.actions.renderState(this.actionsCtt, this.actionsCnv, table.actions);      
      }      
      this.info.renderState(this.infoCtt, this.infoCnv, this.status);
    }

   
    setTimeout(this.draw.bind(this), 16); 
  }

  loop() {
    this.getInfo();
    setTimeout(this.loop.bind(this), 500);
  }
}