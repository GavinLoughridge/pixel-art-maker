/* eslint-env browser */
/* eslint-env jquery */

/*
  declare variables
*/
let gridRows = 10;
let gridCols = 10;
let selectedColor = 'rgb(0, 0, 0)';
let brushMode = false;
let fillTool = false;
let undoChanging = false;
const paletColors = ['#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B', '#FF4136', '#85144b', '#F012BE', '#B10DC9', '#000000', '#AAAAAA', '#FFFFFF', 'rainbow'];

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
const options = document.getElementById('options');
const gridButton = document.getElementById('gridButton');
const gridSize = document.getElementById('gridSize');

/*
  change color of a single pixel
*/
function colorPixel(pixel) {
  if (selectedColor === 'rainbow') {
    pixel.style.backgroundColor = paletColors[Math.floor(Math.random() * (paletColors.length - 2))];
  } else {
    pixel.style.backgroundColor = selectedColor;
  }
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
    const pixelList = [];

    colorPixel(origin);
    pixelList.push(origin);

    while (pixelList.length > 0) {
      const row = parseInt(pixelList[0].id.slice(1, pixelList[0].id.indexOf('c')), 10);
      const col = parseInt(pixelList[0].id.slice(pixelList[0].id.indexOf('c') + 1), 10);

      const top = document.getElementById(`r${row - 1}c${col}`);
      const bottom = document.getElementById(`r${row + 1}c${col}`);
      const left = document.getElementById(`r${row}c${col - 1}`);
      const right = document.getElementById(`r${row}c${col + 1}`);

      if ((row - 1) >= 0 && top.style.backgroundColor === matchColor) {
        colorPixel(top);
        pixelList.push(top);
      }

      if ((row + 1) < gridRows && bottom.style.backgroundColor === matchColor) {
        colorPixel(bottom);
        pixelList.push(bottom);
      }

      if ((col - 1) >= 0 && left.style.backgroundColor === matchColor) {
        colorPixel(left);
        pixelList.push(left);
      }

      if ((col + 1) < gridCols && right.style.backgroundColor === matchColor) {
        colorPixel(right);
        pixelList.push(right);
      }

      pixelList.shift();
    }
  }
}

function applyColor() {
  if (fillTool) {
    colorFill(event.target);
  } else {
    colorPixel(event.target);
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
  if ($(event.target).hasClass('rainbow') && !$('#indicator').hasClass('rainbow')) {
    selectedColor = 'rainbow';
    $('#indicator').toggleClass('rainbow');
  } else if ($('#indicator').hasClass('rainbow') && !$(event.target).hasClass('rainbow')) {
    !$('#indicator').toggleClass('rainbow');
    selectedColor = event.target.style.backgroundColor;
    indicator.style.backgroundColor = selectedColor;
  } else if (!$(event.target).hasClass('rainbow')) {
    selectedColor = event.target.style.backgroundColor;
    indicator.style.backgroundColor = selectedColor;
  }
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
  if (color !== 'rainbow') {
    paletColor.className = 'waves-effect waves-light';
    paletColor.style.backgroundColor = color;
  } else {
    paletColor.className = 'waves-effect waves-light rainbow';
  }
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
function makePixel(color, index) {
  const row = Math.floor(index / gridRows);
  const col = index % gridRows;

  const pixel = document.createElement('div');
  pixel.className = 'pixel';
  pixel.id = `r${row}c${col}`;
  pixel.style.width = `calc((100% / ${gridCols})`;
  pixel.style.paddingBottom = `calc((100% / ${gridCols}) - 2px)`;
  pixel.style.float = 'left';
  pixel.style.backgroundColor = color;
  pixel.style.border = '1px solid lightgrey';
  pixel.addEventListener('mouseenter', brushColor);
  return pixel;
}

function populateCanvas(rows, cols) {
  for (let i = 0; i < rows * cols; i += 1) {
    canvas.appendChild(makePixel('#FFFFFF', i));
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
  const pixels = document.getElementsByClassName('pixel');
  const canvasArray = [];
  for (let i = 0; i < pixels.length; i += 1) {
    canvasArray[i] = pixels[i].style.backgroundColor;
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
  const pixels = document.getElementsByClassName('pixel');

  gridRows = Math.sqrt(canvasArray.length);
  gridCols = gridRows;

  canvas.innerHTML = '';
  populateCanvas(gridRows, gridCols);

  for (let i = 0; i < canvasArray.length; i += 1) {
    pixels[i].style.backgroundColor = canvasArray[i];
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
  saveCanvas('Z660o8DSqY-current');
}


/*
  undo of last action
*/
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
  const eventId = event.target.id;
  if (eventId === 'optionsToggle' && options.style.display !== 'inline') {
    options.style.display = 'inline';
  } else if (!options.contains(event.target) || eventId === 'saveButton' || eventId === 'loadButton' || eventId === 'gridButton') {
    options.style.display = 'none';
  }
}

/*
  enable grid size selector
*/
function applyGridSize() {
  switch (gridSize.value) {
    case 'large':
      canvas.innerHTML = '';
      gridRows = 50;
      gridCols = 50;
      populateCanvas(gridRows, gridCols);
      saveCanvas('Z660o8DSqY-current');
      break;
    case 'medium':
      canvas.innerHTML = '';
      gridRows = 20;
      gridCols = 20;
      populateCanvas(gridRows, gridCols);
      saveCanvas('Z660o8DSqY-current');
      break;
    default:
      canvas.innerHTML = '';
      gridRows = 10;
      gridCols = 10;
      populateCanvas(gridRows, gridCols);
      saveCanvas('Z660o8DSqY-current');
  }
}

/*
  set event listeners
*/

window.addEventListener('click', toggleOptions);
gridButton.addEventListener('click', applyGridSize);
saveButton.addEventListener('click', saveCanvas);
loadButton.addEventListener('click', loadCanvas);

undoButton.addEventListener('click', undoLoad);
canvas.addEventListener('mousedown', undoRecord);
window.addEventListener('mouseup', undoSave);

canvas.addEventListener('mousedown', brushOn);
window.addEventListener('mouseup', brushOff);

brushButton.addEventListener('click', setToolBrush);
fillButton.addEventListener('click', setToolFill);
colorInput.addEventListener('input', setColorInput);

populateCanvas(gridRows, gridCols);
saveCanvas('Z660o8DSqY-current');
undoButton.style.display = 'none';
