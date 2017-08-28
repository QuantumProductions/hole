"use strict";

class Client {
  styleCanvas(canvas) {
  }

  generateCanvas() {
    
  }

  installRendering() {
    this.installCanvas();
    this.installBuffer();
  }

  installCanvas() {
    this.canvas = this.generateCanvas();
    document.getElementById("game_container").appendChild(this.canvas); 
    Color.setup();
  }

  installBuffer() {
//    this.buffer = this.generateCanvas();
  }

  installInput() {
    this.installMouseInput();
    this.installKeyboardInput();

  }

  installMouseInput() {
    this.canvas.addEventListener("click", this.onMouseDown.bind(this), false);
  }

  installKeyboardInput() {
    window.addEventListener("keydown", this.onKeyDown.bind(this), true);
    window.addEventListener("keyup", this.onKeyUp.bind(this), true);

    this.key_down_map = {};
    this.key_depressing_map = {};
    this.key_pressing_map = {};
    this.key_up_map = {};

    this.key_map = {
      27: 'ESC',
      37: 'L1',
      38: 'U1',
      39: 'R1',
      40: 'D1',
      16: 'A1',
      83: 'L2',
      69: 'U2',
      68: 'D2',
      70: 'R2',
      90: 'A1',
      77: 'M1',
      78: 'S1',
      49: 'DEBUG1',
      50: 'DEBUG2',
      51: 'DEBUG3',
      52: 'DEBUG4'
      

    }
  }

  installTime() {
    this.now, this.dt, this.last = Date.now();
    this.dt = 0.00;

    this.rate = 10;
  }


  installLoops() {
    window.requestAnimationFrame(this.loop.bind(this));
  }

  installMusician() {
    this.musician = new Musician();
  }

  constructor(options) {
    this.installRendering();
    this.installInput();
    this.installMusician();
      soundManager.setup({
       url: '/',

      onready: function() {
        // SM2 has loaded, API ready to use e.g., createSound() etc.
        window.client.completeGameInstall();
      },

      ontimeout: function() {
        // Uh-oh. No HTML5 support, SWF missing, Flash blocked or other issue
      }

    });
  }

  completeGameInstall() {
    this.installGame()
    this.game.gamepadCount = 0;
    this.installTime();
    this.installLoops();
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
      this.game.loop(delta);  
      this.dt -= delta;
    }
    
    this.draw();
    
    this.loopInput();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  loopGamepadInput() {
    var pads = navigator.getGamepads();

    if (pads) {
      for (var i = 0; i < pads.length; i++) {
        var gp = pads[i]; 
        if (!gp) {
          break;
        }
        var x = gp.axes[0];
        var y = gp.axes[1];
        var threshhold = 0.3;
        
        var m = getm(x, y);
        if (m < threshhold) {
          var x2 = gp.axes[2];
          var y2 = gp.axes[3];
          m = getm(x2, y2);
          x = x2;
          y = y2;
        }

        var length = Math.abs(x) + Math.abs(y);
        if (length > 0) {
          x = x/length;
          y = y/length; 
        }
        
        var threshhold = 0.3;
        var r = 0;
        if (m < threshhold) {
          x = 0;
          y = 0;
          m = 0;
        } else {
          m = (m - threshhold) / (1 - threshhold);
          r = getr(x, y); 
          if (r < 0) {
            r += 360;
          }
        }
        
        var input = {'r' : r, 'm': m, 'buttons' : gp.buttons};
        
        this.game.gamepadCount = i;
        this.game.parseGamepadInput(i, input);    
      }
    }
      
  }

  loopInput() {
    this.game.loopKeyboardInput(this.key_down_map, this.key_up_map, this.key_pressing_map, this.key_depressing_map);
    this.loopGamepadInput();
  }

  draw() {
    this.setBackground();

    var group_names = this.game.groupNames();

    for (var group_index = 0; group_index < group_names.length; group_index++) {
      var group = this.game.things[group_names[group_index]];

      for (var i = 0; i < group.length; i++) {
        var thing = group[i];
        if (thing.active) {
          thing.draw(this, this.context());
        }
      }

    }

    
  }

  context() {
    return this.canvas.getContext('2d');
  }

  drawRect(x,y,w,h, colour) {
    this.context().fillStyle = colour;
    this.context().fillRect(x,y,w,h);
  }

  setBackground() {
    this.context().clearRect(0, 0, this.canvas.width, this.canvas.height); //500
    this.context().fillStyle = Color.bg;
    this.context().fillRect(0,0, this.canvas.width, this.canvas.height);
  }


  installGame() {

  }

  onKeyUp(event) {
    this.key_down_map[this.key_map[event.keyCode]] = false;
    this.key_up_map[this.key_map[event.keyCode]] = true;
  }

  onKeyDown(event) { 
    this.key_down_map[this.key_map[event.keyCode]] = true;
    this.key_up_map[this.key_map[event.keyCode]] = false;
  }

  onMouseUp(event) {
    var x = event.layerX;
    var y = event.layerY;
    this.game.onMouseUp(x, y);
  }

  onMouseDown(event) {
    var x = event.layerX;
    var y = event.layerY;
    this.game.onMouseDown(x, y);
  }
}
