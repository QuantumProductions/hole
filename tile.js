'use strict';

class Tile {
  constructor(o) {
    this.kind = o[0];
    this.owner = o[1];
    this.wall = o[2];
  }
}
