'use strict';

class Display {
  constructor() {
    this.installTime();
    this.installLoops();
    this.installLink();
    this.state = {"board" : [["x", "empty", "empty", "empty", "empty"],
                              ["empty", "empty", "empty", "empty", "empty"],
                              ["empty", "empty", "empty", "empty", "empty"],
                              ["empty", "empty", "empty", "empty", "empty"],
                              ["empty", "empty", "empty", "empty", "o"]]};
    this.cnv = document.querySelector('canvas');
    this.ctt = this.cnv.getContext('2d');
    this.board = new Board(0.2, 0.2, 0.6, 0.6);
  }

  installLink() {
    //N/A for now, todo: http
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
    this.ctt.fillRect(0,0,300,300);
    // this.ctt.beginPath();
    // this.ctt.fillStyle = 'green';
    // this.ctt.fillRect(0,0,this.cnv.width * 0.5, this.cnv.height * 0.75);
    this.board.renderState(this.ctt, this.cnv, this.state.board);
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

    window.requestAnimationFrame(this.loop.bind(this));
  }
}