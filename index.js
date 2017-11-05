/*
  set variables
*/
//set initial selected color
let selectedColor = 'black';

//set available colors in palet
let paletColors = ['black','white','green','blue','red','yellow'];

//set number of rows and columns in canvas
let gridRows = 10;
let gridCols = 10;

//set paint brush mode off and add toggle off listener to whole page
let brushMode = false;
let body = document.getElementsByTagName('body')[0];
body.addEventListener('mouseup', brushOff);

//add event listener to the HTML color input element
colorInput.addEventListener('input', setColorInput);

//add event listener to save and load buttons
saveButton.addEventListener('click', saveCanvas);
loadButton.addEventListener('click', loadCanvas);

//create list of saved canvases
let files = Object.keys(localStorage);
fileList.innerText = files;

//set default state for tool type
let fillTool = false;
brushButton.addEventListener('click', setToolBrush);
fillButton.addEventListener('click', setToolFill);

/*
  create canvas
*/

//fill the grid with pixles
for(let i = 0; i < gridRows * gridCols; i++) {
  canvas.appendChild(makePixle('white', i));
}

//make and return a single pixle of a given start color
function makePixle(color, index) {
  let row = Math.floor(index / gridRows);
  let col = index % gridRows;

  let pixle = document.createElement('div');
  pixle.className = 'pixle';
  pixle.id = 'r' + row + 'c' + col;
  pixle.style.width = 'calc((100% / ' + gridRows + ') - 2px)';
  pixle.style.paddingBottom = 'calc((100% / ' + gridRows + ') - 2px)';
  pixle.style.float = 'left';
  pixle.style.backgroundColor = color;
  pixle.style.border = '1px solid grey';
  pixle.addEventListener('click', applyColor);
  pixle.addEventListener('mousedown', brushOn);
  pixle.addEventListener('mouseenter', brushColor);
  return pixle;
}

/*
  create palet
*/

//fill the palet with color selectors
for(let i = 0; i < paletColors.length; i++) {
  palet.appendChild(makePaletColor(paletColors[i]));
}

//make and return a single color selector
function makePaletColor(color) {
  let paletColor = document.createElement('div');
  paletColor.style.width = 'calc(50% - 2px)';
  paletColor.style.paddingBottom = 'calc(50% - 2px)';
  paletColor.style.float = 'left';
  paletColor.style.backgroundColor = color;
  paletColor.style.border = '1px solid grey';
  paletColor.style.borderRadius = '50%';
  paletColor.addEventListener('click', setColor);
  return paletColor;
}

/*
  event functions
*/

//determin wheather to fill or color single pixle
function applyColor() {
  if(fillTool) {
    colorFill(event.target);
  } else {
    colorPixle(event.target);
  }
}

//apply the selected color to a pixle
function colorPixle(pixle) {
  pixle.style.backgroundColor = selectedColor;
}

//apply the selected color to a fill area
function colorFill(origin) {
  let matchColor = origin.style.backgroundColor;
  let pixleList = [];
  let limit = 10;
  pixleList.push(origin);
  for(let i = 0; pixleList.length > 0; i++) {
    // if(i > limit) {
    //   console.log("infinite loop");
    //   break;
    // }
    let row = parseInt(pixleList[0].id.slice(1, pixleList[0].id.indexOf('c')));
    let col = parseInt(pixleList[0].id.slice(pixleList[0].id.indexOf('c') + 1));
    pixleList[0].style.backgroundColor = selectedColor;

    let top = document.getElementById('r' + (row - 1) + 'c' + col);
    let bottom = document.getElementById('r' + (row + 1) + 'c' + col);
    let left = document.getElementById('r' + row + 'c' + (col - 1));
    let right = document.getElementById('r' + row + 'c' + (col + 1));

    if((row - 1) >= 0 && top.style.backgroundColor === matchColor && top.style.backgroundColor != selectedColor) {
      pixleList.push(top);
    }
    if((row + 1) < gridRows && bottom.style.backgroundColor === matchColor && bottom.style.backgroundColor != selectedColor) {
      pixleList.push(bottom);
    }
    if((col - 1) >= 0 && left.style.backgroundColor === matchColor && left.style.backgroundColor != selectedColor) {
      pixleList.push(left);
    }
    if((col + 1) < gridCols && right.style.backgroundColor === matchColor && right.style.backgroundColor != selectedColor) {
      pixleList.push(right);
    }
    console.log("list is", pixleList);
    pixleList.shift();
  }
}

//set the selected color to a palet color
function setColor() {
  selectedColor = event.target.style.backgroundColor;
  indicator.style.backgroundColor = selectedColor;
}

//set the selected color to value of the color input
function setColorInput() {
  selectedColor = event.target.value;
  indicator.style.backgroundColor = selectedColor;
}


//toggle paint brush mode on
function brushOn() {
  brushMode = true;
  applyColor(event.target)
}

//toggle paint brush mode off
function brushOff() {
  brushMode = false;
}

//apply color if paint brush mode is on
function brushColor() {
  if(brushMode) {
    applyColor(event.target);
  }
}

//save canvas state on save button click
function saveCanvas() {
  let canvas = JSON.stringify(setCanvasArray());
  localStorage.setItem(saveName.value, canvas);
}

//get array of pixle colors
function setCanvasArray() {
  let pixles = document.getElementsByClassName('pixle');
  let canvas = [];
  for(let i = 0; i < pixles.length; i++) {
    canvas[i] = pixles[i].style.backgroundColor;
  }
  return canvas;
}


//load canvas state on load button click
function loadCanvas() {
  let canvas = localStorage.getItem(loadName.value);
  applyCanvasArray(JSON.parse(canvas));
}

//set pixle colors from applyCanvasArray
function applyCanvasArray(canvas) {
  let pixles = document.getElementsByClassName('pixle');
  for(let i = 0; i < canvas.length; i++) {
    pixles[i].style.backgroundColor = canvas[i];
  }
}

function setToolBrush() {
  fillTool = false;
}

function setToolFill() {
  fillTool = true;
}
