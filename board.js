"use strict";

class Board extends Component {
  defaultTopics() {
    return ['click'];
  }

  receive(t, b) {
    console.log("clicked x/y", b.x + "/" + b.y);
    //handle walling state here too
    //convert to coordinates, this.t.m('make-move', ..._)
  }
}