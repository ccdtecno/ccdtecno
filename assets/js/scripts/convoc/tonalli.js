let color1, color2, aumento, aumento1, r, b, g, m;
let angulo = 0;
let song;
let slider;
let diametro;
let size;
let a, c, d;
let isLooping = false;

function preload() {
  console.log(getURL());
  // song = loadSound(mySong);
  song = loadSound("/assets/js/scripts/convoc/assets/nena.mp3");
  console.log(song);
}

function setup() {
  let cnv = createCanvas(800, 800);
  cnv.mousePressed(presionarCanvas).parent("sketch-container");
  slider = createSlider(0, 1, 0.5, 0.01).parent("sketch-container");
  color1 = color(200, 10, 210);
  color2 = color(50, 255, 180);
  aumento = 1;
  r = 200;
  b = 250;
  g = 0;
  m = 100;
  angleMode(DEGREES);
  aumento1 = 5;
  diametro = 100;
  size = 0;
  a = 220;
  c = 250;
  d = 200;
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  } else {
    getAudioContext().suspend();
    getAudioContext().resume();
    // console.log(s.getAudioContext());
  }
}

function presionarCanvas() {
  if (song.isPlaying()) song.stop();
  else song.play();
  isLooping = !isLooping;
  console.log(song.isPlaying());
}

function draw() {
  if (isLooping) {
    song.setVolume(slider.value());
    background(color1);
    fill(color2);
    noStroke();
    rect(0, 600, 800, 200);
    triangulos();
    fill(r, b, m);
    rect(150, 250, 500, 400);
    m += aumento;
    if (m > 255 || m < 0) aumento *= -1;
    cassette();
    push();
    circulo1();
    pop();
    // puntos();
    circulos();
  } else {
    push();
    background(0);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255);
    textSize(36)
    text("Presiona el canvas", width/2, height/2);
    pop();
  }
}

function circulos() {
  fill(a, c, d);
  strokeWeight(diametro / 2);
  stroke(d, 0, a);
  circle(0, 800, diametro + size);
  a += aumento;
  if (a > 255 || a < 0) aumento *= -1;
  c += aumento;
  if (c > 255 || c < 0) aumento *= -1;
  d += aumento;
  if (d > 255 || d < 0) aumento *= -2;
  size += aumento1;
  if (size > 550 || size < 0) aumento1 *= -1;
  fill(a, c, d);
  strokeWeight(diametro / 2);
  stroke(d, 0, a);
  circle(800, 800, diametro + size);
  a += aumento;
  if (a > 255 || a < 0) aumento *= -1;
  c += aumento;
  if (c > 255 || c < 0) aumento *= -1;
  d += aumento;
  if (d > 255 || d < 0) aumento *= -2;
  size += aumento1;
  if (size > 550 || size < 0) aumento1 *= -1;
}

function triangulos() {
  noStroke();
  fill(r, g, b);
  triangle(0, 0, 400, 200, 0, 400);
  fill(r, g, b);
  triangle(800, 0, 400, 200, 800, 400);
  fill(r, g, b);
  triangle(200, 600, 400, 200, 600, 600);
  fill(r, g, b);
  triangle(300, 0, 400, 200, 500, 0);
  r += aumento;
  if (r > 255 || r < 0) aumento *= -1;
  g += aumento;
  if (g > 255 || g < 0) aumento *= -1;
  b += aumento;
  if (b > 255 || b < 0) aumento *= -1;
}

function cassette() {
  fill(185);
  strokeWeight(1);
  stroke(0);
  rect(200, 300, 400, 250, 10);
  fill(155);
  strokeWeight(1);
  stroke(0);
  quad(255, 550, 290, 510, 510, 510, 545, 550);
  fill(255);
  rect(220, 320, 360, 180, 10);
  strokeWeight(8);
  stroke(255, 0, 0);
  line(500, 410, 577, 410);
  strokeWeight(8);
  stroke(0, 0, 255);
  line(500, 420, 577, 420);
  strokeWeight(8);
  stroke(0, 255, 0);
  line(500, 430, 577, 430);
  strokeWeight(2);
  stroke(0);
  fill(200);
  rect(260, 385, 280, 80, 10);
  strokeWeight(2);
  stroke(0);
  line(260, 350, 540, 350);
  strokeWeight(2);
  stroke(0);
  line(260, 370, 540, 370);
}

function circulo1() {
  push();
  translate(330, 425);
  rotate(angulo);
  stroke(0);
  strokeWeight(6);
  fill(87, 35, m);
  circle(0, 0, 50);
  stroke(255);
  strokeWeight(5);
  point(25, 0);
  pop();
  translate(470, 425);
  rotate(angulo);
  stroke(0);
  strokeWeight(6);
  fill(87, 35, m);
  circle(0, 0, 50);
  stroke(255);
  strokeWeight(5);
  point(25, 0);
  angulo = angulo + 1;
  m += aumento;
  if (m > 255 || m < 0) aumento *= -1;
}