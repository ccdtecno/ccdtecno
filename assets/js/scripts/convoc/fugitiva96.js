// import myRadius from "./assets/radius1.mp3";
  let sonido;
  let player;
  let plotter;
  
  function preload() {
    sonido = loadSound("/assets/js/scripts/convoc/assets/radius1.mp3",()=>{
      console.log("Canción cargada");
    });
  }
  
  function setup() {
    createCanvas(800,450).parent("sketch-container");
    background(138,161,191);
    player = new PlayerWave(400, 100, sonido);
    plotter = new PolarPlotter(0,0);
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    } else {
      getAudioContext().suspend();
      getAudioContext().resume();
      // console.log(getAudioContext());
    }
  }
    
  function draw() {
    background(138,161,191);
    player.drawPlayer();
    plotter.draw();
  }
  
  class PlayerWave{
    constructor(x,y) {
      this.pos = createVector(x,y);
      this.size = createVector(350,100);
      this.finalPlot = p5.Vector.add(this.size, this.pos);
      this.isLog = true;
      this.transformada;
      this.botonPlay;
      this.botonStop;
      this.botonRandom;
      this.sliderVol; 
      this.sliderRate;
      this.sliderPan;
      this.onda; 
      this.amplitud;
      this.espectro;
      this.posInicialY;
      this.bandas;
      this.init();
    }

    init() {
      console.log("iniciando");
      console.log(sonido);
      this.botonPlay = createButton('Play / Pause').mousePressed(this.toggle).position(500,300).parent("sketch-container");
      this.botonStop = createButton('Stop').mousePressed(this.alto).position(620,300).parent("sketch-container");
      this.botonRandom = createButton('Random').mousePressed(this.aleatorio).position(700,300).parent("sketch-container");
      this.sliderVol = createSlider(0, 0.7, 0.25, 0.001).position(580,360).parent("sketch-container");
      this.sliderRate = createSlider(0, 2, 1, 0.001).position(580,400).parent("sketch-container");
      this.sliderPan = createSlider(-1, 1, 0, 0.01).position(580,440).parent("sketch-container");
      
      this.bandas = 1024;
      this.transformada = new p5.FFT(.8,this.bandas);
      this.amplitud = new p5.Amplitude();
      this.posInicialY = this.size.y - this.pos.y / 2;
    }

    drawBack(){
      push();
      noStroke()
      fill(88, 70, 187) 
      rect(this.pos.x,this.pos.y, this.size.x, this.size.y);
      pop();
    }

    drawPlayer() {
      this.drawBack();
      sonido.amp(this.sliderVol.value());
      sonido.rate(this.sliderRate.value());
      sonido.pan(this.sliderPan.value())
      // Dibuja la forma de onda con una linea
      push();
      this.onda = this.transformada.waveform();
      stroke(244, 247, 149);
      noFill();
      beginShape();
      for(let i = 2; i < this.onda.length; i++) {
        let x = map(i, 0, this.onda.length, this.pos.x, this.pos.x + this.size.x);
        let y = map(this.onda[i], -1, 1, -height, height)
        y += this.posInicialY + this.pos.y;
        curveVertex(x, y);
      }
      endShape();
      pop();
      
      // Dibuja el espectro de frecuencias del sonido
      this.plotFFT();
    }

    plotFFT() {
      this.espectro = this.transformada.analyze(1024);
      let long = this.espectro.length / 24;
      noStroke();
      for (let i = 0; i< this.espectro.length; i++){
      // let c = map(i,0, spectrum.length, 0,255)
      fill(149, 247, 184);
  
      if(this.isLog) {
          let a = map(log(i), 0, log(this.espectro.length), this.pos.x, this.finalPlot.x) 
          let b = map(this.espectro[i], 0, 255, 0, this.size.y)
          rect(a, this.finalPlot.y, (this.size.x / long) -2, -b)
          // fill(textColor);
          // text('LOG',width*3/4,50);
  
      } else {
          let a = map(i, 0, this.espectro.length, this.pos.x, this.finalPlot.x);
          let b = map(this.espectro[i], 0, 255, 0, this.size.y);
          rect(a, this.finalPlot.y, (this.size.x / long) -2, -b )
          // fill(textColor);
          // text('LIN',width*3/4,50);
          } 
      }
    } 

    alto() {   
      sonido.stop();
    }

    toggle() {
      if(sonido.isPlaying()) {
        sonido.pause();
        // print('Pausa')
      } else {
        sonido.play();
        // print('Play')
      }      
    }

    aleatorio() {
      let duracion = sonido.duration();
      let t = random(duracion);
      sonido.jump(t);
    }
  }

  class PolarPlotter{
    constructor(x,y) {
      this.pos = createVector(x,y);
      this.size = createVector(350,350);
      this.finalPos = p5.Vector.add(this.pos,this.size);
      this.sliderAlpha = createSlider(0, 100, 90, 0.1).position(150,400).parent("sketch-container");
      this.fft = new p5.FFT();
      
      this.amp;
      this.value = 0;
      this.op = true;
    }
    
    draw() {
      // noStroke();    
      if (this.op) {
        fill(1, 22, 39);
      } else {
        fill(1, 22, 39, this.sliderAlpha.value());
      }
  
      rect(this.pos.x, this.pos.y, this.finalPox, this.finalPoy);
      translate(this.size.x/2,this.size.y/2);
      let onda = this.fft.waveform();
      let n = onda.length;
      let r0 = 50;
    
      push()
      blendMode(ADD)
      for (let i = 0; i < n; i++) {
        let theta = 1 * TAU / n * i ;
        let r = r0 //+ i/n*200
        let R = map(onda[i], -1, 1, -r0, r0) * 5;
        let x = 1*(R + r) * cos(theta) + (R + r) * cos(20 * theta)
        let y = 1*(R + r) * sin(theta) - (R + r) * sin(20 * theta)
        push()
        if (i % 3 == 0) {
          stroke(177, 77, 197 )
        } else {
          if (i % 3 == 1) {
            stroke(77, 197, 144 )
          } else {
            stroke(177, 77, 197 );
          }
        }
        strokeWeight(3)
        point(x, y);
        pop()
      }
      pop()
    }
    
    keyPressed() {
      if (this.value === 0) {
          this.value = 1;
      } else {
        this.value = 0;
      }
      this.op = !this.op;
    }
  }