'use strict';

class Display extends Component {
  defaultInstalls() {
    return [Player];
  }

  interestedTopics() {
    return ['got-table-id'];
  }

  handleMessage(title, body) {
    if (title == 'got-table-id') {
      console.log("Received table-id" + body.tableId);
    }
  }

  init(o) {
    console.log(this.components);
    this.player = this.grab('Player');
    this.player.join();
    console.log(this.player);
  }

  // constructor() {
  //   super();

  //   return;
  //   this.state = {"board" : []};
  //   this.boardCnv = document.getElementById("board");
  //   this.boardCnv.addEventListener("click", this.clicked.bind(this), false);
  //   this.boardCtt = this.boardCnv.getContext('2d');
  //   this.actionsCnv = document.getElementById("actions");
  //   this.actionsCtt = this.actionsCnv.getContext('2d');
  //   this.infoCnv = document.getElementById("info");
  //   this.infoCtt = this.infoCnv.getContext('2d');
  //   this.info = new Info(0, 0, 1, 1);
  //   this.infoCnv.addEventListener("click", this.infoClicked.bind(this), false);
  //   this.board = new Board(0, 0, 1, 1);
  //   this.clock = new Clock(0,0, 1, 1);
  //   this.actions = new Actions(0, 0, 1, 1);
  //   this.resetStatus();
  //   this.name = this.makeName();
  //   this.team = "none";
  //   this.installTime();
  //   this.installLoops();
  //   this.fresh = true;
  // }

  resetStatus() {
    this.status = {table_id: undefined, status: "newcomer"};
  }

  infoClicked(e) {
    let rect = this.infoCnv.getBoundingClientRect();
    let y = (1 + Math.floor((e.clientY - rect.top) / (rect.height / 3)));
    switch (y) {
      case 1:
        if (!this.isPlaying() && !this.isSearching()) {
          this.join();
        } else if (this.isSearching()) {
          this.cancel();
        }
      default:
        return;
    }
  }

  isSearching() {
    return this.status.status == "searching";
  }

  isPlaying() {
    return this.status.status == "playing";
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

  makeMove(r) { 
    if (r.x > 5) {
      r.x = 5;
    }
    if (r.y > 5) {
      r.y = 5;
    }
    if (r.x < 0) {
      r.x = 0;
    }
    if (r.y < 0) {
      r.y = 0;
    }
    let coords = "" + r.x + "/" + r.y;
    let url = "tables/" + this.status.table_id + "/play/" + this.name + "/" + this.auth + "/" + this.team + "/" + "take/" + coords;
    
    // console.log(url);
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        // console.log("move response" + this.responseText);
        // window.display.assignState(JSON.parse(JSON.parse(this.responseText)));
      }
    });
  }

  cancel() {
    let url = "cancel_join/" + this.name +"/" + this.auth;
    http.get({
      url: "http://localhost:8080/" + url,
      onload: function() {
        console.log("cancel response" + this.responseText);
        window.display.resetStatus();
      }
    }); 
  }

  onMouseUp(e) {
    console.log(e);
  }

  makeName(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      
    return text;
  }

  getTableInfo(tableName) {
    http.get({
      url: "http://localhost:8080/tables/status/" + tableName,
      onload: function() {
        window.display.rt = this.responseText;
        window.display.handleTableInfo(JSON.parse(JSON.parse(this.responseText)));
      }
    });    
  }

  join() {
    http.get({
      url: "http://localhost:8080/join/" + this.name,
      onload: function() {
        console.log("Join res");
        console.log(this.responseText);
        window.display.handleJoin(JSON.parse(JSON.parse(this.responseText)));
      }
    })
  }

  handleJoin(j) {
    console.log("join" + j);
    console.log(j.name);
    this.status.auth = j.auth;
    this.status.name = j.name;
    console.log(this.status.name);
    this.status.status = "searching";
    this.getPlayerInfo();
  }

  getPlayerInfo() {
    let name = this.status.name;
    console.log("Getting player info: " + name);
    http.get({
      url: "http://localhost:8080/player/status/" + name,
      onload: function() {
        console.log(this.responseText);
        window.display.handlePlayerInfo(JSON.parse(JSON.parse(this.responseText)));
      }
    })
  }

  handlePlayerInfo(j) {
    this.player = j;
    if (j.status) {
      if (j.status == "challenger") {
        //
      } //or unknown
    } else if (j.table_id) {
      this.tableId = j.table_id;
      this.getTableInfo(this.tableId);
    }
  }

  handleTableInfo(table) {
    this.table = table;
  }

  assignState(table) {
    console.log(table);
    
    if (table.debug) {
      return;
    }
    
    this.tableCache = table;
    let seats = table.seats;
    if (seats.x == this.name) {
      this.team = "x";
      return;
    } else if (seats.o == this.name) {
      this.team = "o";
      return;
    }
  }

  installTime() {
    this.now, this.dt, this.last = Date.now();
    this.dt = 0.00;
    this.rate = 1000;
  }

  installLoops() {
    setTimeout(this.loop.bind(this), 500);
    setTimeout(this.draw.bind(this), 16);
  }

  drawBoardBackground() {
    this.boardCtt.fillStyle = Color.bg;
    this.boardCtt.fillRect(0,0,this.boardCnv.width, this.boardCnv.width);
  }

  draw() {
    this.drawBoardBackground;
    
    this.actionsCtt.fillStyle = Color.actions;
    this.actionsCtt.fillRect(0,0,this.actionsCnv.width, this.actionsCnv.height);
    this.infoCtt.fillStyle = Color.info;
    this.infoCtt.fillRect(0,0,this.infoCnv.width, this.infoCnv.height);

    this.info.renderState(this.infoCtt, this.infoCnv, this.status);
    // console.log("this.table" + this.table);
      if (this.table) {  
        // console.log(this.table.board);
        this.board.renderState(this.boardCtt, this.boardCnv, this.table.board);
        this.clock.renderState(this.actionsCtt, this.actionsCnv, this.table.actions);
        this.actions.renderState(this.actionsCtt, this.actionsCnv, this.table.actions);      
      } else {
        this.showEmptyBoard();
      }

        // this.actions.renderState(this.actionsCtt, this.actionsCnv, table.actions);      
      // } else if (this.status.table) {
      //   this.board.renderState(this.boardCtt, this.boardCnv, this.status.table.board);
      //   this.clock.renderState(this.actionsCtt, this.actionsCnv, this.status.table.clock);
      // }
    setTimeout(this.draw.bind(this), 16); 
  }

  showEmptyBoard() {
    let nullRow = [null, null, null, null, null];
    // this.board.renderState(this.boardCtt, this.boardCnv, [nullRow, nullRow, nullRow, nullRow, nullRow]);
  }

  getStatus() {
    http.get({
      url: "http://localhost:8080/status/" + this.name,
      onload: function() {
        window.display.handleStatus(JSON.parse(JSON.parse(this.responseText)));
      }
    })   
  }

  handleStatus(json) {
    this.status = json;

    if (this.isPlaying()) {
      console.log("Playing");
    }
  }

  hasTable() {
    return this.tableId;
  }

  loop() {
    if (this.name && this.auth) {
      this.getStatus();  
    }

    let tableId = this.hasTable();
    if (tableId) {
      this.getTableInfo(tableId);
    }
    
    setTimeout(this.loop.bind(this), 500);
  }
}