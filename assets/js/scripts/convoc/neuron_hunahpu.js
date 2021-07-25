// import mySong from "./assets/test.mp3";
// import miFuente from "./assets/FiraCode-Regular.ttf";

  let neurons = [];
  let connections = [];
  let pot = 7
  let M = Math.pow(2, pot)
  let n = Math.pow(2, pot)
  let dM = 150
  let r = 20
  let r2 = 10
  let k = 3
  let a = 0
  let b = 0
  let song
  let onda;
  let fft;
  let spectrum;
  let myFont
  let start = false

  function preload() {
    song = loadSound("/assets/js/scripts/convoc/assets/test.mp3");
    myFont = loadFont("/assets/js/scripts/convoc/assets/FiraCode-Regular.ttf");
  }


  function setup() {
    createCanvas(800, 800, WEBGL).mousePressed(whenMousePressed).parent("sketch-container");
    colorMode(HSB, 360, 100, 100)
    fft = new p5.FFT()
    background(11, 11, 11);
    textAlign(CENTER, CENTER);
    textSize(200);
    // textFont(myFont)
    text("click para iniciar", 0, 0);
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    } else {
      getAudioContext().suspend();
      getAudioContext().resume();
      // console.log(s.getAudioContext());
    }
    
  }

  function draw() {
    background(0, 0, 0, 30);
    if (start) {
      camera(0, 0, width * 1.5, 0, 0, 0, 0, 1, 0);
      rotateX(+b)
      rotateY(+a)
      spectrum = fft.analyze();
      onda = fft.waveform(n)
      for (let neuron of neurons) {
        neuron.draw_connections()
      }

      for (let neuron of neurons) {
        neuron.glow()
      }

      let c = 0
      for (let neuron of neurons) {
        let R = spectrum[neuron.id] / 255
        for (let v of neuron.connections) {
          R += spectrum[v] * onda[v] / 100
        }
        if (abs(R) > 0.43) {
          neuron.active = true
        }
        neuron.draw(r + 2 * (r * R / 5))

      }
      a += 0.01
      b += 0.009
    } else {
      textAlign(CENTER, CENTER);
      textSize(50);
      textFont(myFont)
      text("click para iniciar", 0, 0);
    }
  }

  // function keyPressed() {
  //   toggleSong()
  // }

  function toggleSong() {
    let status = song.isPlaying();
    song.isPlaying() == true ? song.pause() : song.play();
  }

  function whenMousePressed() {
    init();
    loop();
    toggleSong();
    // song.stop();
    // song.play(0.01);
    start = !start;
  }

  function init() {
    background(11, 11, 11);

    neurons = []
    connections = []

    for (let i = 0; i < M; i++) {
      neurons.push(new Neuron(i,r))
    }

    for (let neuron of neurons)
      neuron.find_nh()

  }

  function d(x, y, a, z, w, b) {
    return Math.sqrt((x - z) * (x - z) + (y - w) * (y - w) + (a - b) * (a - b))
  }

  // class Neuron {
  //   constructor(id,r) {
  //     let px
  //     let py
  //     let pz
  //     let intersected;
  //     do {
  //       intersected = 0;
  //       px = random(-width/2+r, width/2 - r)
  //       py = random(-height/2+r, height/2 - r)
  //       pz = random(-height/2+r, height/2 - r)
  //       for (let neuron of neurons) {
  //         if (d(px, py, pz, neuron.x, neuron.y,neuron.z) < (2.7)*r) {
  //           intersected = 1;
  //           break;
  //         }
  //       }
  //     } while (intersected);
  //     this.x = px;
  //     this.y = py;
  //     this.z = pz;
  //     this.color = random() * 360
  //     this.connections = []
  //     this.active = false
  //     this.v = random(0.01)
  //     this.a=0
  //     this.id = id
  //   }
  
  //   find_nh() {
  //     let nh = []
  //     for (let j = 0; j < M; j++) {
  //       let neuron = neurons[j]
  //       if (d(this.x, this.y,this.z, neuron.x, neuron.y,neuron.z) < dM) {
  //         nh.push((j))
  //       }
  //       if(nh.length > k)
  //         break
  //     }
  //     this.connections = nh
  //   }
  
  //   glow() {
  //     if(!this.active)
  //       return
  //     let nh = this.connections
  //     let t = (1-cos(this.a*PI))
  //     for (let i = 0; i < nh.length; i++) {
  //       let v = neurons[nh[i]]
  //       let px = map(t, 1, 0, this.x, v.x, true)
  //       let py = map(t, 1, 0, this.y, v.y, true)
  //       let pz = map(t, 1, 0, this.z, v.z, true)
  //       push()
  //       translate(px,py,pz)
  //       rotateY(-a)
  //       rotateX(-b)
  //       fill(this.color,100,map(d(px,py,pz,0,0,width*1.5),height/2-r+width*1.5,-height/2+r+width*1.5,40,100))
  //       noStroke()
  //       ellipse(0, 0, 2*r2)
  //       pop()
  //     }
  //     this.a += this.v
  //     if(t>=1){
  //       this.active = false
  //       this.a = 0
  //     }
      
  //   }
  //   draw(r) {
  //     push()
  //     translate(this.x, this.y,this.z)
  //     rotateY(-a)
  //     rotateX(-b)
  //     fill(this.color,100,map(d(this.x,this.y,this.z,0,0,width*1.5),height/2-r+width*1.5,-height/2+r+width*1.5,40,100))
  //     strokeWeight(2)
  //     noStroke()
  //     ellipse(0,0,r)
  //     pop()
  //   }
  //   draw_connections(){
  //     let nh = this.connections
  //     let t = (1 + cos(PI * a + this.color)) / 2 //sin(a * PI) * sin(a * PI)
  //     for (let i = 0; i < nh.length; i++) {
  //       let v = neurons[nh[i]]
  //       push()
  //       stroke(255)
  //       strokeWeight(5)
  //       line(this.x,this.y,this.z,v.x,v.y,v.z)
  //       pop()
  //     }
  //   }
    
  // }
