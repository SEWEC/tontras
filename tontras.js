const canvas  = document.getElementById("tontras");
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(300, 0, 30, 600);
ctx.font = '48px serif';
ctx.fillText('Lines', 367, 200);
var arr = Array(10).fill(0)
arr.push(1);
arr.unshift(1);
arr.unshift(1);
var board = Array(22).fill().map(x => [...arr])
board.push(Array(13).fill(1))
var numberLines = 0;
ctx.fillText(numberLines.toString(), 408, 270);

var colors = ["black","red","green","yellow","blue","brown","purple","orange"]

var tontraminos = {
  1: {
    type: 1,
    pos: [[5,2], [6,2], [7,2], [8,2]],
    rot: 0,
    rotations: [[[2,-2],[-2,2]],[[1,-1],[-1,1]],[[0,0],[0,0]],[[-1,1],[1,-1]]]
  },
  2: {
    type: 2,
    pos: [[6,3], [6,2], [7,2], [7,3]],
    rot: 0,
    rotations: [[[0,0]],[[0,0]],[[0,0]],[[0,0]]]
  },
  3: {
    type: 3,
    pos: [[6,2], [7,2], [7,3], [8,2]],
    rot: 0,
    rotations: [[[1,-1],[1,1],[-1,1],[-1,-1]],[[0,0],[0,0],[0,0],[0,0]],[[-1,-1],[1,-1],[1,1],[-1,1]],[[-1,1],[-1,-1],[1,-1],[1,1]]]
  },
  4: {
    type: 4,
    pos: [[6,3], [6,2], [7,2], [8,2]],
    rot: 0,
    rotations: [[[0,-2],[2,0],[0,2],[-2,0]],[[1,-1],[1,1],[-1,1],[-1,-1]],[[0,0],[0,0],[0,0],[0,0]],[[-1,1],[-1,-1],[1,-1],[1,1]]]
  },
  5: {
    type: 5,
    pos: [[6,2], [7,2], [8,2], [8,3]],
    rot: 0,
    rotations: [[[1,-1],[1,1],[-1,1],[-1,-1]],[[0,0],[0,0],[0,0],[0,0]],[[-1,1],[-1,-1],[1,-1],[1,1]],[[-2,0],[0,-2],[2,0],[0,2]]]
  },
  6: {
    type: 6,
    pos: [[6,2], [7,2], [7,3], [8,3]],
    rot: 0,
    rotations: [[[2,-1],[-2,1]],[[1,0],[-1,0]],[[0,-1],[0,1]],[[-1,0],[1,0]]]
  },
  7: {
    type: 7,
    pos: [[6,3], [7,3], [7,2], [8,2]],
    rot: 0,
    rotations: [[[1,0],[-1,0]],[[0,-1],[0,1]],[[-1,0],[1,0]],[[-2,-1],[2,1]]]
  }
}

var validKeys = ['a','s','d','j','k'];

var keyBuff = undefined;

document.addEventListener('keydown', function(event) {
  if(!keyBuff || event.key == 'j' || event.key == 'k'){
    validKeys.forEach(key => {
      if(key == event.key){
        keyBuff = key;
      }
    })
  }
});

var defaultTimeDelay = 16;

function gameDelay(loopFunc, args){
  setTimeout(function () {
    loopFunc(...args)
 }, defaultTimeDelay);
}

function drawBox(x,y, color){
  ctx.fillStyle = color;
  ctx.fillRect(x * 30, y * 30, 30, 30);
}

function drawPiece(piece, color){
  for(let i = 0; i < 4; i++){
    drawBox((piece.pos[i][0] - 2),(piece.pos[i][1] - 2), color)
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function randoMino(piece){
  let rand = Math.floor(Math.random()*8);
  if(rand == 0 || piece && rand == piece.type){
    rand = Math.floor(Math.random()*7) + 1;
  }
  return {type: tontraminos[rand].type, pos: tontraminos[rand].pos.map(coordinate => [...coordinate]), rot: 0, rotations: [...tontraminos[rand].rotations]};
}

function drawNextPiece(piece,color) {
  for(let i = 0; i < 4; i++){
    drawBox((piece.pos[i][0] + 7 - (piece.type > 2 ? 0.5 : 0)),(piece.pos[i][1]), color)
  }
}

function canMove(piece,y,x){
  return (board[piece.pos[0][1] + y][piece.pos[0][0] + x] || board[piece.pos[1][1]  + y][piece.pos[1][0] + x] || board[piece.pos[2][1] + y][piece.pos[2][0] + x] || board[piece.pos[3][1] + y][piece.pos[3][0] + x]) == 0
}

function move(piece,y,x){
  for(let i = 0; i < 4; i++){
    piece.pos[i][1] += y
    piece.pos[i][0] += x
  }
}

function canRotate(piece,dir){
  let rotation = mod((piece.rot + (dir == 1 ? 0 : -1)),piece.rotations[0].length);
  let notblocked = 0;
  for(let i = 0; i < 4; i++){
    notblocked ||= board[piece.pos[i][1] + dir * piece.rotations[i][rotation][1]][piece.pos[i][0] + dir * piece.rotations[i][rotation][0]] 
  }
  return notblocked == 0;
}

function rotate(piece,dir){
  let rotation = mod((piece.rot + (dir == 1 ? 0 : -1)),piece.rotations[0].length);
  piece.rot += dir;
  for(let i = 0; i < 4; i++){
    piece.pos[i][1] += dir * piece.rotations[i][rotation][1];
    piece.pos[i][0] += dir * piece.rotations[i][rotation][0];
  }
}

function eraseRotateDraw(piece,dir){
  keyBuff = undefined;
  let canRotatePiece = canRotate(piece,dir);
  if(canRotatePiece){
    drawPiece(piece, colors[0]);
    rotate(piece,dir)
    drawPiece(piece, colors[piece.type]);
  }
}

function eraseMoveDraw(piece, y, x){
  keyBuff = undefined;
  let canMovePiece = canMove(piece,y,x);
  if(canMovePiece){
    drawPiece(piece, colors[0]);
    move(piece,y,x)
    drawPiece(piece, colors[piece.type]);
  }
  return canMovePiece;
}

function clear(lines){
  numberLines += lines.length;
  ctx.fillStyle = colors[0];
  ctx.fillRect(330, 230, 500, 50);
  ctx.fillStyle = "white";
  ctx.fillText(numberLines.toString(), 408 - 10*Math.floor(Math.log10(numberLines)), 270);
  lines.sort((a,b) => a - b)
  for(let i = 0; i < lines.length; i++){
    board.splice(lines[i],1);
    board.unshift([...arr])
    for(let j = 0; j < 10; j++){
      drawBox(j, lines[i] - 2, 'rgba(200,200,200)')
    }
  }
  gameDelay(redrawBoard,[])
}

function redrawBoard(){
  for(let i = 0; i < 20; i++){
    for(let j = 0; j < 10; j++){
      drawBox(j, i, colors[board[i+2][j+2]])
    }
  }
  gameDelay(gameLoop,[])
}

var nextPiece = randoMino();
var piece;
var game = true;
var j = 0;

gameLoop();
function gameLoop() {
  piece = nextPiece;
  drawPiece(piece, colors[piece.type]);
  if (canMove(piece,0,0)){
    drawNextPiece(piece,colors[0]);
    nextPiece = randoMino(piece);
    drawNextPiece(nextPiece,colors[nextPiece.type]);
    keyBuff = undefined;
    dropLoop(piece)
  } else{
    console.log("gameover")
  }
}

function dropLoop(piece){
  let dropping = true;
  if(j == 15 || keyBuff == 's') {
    j = 0;
    keyBuff = 's';
  } else{
    j++
  }
  switch (keyBuff) {
    case 'k':
      eraseRotateDraw(piece, -1)
      break;
    case 'j':
      eraseRotateDraw(piece, 1)
      break;
    case 'a':
      eraseMoveDraw(piece,0,-1);
      break;
    case 'd':
      eraseMoveDraw(piece,0,1);
      break;
    case 's':
      if(!eraseMoveDraw(piece,1,0)){
        dropping = false;
        for(let i = 0; i < 4; i++){
          board[piece.pos[i][1]][piece.pos[i][0]] = piece.type;
        }
        drawPiece(piece, colors[piece.type]);
        let clearLines = []
        let checkedLines = []
        for(let i = 0; i < 4; i++){
          if(checkedLines.every(line => line != piece.pos[i][1])){
            checkedLines.push(piece.pos[i][1]);
            let lineCleared = true;
            for(let j = 2; j < 12; j++){
              lineCleared &&= board[piece.pos[i][1]][j] > 0;
            }
            if(lineCleared){
              clearLines.push(piece.pos[i][1])
            }
          }
        }
        if(clearLines.length > 0){
          gameDelay(clear,[clearLines])
        } else {
          gameDelay(gameLoop,[]);
        }
      }
      break;
  }
  if(dropping){
    gameDelay(dropLoop, [piece])
  }
}



/*
  //center and stretch to maximum, maintaining aspect ratio, with some margin
  //board is 10x20
  //actual 12x21 sides and bot to simmulate edges
  //hardcode each peice and it's rotations 
  //rotation is legal if it doesn't rotate into existing peices **or off the board
  //movement is legal if it doesn't move into existing peices **or off the board
  //movement down into peices freezes and initializes next peice
  //auto movement down every so many frames, need to test this
  //does a move or rotation overwrite the automove? probably not becuase then you could freeze the peice
  //need window for next peice and line counter
  //blockout if can't spawn peice
  //store board as list of integers
  //runs at 60fps
  // slowest speed is block per 12 frames
  // fastest is block per frame
*/

