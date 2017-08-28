'use strict';

class Tile {
  constructor(o) {
    this.kind = o[0];
    this.owner = o[1];
    this.wall = o[2];
    console.log("" + this.kind + "/" + this.owner + "/" + this.wall);
  }
}
