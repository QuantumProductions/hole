"use strict";

class Component {
  constructor(o) {
    this.components = {};
    this.listeners = {};
    this.installDefaults();
    this.init(o);
  }

  grab(name) {
    return this.components[name];
  }
  
  init(o) {}
  interestedTopics() {return [];}
  defaultInstalls() {return []; }

  installDefaults() {
    var defaultClasses = this.defaultInstalls();
    for (var i = 0; i < defaultClasses.length; i++) {
      var klass = defaultClasses[i];
      var comp = new klass();
      this.install(comp.constructor.name, comp);
    }

    for (let topic of this.interestedTopics()) {
      this.addListener(this, topic);
    }
  }

  install(name, c) {
    c.t = this;
    console.log("Installing" + name);
    this.components[name] = c;
    for (let topic of c.interestedTopics()) {
      console.log("Adding listener to component" + c.t);
      this.addListener(c, topic);
    }
  }

  addListener(c, topic) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }

    this.listeners[topic].push(c);
  }

  grab(name) {
    return this.components[name];
  }

  loop() {
    
  }

  loopComponents() {
    var keys = Object.keys(this.components);
    for (let key of keys) {
      var c = this.components[key];
      this.components[key].loop();
    }
  }

  msg(title, body) {
      let listenerGroup = this.listeners[title];
      if (listenerGroup) {
        for (let listener of listenerGroup) {
          listener.handleMessage(title, body);
        } 
      }


      
    let componentKeys = Object.keys(this.components);
    for (let key of componentKeys) {
      var c = this.components[key];
      // console.log("key" + key);
      // console.log(this.components);
      // console.log(c);
      this.components[key].msg(title, body);
    }
  }

  handleMessage(title, body) {

  }

  interestedTopics() {
    return [];
  }
}

class Thing extends Component {
  constructor(options) {
    super(options);
    this.components = {};
    if (options && options['position']) {
      this.x = options['position'][0];
      this.y = options['position'][1];
    } else {
      this.x = 2.0;
      this.y = 2.0; 
    }
    this.mx = 0;
    this.my = 0;
    this.active = true;

    this.init(options);
  }

  afterOutOfBounds() {

  }

  crossedLeft(x) {
    return this.x < x;
  }

  crossedTop(y) {
    return this.y < y;
  }

  crossedRight(x) {
    return this.x > x;
  }

  crossedBottom(y) {
    return this.y > y;
  }

  knows() {
    return [];
  }

  cares() {
    return false;
  }

  can() {
    return false;
  }

  does() {
    return {};
  }

  init(o) {
    if (!o) {
      return;
    }
  }

  speedMod() {
    return 1.0;
  }

  move(dt) {
    lateralMove(this);
  }

  loop(dt) {

  } 

  afterLoop() {
    this.loopComponents();
  }

  speed() {
    return 1.0;
  }

  position() {
    return [this.x, this.y];
  }
}

class Game extends Component {
  constructor(options) {
    super(options);
    this.init(options);
    this.canvas = options['canvas'];
    this.client = options['client'];
    this.resetBoard();
    this.resetGame();
    this.installSounds();

    Thing.lineWidth = 1;
  }

  init(o) {

  }

  installSounds() {
    // var sounder = new Sounder();
    // this.install('sounder', sounder);

    // createjs.Sound.on("fileload", this.handleSoundsLoaded, this);
    // var sfiles = sounder.soundFiles();
    // for (var i = 0; i < sfiles.length; i++) {
    //   var sFile = sfiles[i];
    //   createjs.Sound.registerSound({id:sFile, src:sFile + ".wav"});
    // }

    // this.soundDelay = 0;

  }

  handleSoundsLoaded() {
  }

  parseGamepadInput(playerIndex, input) {
    // if (this.players.length >= playerIndex + 1) {
    //   this.players[playerIndex].msg('input', input);  
    // }
  }

  parseMusicSound(key_pressed_map, key_up_map) {
   
  }

  parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
    //override
  }

  loopKeyboardInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map) {
    this.parseInput(key_down_map, key_up_map, key_pressing_map, key_depressing_map);
  } 

  setupPlayers() {
    this.players = {};
  }

  setupUI() {
    
  }

  resetBoard() {
    this.board = [];
    this.things = {};
  }

  resetGame() {
    this.resetBoard();
    this.setupPlayers();
    this.setupUI();
  }

  add(group_name, thing) {
    if (!this.things[group_name]) {
      this.things[group_name] = [];
    }

    var group = this.things[group_name];
  
    group.push(thing);
  }


  destroyThings(to_destroy, group_name) {
    var group = this.things[group_name];
    if (!group) {
      return [];
    }
    for (var i = 0; i < to_destroy.length; i++) {
      var index = group.indexOf(to_destroy[i]);
      
      if (index >= 0) {
        group.splice(index, 1);
      }
    }
    
    return group;
  }

  outOfBounds(thing) {
    var code = 0;
    var out = 0;
    
    if (thing.crossedLeft(0)) {
      code = 1;
      out = 0;
    } else if (thing.crossedTop(0)) {
      code = 2;
      out = 0;
    } else if (thing.crossedRight(800)) {
      code = 3;
      out = 800;
    } else if (thing.crossedBottom(800)) {
      code = 4;
      out = 800;
    }

    if (code == 0) {
      return 0; 
    }

    return {'out-code' : code, 'coord' : out};
  }

  groupNames() {
    return Object.keys(this.things);    
  }

  handleOutOfBounds(group_name, thing, out) {
    thing.msg('out-of-bounds', out);
    if (thing.r > 360) {
      thing.r -= 360;
    } else if (thing.r < 0) {
      thing.r += 360;
    }
  }

  shouldDestroyThing(group_name, thing) {
    return false;
  }

  checkBounds(group_name, thing) {
    var outCode = this.outOfBounds(thing);
    if (outCode) {
      this.handleOutOfBounds(group_name, thing, outCode); 
    }

    thing.afterOutOfBounds();
  }

  loopInteractions(thing) {
    var knows = thing.knows();
    for (var i = 0; i < knows.length; i++) {
      var kind = knows[i];
      var group = this.things[kind];
      for (var j = 0; j < group.length; j++) {
        var other = group[j];
        if (thing.cares(other)) {
          let can = (thing.can(other));
          if (can) {
            thing.does(other, can);
          }
        }
      }
    }
  }

  groupLoop(group_name, dt) {
    var to_destroy = [];

    var group = this.things[group_name];
    if (group == undefined) {
      return;
    }

    for (var i = 0; i < group.length; i++) {
      var thing = group[i];
      if (thing.active === true) {
        thing.loop(dt, this);
        this.loopInteractions(thing);
        thing.afterLoop();  
      }

      this.checkBounds(group_name, thing);

      if (this.shouldDestroyThing(group_name, thing)) {
        thing.gone = true;
      }

      if (thing.gone) {
        to_destroy.push(thing);
      }

      if (thing.endedRound) {
        return;
      }
    }

    group = this.destroyThings(to_destroy, group_name);     
    this.things[group_name] = group;
  }

  loop(dt) {
    if (this.paused) {
      return;
    }
    var group_names = this.groupNames();

    for (var group_index = 0; group_index < group_names.length; group_index++) {
      this.groupLoop(group_names[group_index], dt);
    }

    if (this.needsReset) {
      this.resetGame();
      this.needsReset = false;
    }
  }

  destroyThingsInRadius(group_name, point, radius) {
    var things = this.things[group_name];
    if (!things) {
      return;
    }
    for (var i = 0; i < things.length; i++) {
      var thing = things[i];
      if (getDistance(thing.position(), point) <= radius) {
        thing.gone = true;
      }
    }
  }

  onMoveComplete(req) {
    this.announceMove(req);
    this.evaluateResolution();
  }

  evaluateResolution() {
    //override
  }

  onKeyUp(key) {
  }

  onKeyDown(key) {

  }

  onMouseUp(x, y) {

  }

  onMouseDown(x, y) {

  }

}

