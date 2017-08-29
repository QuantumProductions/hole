'use strict';

class Display extends Component {
  defaultInstalls() {
    return [Player, Board, Clock, Actions];
  }

  interestedTopics() {
    return ['got-table-id', 'got-table-info'];
  }

  parsedPlayers(json) {
    return json;
  }

  handleMessage(title, body) {
    if (title == 'got-table-id') {
      console.log("Received table-id" + body.tableId);
      //begin getting table info on loop
    } else if (title == 'got-table-info') {
      this.msg('board-update', body.board);
      var pp = this.parsedPlayers(body.players);
      this.msg('players-update', pp);
      this.msg('status-update', body.status);
      //send status
      //send players
    }
  }

  init(o) {
    console.log(this.components);
    this.player = this.grab('Player');
    this.player.join();
    console.log(this.player);
  }

  // 0 not joined
  // 1 finding, 2 playing, 3 finished

  clicked(e) {
    console.log(this.status.table_id);
    if (!this.status.table_id) {
      return;
    }
    let rect = this.boardCnv.getBoundingClientRect();
    let r  = {x: 1 + Math.floor((e.clientX - rect.left) / (rect.width / 5)), 
      y: 1 + Math.floor((e.clientY - rect.top) / (rect.height / 5))};
    // console.log("R pos" + JSON.stringify(r));
    //calculate tile
    this.makeMove(r);
  }

  loopKeyboardInput(down, up, pressing, pressed) {
    //
  }
  
}