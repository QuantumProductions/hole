'use strict';

class GameClient extends Client {
  existingCanvases() {
    return [["board", Color.boardBg]];
  }

}