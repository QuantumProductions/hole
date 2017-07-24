"use strict";

class PlayerPanel extends Component {
  init(o) {
    this.team = o['team'];
    this.install('clock', new Clock());
    this.install('actions', new Actions());
  }

  interestedTopics() {
    return ['table_update'];
  }

  handleMessage(t, b) {
    if (t.team == this.team) {
      var clock = this.grab('clock');
      clock.time = t.players[t.team].time;
      var actions = this.grab('actions');
      actions.points = t.players[t.team].points;
      //this class only updates data
    }
  }
}

//View?
class PlayerPanelView extends Component {
  init(o) {
    this.install(new PlayerPanel(o));
  }

// after initializing should add its children to interested topics
// and save to an array, iterating through and processing itself +
// each child component
  defaultTopics() {
    return ['draw'];
  }

//old handle message will be replaced with 'process(t, b)'
//handleMessage will only be called by the component handling.
//with other messages passed to its child nodes to handleMessage
  process(t, b) {
    //anonymous function fn calling canvas helper from b with t
    //replaces context = b['context'];
    var clock = this.grab('clock');
    //grab will run recursively, if not found as a key here will
    //check child components
    var time = clock.getDisplayText();
    //render text
    var actions = this.grab('actions');
    var amount = actions.points;
    //render points as boxes
  }

class Dashboard extends Thing {
  init(o) {
    var xPanel = new PlayerPanelView({'team' : "x"};
    this.install('ppv', xPanel);
    var oPanel = new PlayerPanelView({'team' : "o"};
    this.install('ppv', oPanel);
  }
}