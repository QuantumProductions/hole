'use strict';

class Display {
  constructor() {
    this.installTime();
    this.installLoops();
    this.getInfo();
    this.state = {"board" : []};
    this.cnv = document.querySelector('canvas');
    this.ctt = this.cnv.getContext('2d');
    this.board = new Board(0.2, 0.2, 0.6, 0.6);
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
    this.ctt.beginPath();
    this.ctt.fillStyle = Color.bg;
    this.ctt.fillRect(0,0,1200,1200);

    if (this.state.tableCache) {
      let table = this.state.tableCache[this.tableIndex];

      this.board.renderState(this.ctt, this.cnv, table.board);
      this.clock.renderState(this.ctt, this.cnv, table.clock);
      this.actions.renderState(this.ctt, this.cnv, table.actions);
    
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