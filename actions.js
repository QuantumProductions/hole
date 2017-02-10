"use strict";

class Actions extends View {
   draw(ctt, x, y, w, h, s) {
    ctt.font = '30pt Courier New';
    ctt.fillStyle = Color.x;
    if (s.current == 'x') {
      let xnow = this.nowmoves(s.x.now);
      ctt.fillText(xnow, (515 / 1200) * w, (80 / 1200) * h);    
    }
    
    let xnext = this.nextmoves(s.x.next);
    ctt.fillText(xnext, (515 / 1200) * w, (152 / 1200) * h);  

    ctt.fillStyle = Color.o;

    if (s.current == 'o') {
      let onow = this.nowmoves(s.o.now);
      ctt.fillText(onow, (372 / 1200) * w, (1075 / 1200) * h);  
    }
    
    let onext = this.nextmoves(s.o.next);
    ctt.fillText(onext, (372 / 1200) * w, (1148 / 1200) * h);  
  }


  nowmoves(n) {
    return "" + n + " moves left";
  }

  nextmoves(n) {
    if (n == 0) {
      n = 2;
    }
    return "" + n + " moves next turn"
  }
}

