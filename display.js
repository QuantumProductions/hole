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
    this.tableIndex = 0;
    this.status = {};
    this.name = this.makeName();
    this.fresh = true;
  }

  clicked(e) {
     let rect = this.boardCnv.getBoundingClientRect();
    let r  = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    console.log(r);
    //calculate tile
    this.makeMove(r);
  }

  makeMove(r) { 
    let url = "play/" + this.status.tablePid + "/" + this.name + "/" + this.status.auth + "/" + this.status.team + "/" + "take/" + "2/1";
    
    console.log(url);
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        window.display.assignState(JSON.parse(JSON.parse(this.responseText)));
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
    console.log("hi");
    if (j.queueLength) {
      //
    } else {
      this.status.tablePid = j.tablePid;
      this.status.auth = j.auth;
      this.status.team = j.team;
      console.log("status" + JSON.stringify(this.status));
    }
    
  }

  assignState(s) {
    this.state = s;
    if (this.fresh) {
      this.fresh = false;
      this.join();
    }
  }

  installTime() {
    this.now, this.dt, this.last = Date.now();
    this.dt = 0.00;
    this.rate = 1000;
  }

  installLoops() {
    setTimeout(this.loop.bind(this), 500);
  }

  draw() {
    this.boardCtt.beginPath();
    this.boardCtt.fillStyle = Color.bg;
    this.boardCtt.fillRect(0,0,this.boardCnv.width, this.boardCnv.width);

    if (this.state.tableCache) {
      let table = this.state.tableCache[this.tableIndex];
      this.board.renderState(this.boardCtt, this.boardCnv, table.board);
      this.clock.renderState(this.actionsCtt, this.actionsCnv, table.clock);
      this.actions.renderState(this.actionsCtt, this.actionsCnv, table.actions);    
    }
    
  }

  loop() {
    this.now = Date.now();
    var delta  = this.now - this.last;
    this.last = this.now;

    this.dt = this.dt + delta;



    // if (this.dt < this.rate) {
    //   window.requestAnimationFrame(this.loop.bind(this));
    //   return;
    // }

    
    this.draw();

    this.getInfo();

    setTimeout(this.loop.bind(this), 500);
  }
}