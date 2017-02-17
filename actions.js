"use strict";

class Actions extends View {
   draw(ctt, x, y, w, h, s) {
    ctt.font = '150pt Courier New';
    ctt.fillStyle = Color.x
    ctt.textAlign = 'left';

    let xal = 0.08 * w;
    let maxWidth = 0.5 * w;
    if (s.current == 'x') {
      let xnow = this.nowmoves(s.x.now);
      ctt.fillText(xnow, xal, 0.2 * h, maxWidth * 1.06);    
    }
    
    let xnext = this.nextmoves(s.x.next);
    ctt.fillText(xnext, xal, 0.4 * h, maxWidth * 1.5);  

    ctt.fillStyle = Color.o;

    if (s.current == 'o') {
      let onow = this.nowmoves(s.o.now);
      ctt.fillText(onow, xal, 0.7 * h, maxWidth * 1.06);  
    }
    
    let onext = this.nextmoves(s.o.next);
    ctt.fillText(onext, xal, 0.9 * h, maxWidth * 1.5);  
  }


  nowmoves(n) {
    return "" + n + " moves left";
  }

  nextmoves(n) {
    n = n + 2;
    if (n > 4) {
      n = 4;
    }
    return "" + n + " moves next turn"
  }
}

