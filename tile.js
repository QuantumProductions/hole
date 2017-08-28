'use strict';

class Tile {
  constructor(o) {
    this.kind = o[0];
    this.owner = o[1];
    this.wall = o[2];
  }

  bgColor() {
    if (this.owner == 'x') {
      return Color.x;
    } else if (this.owner == 'o') {
      return Color.o;
    }

    return Color.null;
  }
}
