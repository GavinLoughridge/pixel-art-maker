let selectedColor = 'black';
let paletColors = ['black','white','green','blue','red','yellow'];

for(let i = 0; i < 100; i++) {
  canvas.appendChild(makePixle('white'));
}

for(let i = 0; i < paletColors.length; i++) {
  palet.appendChild(makePaletColor(paletColors[i]));
}

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

function makePixle(color) {
  let pixle = document.createElement('div');
  pixle.style.width = 'calc(10% - 2px)';
  pixle.style.paddingBottom = 'calc(10% - 2px)';
  pixle.style.float = 'left';
  pixle.style.backgroundColor = color;
  pixle.style.border = '1px solid grey';
  pixle.addEventListener('click', applyColor);
  return pixle;
}

function applyColor() {
  this.style.backgroundColor = selectedColor;
}

function setColor() {
  selectedColor = this.style.backgroundColor;
  indicator.style.backgroundColor = selectedColor;
}
