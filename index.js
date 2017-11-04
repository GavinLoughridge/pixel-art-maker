/*
  set variables
*/
//set initial selected color
let selectedColor = 'black';

//set available colors in palet
let paletColors = ['black','white','green','blue','red','yellow'];

//set number of rows and columns in canvas
let gridSize = 10;

/*
  create canvas
*/

//fill the grid with pixles
for(let i = 0; i < gridSize * gridSize; i++) {
  canvas.appendChild(makePixle('white'));
}

//make and return a single pixle of a given start color
function makePixle(color) {
  let pixle = document.createElement('div');
  pixle.style.width = 'calc((100% / ' + gridSize + ') - 2px)';
  pixle.style.paddingBottom = 'calc((100% / ' + gridSize + ') - 2px)';
  pixle.style.float = 'left';
  pixle.style.backgroundColor = color;
  pixle.style.border = '1px solid grey';
  pixle.addEventListener('click', applyColor);
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
  paletColor.addEventListener('click', setColor);
  return paletColor;
}

/*
  event functions
*/

//apply the selected color to a pixle
function applyColor() {
  event.target.style.backgroundColor = selectedColor;
}

//set the selected color to a palet color
function setColor() {
  selectedColor = event.target.style.backgroundColor;
  indicator.style.backgroundColor = selectedColor;
}
