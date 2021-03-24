
const canvas = document.getElementById("Canvas");
const canvasContext = canvas.getContext('2d');


canvasContext.scale(20,20);


//checking if there are cleared lines
function arenaSweep(){
  outer: for(let y = arena.length - 1; y > 0; --y){
    for(let x = 0; x < arena[y].length; ++x){
      if(arena[y][x] === 0){
        continue outer;
      }
    }

    //cut out the row that is full, change it all to zero then add it back to top
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++ y;
  }

}


function collide(arena, player){
  const [m, o] = [player. matrix, player.pos];
  for(let y = 0; y  < m.length; ++y){
    for(let x = 0; x< m[y].length; ++x){
      if(m[y][x] !== 0 &&
        (arena[y + o.y] &&
        arena[y + o.y][x + o.x]) !== 0 ) {
        return true; 
      }

    }
  }

}


//this is a helper to help create arena which is the 10X20 grid
function createMatrix(w,h){
  const matrix = [];
  while(h--){
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

//create different matrix for different pieces
function createPiece(type){
  if(type  === 'T'){
    // T shape
    return [
          [0,0,0],
          [1,1,1],
          [0,1,0],

    ];
   

    
  }else if(type ==='O'){
    return [
          
          [2,2],
          [2,2],

    ];
  }else if(type === 'L'){
    return [
          [0,3,0],
          [0,3,0],
          [0,3,3],

    ];


  }else if(type === 'J'){
    return [
          [0,4,0],
          [0,4,0],
          [4,4,0],

    ];


  }else if(type === 'I'){
    return [
          [0,5,0,0],
          [0,5,0,0],
          [0,5,0,0],
          [0,5,0,0],

    ];


  }else if(type === 'S'){
    return [
          [0,6,6],
          [6,6,0],
          [0,0,0],

    ];


  }else if(type === 'Z'){
    return [
          [7,7,0],
          [0,7,7],
          [0,0,0],

    ];


  }

}


//drawing and displaying on the canvas
function draw(){

  canvasContext.fillStyle = '#000';
  canvasContext.fillRect(0,0, canvas.width, canvas.height);


  drawMatrix(arena, {x: 0, y:0});
  drawMatrix(player.matrix, player.pos);

}





//draws the matrix that was passed in to its corresposing location 
function drawMatrix(matrix, offset){


  matrix.forEach((row,y)=> {
    row.forEach((value, x) => {
      if (value !== 0){
        canvasContext.fillStyle = colors[value];
        canvasContext.fillRect(x + offset.x,
                               y + offset.y,
                                1, 1);
         
      }


    });

  });

}

//combine and update the arena with player's moves
function merge(arena, player){
  player.matrix.forEach((row, y) =>{
      row.forEach((value, x) =>{
        if(value !== 0){
          arena[y + player.pos.y][x + player.pos.x] = value;
        }

    });
  });
}



//manual dropping and also automatic drop, doubles as collison detection
function playerDrop(){
  player.pos.y++;

  if(collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    return true;
  }

  dropCounter = 0;
  return false;

}


//movement in x direction 
function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena, player)){
    player.pos.x -= dir;
  }
}

//after each piece is layed down, resets wiht a new random piece. 
function playerReset(){
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length*Math.random()|0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length/2 | 0) - 
                  (player.matrix[0].length /2 | 0);


  if(collide(arena, player)){
    arena.forEach(row => row.fill(0));
  }                  
}


//transpose the current matrix based on player's rotate direction 
function playerRotate(dir){
  const pos = player.pos.x; 
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1: -1));
    if(offset > player.matrix[0].length){
      rotate(plyaer.matrix, -dir);
      player.pos.x = pos;
      return;
    }

  }
}

//transpose function 
function rotate(matrix, dir){
  for(let y = 0; y< matrix.length; ++y){
    for(let x = 0; x < y; ++x){
      //tuple switch
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];



    }

  }

  if(dir>0){
    matrix.forEach(row => row.reverse());
  }else{
    matrix.reverse();
  }

}



//counter variables
let dropCounter = 0;
let dropInterval = 1000;


let prevTime = 0;

//update fucntion used to keep udpating the game
function update(time  = 0){
  const deltaTime = time -prevTime;
  prevTime = time;
  

  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }  

  draw();
  requestAnimationFrame(update);
  
  
}

const colors = [
  null,
  'purple', //T 
  'yellow', //O
  'orange', //L
  'darkblue', //J
  'lightblue', //I
  'green', //S
  'red' //Z

]

const arena = createMatrix(10,20);


const player = {
  pos: {x:1, y: 1},
  matrix: createPiece('T'),}


//eventlistsener for tracking keystrokes
document.addEventListener('keydown',  event =>{
    if(event.keyCode == 37){
      playerMove(-1);
    }else if (event.keyCode == 39){
      playerMove(1);
    }else if (event.keyCode == 40){
      playerDrop();
    }else if (event.keyCode == 81){
      playerRotate(-1);
    }else if (event.keyCode == 69 || event.keyCode == 38){
      playerRotate(1);
    }else if (event.keyCode == 32){
      while(!playerDrop()){}
    }


});






update();



