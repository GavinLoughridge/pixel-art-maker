/* eslint-env browser */
/* eslint-env jquery */

/*
  declare variables
*/

const canvas = document.getElementById('canvas');
const palet = document.getElementById('palet');
const indicator = document.getElementById('indicator');
const colorInput = document.getElementById('colorInput');
const brushButton = document.getElementById('brushButton');
const fillButton = document.getElementById('fillButton');
const saveButton = document.getElementById('saveButton');
const saveName = document.getElementById('saveName');
const undoButton = document.getElementById('undoButton');
const loadButton = document.getElementById('loadButton');
const loadName = document.getElementById('loadName');
const optionsToggle = document.getElementById('optionsToggle');
const options = document.getElementById('options');
const gridButton = document.getElementById('gridButton');
const gridSize = document.getElementById('gridSize');

const paletColors = ['#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#F012BE', '#B10DC9', '#000000', '#AAAAAA', '#FFFFFF'];

let gridRows = 10;
let gridCols = 10;
let selectedColor = '#000000';
let brushMode = false;
let fillTool = false;
let undoChanging = false;

/*
  change color of a single pixel
*/
function colorPixle(pixel) {
  pixel.style.backgroundColor = selectedColor;
}

/*
  enable fill function
*/
function setToolBrush() {
  fillTool = false;
  indicator.innerHTML = "<img src='assets/brush.ico' alt='brush'>";
}

function setToolFill() {
  fillTool = true;
  indicator.innerHTML = "<img src='assets/fill.ico' alt='fill'>";
}

function colorFill(origin) {
  if (origin.style.backgroundColor !== selectedColor) {
    const matchColor = origin.style.backgroundColor.toString();
    const pixleList = [];

    colorPixle(origin);
    pixleList.push(origin);

    while (pixleList.length > 0) {
      const row = parseInt(pixleList[0].id.slice(1, pixleList[0].id.indexOf('c')), 10);
      const col = parseInt(pixleList[0].id.slice(pixleList[0].id.indexOf('c') + 1), 10);

      const top = document.getElementById(`r${row - 1}c${col}`);
      const bottom = document.getElementById(`r${row + 1}c${col}`);
      const left = document.getElementById(`r${row}c${col - 1}`);
      const right = document.getElementById(`r${row}c${col + 1}`);

      if ((row - 1) >= 0 && top.style.backgroundColor === matchColor) {
        colorPixle(top);
        pixleList.push(top);
      }

      if ((row + 1) < gridRows && bottom.style.backgroundColor === matchColor) {
        colorPixle(bottom);
        pixleList.push(bottom);
      }

      if ((col - 1) >= 0 && left.style.backgroundColor === matchColor) {
        colorPixle(left);
        pixleList.push(left);
      }

      if ((col + 1) < gridCols && right.style.backgroundColor === matchColor) {
        colorPixle(right);
        pixleList.push(right);
      }

      pixleList.shift();
    }
  }
}

function applyColor() {
  if (fillTool) {
    colorFill(event.target);
  } else {
    colorPixle(event.target);
  }
}

/*
  enable brush function
*/
function brushOn() {
  brushMode = true;
  applyColor(event.target);
}

function brushOff() {
  brushMode = false;
}

function brushColor() {
  if (brushMode) {
    applyColor(event.target);
  }
}

/*
  select a color from the palet
*/
function setColor() {
  selectedColor = event.target.style.backgroundColor;
  indicator.style.backgroundColor = selectedColor;
}

/*
  select a color from the color input element
*/
function setColorInput() {
  selectedColor = event.target.value;
  indicator.style.backgroundColor = selectedColor;
}

/*
  populate the palet
*/
function makePaletColor(color) {
  const paletColor = document.createElement('div');
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

function populatePalet() {
  for (let i = 0; i < paletColors.length; i += 1) {
    palet.insertBefore(
      makePaletColor(paletColors[i]),
      palet.childNodes[palet.childNodes.length - 2],
    );
  }
}

populatePalet();

/*
  populate the canvas
*/
function makePixle(color, index) {
  const row = Math.floor(index / gridRows);
  const col = index % gridRows;

  const pixle = document.createElement('div');
  pixle.className = 'pixle';
  pixle.id = `r${row}c${col}`;
  pixle.style.width = `calc((100% / ${gridCols})`;
  pixle.style.paddingBottom = `calc((100% / ${gridCols}) - 2px)`;
  pixle.style.float = 'left';
  pixle.style.backgroundColor = color;
  pixle.style.border = '1px solid lightgrey';
  pixle.addEventListener('mouseenter', brushColor);
  return pixle;
}

function populateCanvas(rows, cols) {
  for (let i = 0; i < rows * cols; i += 1) {
    canvas.appendChild(makePixle('#FFFFFF', i));
  }
}

/*
  enable file selector
*/
function populateFileSelector() {
  loadName.innerHTML = '<option disabled selected>Select file...</option>';

  const files = Object.keys(localStorage);
  files.sort();

  for (let i = 0; i < files.length; i += 1) {
    let fileOption;
    if (files[i].slice(0, 10) !== 'Z660o8DSqY') {
      fileOption = document.createElement('option');
      fileOption.value = files[i];
      fileOption.innerText = files[i];
      loadName.appendChild(fileOption);
    }
  }

  $(document).ready(() => {
    $('select').material_select();
  });
}

populateFileSelector();

/*
  save a file
*/
function setCanvasArray() {
  const pixles = document.getElementsByClassName('pixle');
  const canvasArray = [];
  for (let i = 0; i < pixles.length; i += 1) {
    canvasArray[i] = pixles[i].style.backgroundColor;
  }
  return canvasArray;
}

function saveCanvas(fileName) {
  let name;
  if (typeof fileName !== 'string') {
    name = saveName.value;
  } else {
    name = fileName;
  }

  if (name === 'Z660o8DSqY-current') {
    const undoLast = localStorage.getItem('Z660o8DSqY-current');

    localStorage.setItem('Z660o8DSqY-last', undoLast);
    undoButton.style.display = 'inline';
  }

  const canvasString = JSON.stringify(setCanvasArray());
  localStorage.setItem(name, canvasString);
  populateFileSelector();
  saveName.value = '';
}

/*
  load a file
*/
function applyCanvasArray(canvasArray) {
  const pixles = document.getElementsByClassName('pixle');
  for (let i = 0; i < canvasArray.length; i += 1) {
    pixles[i].style.backgroundColor = canvasArray[i];
  }
}

function loadCanvas(fileName) {
  let name;

  if (typeof fileName !== 'string') {
    name = loadName.value;
  } else {
    name = fileName;
  }

  const canvasString = localStorage.getItem(name);
  applyCanvasArray(JSON.parse(canvasString));
}


/*
  undo of last action
*/
saveCanvas('Z660o8DSqY-current');
undoButton.style.display = 'none';

function undoRecord() {
  undoChanging = true;
}

function undoSave() {
  if (undoChanging) {
    const name = 'Z660o8DSqY-current';
    saveCanvas(name);
  }
  undoChanging = false;
}

function undoLoad() {
  loadCanvas('Z660o8DSqY-last');
  saveCanvas('Z660o8DSqY-current');
  undoButton.style.display = 'none';
}

/*
  create menu options
*/
function toggleOptions() {
  if (options.style.display === 'inline') {
    options.style.display = 'none';
  } else {
    options.style.display = 'inline';
  }
}

/*
  enable grid size selector
*/
function applyGridSize() {
  switch (gridSize.value) {
    case 'small':
      canvas.innerHTML = '';
      gridRows = 50;
      gridCols = 50;
      populateCanvas(gridRows, gridCols);
      break;
    case 'medium':
      canvas.innerHTML = '';
      gridRows = 20;
      gridCols = 20;
      populateCanvas(gridRows, gridCols);
      break;
    default:
      canvas.innerHTML = '';
      gridRows = 10;
      gridCols = 10;
      populateCanvas(gridRows, gridCols);
  }
}

/*
  set event listeners
*/
optionsToggle.addEventListener('click', toggleOptions);
gridButton.addEventListener('click', applyGridSize);
canvas.addEventListener('mousedown', undoRecord);
window.addEventListener('mouseup', undoSave);
undoButton.addEventListener('click', undoLoad);
saveButton.addEventListener('click', saveCanvas);
loadButton.addEventListener('click', loadCanvas);
brushButton.addEventListener('click', setToolBrush);
fillButton.addEventListener('click', setToolFill);
canvas.addEventListener('mousedown', brushOn);
window.addEventListener('mouseup', brushOff);
colorInput.addEventListener('input', setColorInput);
canvas.addEventListener('click', applyColor);

populateCanvas(gridRows, gridCols);
