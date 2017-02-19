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
    this.board = new Board(0, 0, 1, 1);
    this.clock = new Clock(0,0, 1, 1);
    this.actions = new Actions(0, 0, 1, 1);
    this.tableName = "";
    this.status = {};
    this.name = this.makeName();
    this.fresh = true;
  }

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
    let url = "play/" + this.status.tablePid + "/" + this.name + "/" + this.status.auth + "/" + this.status.team + "/" + "take/" + coords;
    
    console.log(url);
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        console.log("move response" + this.responseText);
        //window.display.assignState(JSON.parse(JSON.parse(this.responseText)));
      }
    });
  }


  setupMouse() {
    this.boardCnv.onMouseUp = function(e) {
      console.log('hi');
    }

    console.log(this.boardCnv);
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

  click(e) {
    console.log(e);
  }

  handleJoin(j) {
    this.status.auth = j.auth;
    console.log("status" + JSON.stringify(this.status));
  }

  assignState(s) {
    this.state = s;
    if (this.fresh) {
      this.fresh = false;
      this.join();
    }
    console.log(s);
    if (!this.state.tableCache) {
      return;
    }
    let tables = this.state.tableCache;
    let tablePids = Object.keys(tables);
    for (let pid of tablePids) {
      let table = tables[pid];
      let seats = table.seats;
      if (seats.x == this.name) {
        console.log("Seat is X" + pid);
        this.tableName = pid;
        return;
      } else if (seats.o == this.name) {
        console.log("Seat is O" + pid);
        this.tableName = pid;
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

    if (this.state.tableCache) {
      let table = this.state.tableCache[this.tableName];
      if (table) {
        this.board.renderState(this.boardCtt, this.boardCnv, table.board);
        this.clock.renderState(this.actionsCtt, this.actionsCnv, table.clock);
        this.actions.renderState(this.actionsCtt, this.actionsCnv, table.actions);      
      }
      
    }
    setTimeout(this.draw.bind(this), 16); 
  }

  loop() {
    this.getInfo();
    setTimeout(this.loop.bind(this), 500);
  }
}