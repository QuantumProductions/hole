'use strict';

class Display {
  constructor() {
    this.installTime();
    this.installLoops();
    this.getInfo();
    this.state = {"board" : []};
    this.boardCnv = document.getElementById("board");
    this.boardCtt = this.boardCnv.getContext('2d');
    this.actionsCnv = document.getElementById("actions");
    this.actionsCtt = this.boardCnv.getContext('2d');
    this.board = new Board(0, 0, 1, 1);
    this.clock = new Clock(0,0, 1, 1);
    this.actions = new Actions(0, 0, 1, 1);
    this.tableIndex = 0;
  }

  getInfo() {
    http.get({
      url: "http://localhost:8080/info",
      onload: function() { //extract to standard overridable callback
        window.display.state = JSON.parse(JSON.parse(this.responseText));
      }
    });    
  }

  installTime() {
    this.now, this.dt, this.last = Date.now();
    this.dt = 0.00;
    this.rate = 100;
  }

  installLoops() {
    window.requestAnimationFrame(this.loop.bind(this));
  }

  draw() {
    this.boardCtt.beginPath();
    this.boardCtt.fillStyle = Color.bg;
    this.boardCtt.fillRect(0,0,this.boardCnv.width, this.boardCnv.width);

    if (this.state.tableCache) {
      let table = this.state.tableCache[this.tableIndex];
      this.board.renderState(this.boardCtt, this.boardCnv, table.board);
      // this.clock.renderState(this.actionsCtt, this.actionsCnv, table.clock);
      // this.actions.renderState(this.actionsCtt, this.actionsCnv, table.actions);
    
    }
    
  }

  loop() {
    this.now = Date.now();
    var delta  = this.now - this.last;
    this.last = this.now;

    this.dt = this.dt + delta;

    if (this.dt < this.rate) {
      window.requestAnimationFrame(this.loop.bind(this));
      return;
    }

    while (this.dt > this.rate) {
      // this.game.loop(delta);  
      this.dt -= delta;
    }
    
    this.draw();

    this.getInfo();

    window.requestAnimationFrame(this.loop.bind(this));
  }
}