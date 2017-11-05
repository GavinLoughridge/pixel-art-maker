/*
  set variables
*/
//set initial selected color
let selectedColor = 'black';

//set available colors in palet
let paletColors = ['#001F3F','#0074D9','#7FDBFF','#39CCCC','#3D9970','#2ECC40','#01FF70','#FFDC00','#FF851B','#FF4136','#85144b','#F012BE','#B10DC9','#000000','#AAAAAA','#FFFFFF'];

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

//create list of saved canvases and add to dropdown selector
populateFileSelector();

//set default state for tool type
let fillTool = false;
brushButton.addEventListener('click', setToolBrush);
fillButton.addEventListener('click', setToolFill);

//set up listener for file options toggle
optionsToggle.addEventListener('click', toggleOptions);

/*
  create canvas
*/

//fill the grid with pixles
for(let i = 0; i < gridRows * gridCols; i++) {
  canvas.appendChild(makePixle('#FFFFFF', i));
}

//make and return a single pixle of a given start color
function makePixle(color, index) {
  let row = Math.floor(index / gridRows);
  let col = index % gridRows;

  let pixle = document.createElement('div');
  pixle.className = 'pixle';
  pixle.id = 'r' + row + 'c' + col;
  pixle.style.width = 'calc((100% / ' + gridCols + ')';
  pixle.style.paddingBottom = 'calc((100% / ' + gridCols + ') - 2px)';
  pixle.style.float = 'left';
  pixle.style.backgroundColor = color;
  pixle.style.border = '1px solid lightgrey';
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
  palet.insertBefore(makePaletColor(paletColors[i]), palet.childNodes[palet.childNodes.length - 2]);
}

//make and return a single color selector
function makePaletColor(color) {
  let paletColor = document.createElement('div');
  paletColor.className = 'waves-effect waves-light';
  paletColor.style.width = 'calc(25% - 4px)';
  paletColor.style.paddingBottom = 'calc(25% - 8px)';
  paletColor.style.float = 'left';
  paletColor.style.backgroundColor = color;
  paletColor.style.border = '2px solid darkslategrey';
  paletColor.style.borderRadius = '50%';
  paletColor.style.margin = '2px';
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
  if(origin.style.backgroundColor != selectedColor) {
    let matchColor = origin.style.backgroundColor.toString();
    let pixleList = [];

    colorPixle(origin);
    pixleList.push(origin);

    while(pixleList.length > 0) {

      let row = parseInt(pixleList[0].id.slice(1, pixleList[0].id.indexOf('c')));
      let col = parseInt(pixleList[0].id.slice(pixleList[0].id.indexOf('c') + 1));

      let top = document.getElementById('r' + (row - 1) + 'c' + col);
      let bottom = document.getElementById('r' + (row + 1) + 'c' + col);
      let left = document.getElementById('r' + row + 'c' + (col - 1));
      let right = document.getElementById('r' + row + 'c' + (col + 1));

      if((row - 1) >= 0 && top.style.backgroundColor === matchColor) {
        colorPixle(top);
        pixleList.push(top);
      }

      if((row + 1) < gridRows && bottom.style.backgroundColor === matchColor) {
        colorPixle(bottom);
        pixleList.push(bottom);
      }

      if((col - 1) >= 0 && left.style.backgroundColor === matchColor) {
        colorPixle(left);
        pixleList.push(left);
      }

      if((col + 1) < gridCols && right.style.backgroundColor === matchColor) {
        colorPixle(right);
        pixleList.push(right);
      }

      pixleList.shift();
    }
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
  applyColor(event.target);
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
  populateFileSelector();
  saveName.value = '';
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

//create file option element
function populateFileSelector() {
  loadName.innerHTML = '<option disabled selected>Select file...</option>';

  let files = Object.keys(localStorage);
  files.sort();

  for(let i = 0; i < files.length; i++) {
    let fileOption = document.createElement('option');
    fileOption.value = files[i];
    fileOption.innerText = files[i];
    loadName.appendChild(fileOption);
  }

  $(document).ready(function() {
    $('select').material_select();
  });
}

function setToolBrush() {
  fillTool = false;
  indicator.innerHTML = "<img src='assets/brush.ico' alt='brush'>";
}

function setToolFill() {
  fillTool = true;
  indicator.innerHTML = "<img src='assets/fill.ico' alt='fill'>";
}

function toggleOptions() {
  console.log('toggle from', options.style);
  if(options.style.display === 'inline') {
    options.style.display = 'none';
  } else {
    options.style.display = 'inline';
  }
}
