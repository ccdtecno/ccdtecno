let nSpaces = 30
  let spaces = []
  let nWalkers = 1
  let walkers = []
  let frequencies = [392, 164.81, 220, 587.33]
  let types = ['sine', 'triangle', 'sawtooth', 'square']

  let start = false

  function setup() {
    createCanvas(800, 800).parent("sketch-container").mousePressed(init);
    background(11, 11, 11);
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    } else {
      getAudioContext().suspend();
      getAudioContext().resume();
      // console.log(s.getAudioContext());
    }
  }


  function draw() {
    background(0);
    if (start) {
      if (walkers.length >= 1) {
        walkers[0].x = constrain(mouseX, walkers[0].r, width - walkers[0].r)
        walkers[0].y = constrain(mouseY, walkers[0].r, height - walkers[0].r)
      }
      for (let s of spaces)
        s.update()
      for (let w of walkers)
        w.draw()
      for (let s of spaces)
        s.draw()
    } else {
      textAlign(CENTER, CENTER);
      textSize(max(10, height / 15));
      fill(255);
      text("click para iniciar", width / 2, height / 2);
    }
  }

  function init() {
    walkers = []
    for (let i = 0; i < nWalkers; i++)
      walkers.push(new Walker())
    if (spaces.length > 0)
      for (let s of spaces)
        s.close()
    spaces = []

    for (let i = 0; i < nSpaces; i++)
      spaces.push(new Space(i + 1))

    start = true
  }

  function inter(a, b) {
    return dist(a.x, a.y, b.x, b.y) < a.r + b.r
  }

  class Space {
    constructor(mx) {
      this.r = int(random(20, 100));
      this.x = random(this.r, width - this.r);
      this.y = random(this.r, height - this.r);
      this.inside = false;
      this.voice = new p5.Oscillator();
      this.voice1 = new p5.Oscillator(types[int(random(4))]);
      this.voice.start();
      this.voice.freq(int(random(1, mx)) * 50)
      this.voice1.freq(int(random(1, mx)) * 49.99999999)
      this.voice1.start()

      this.voice.amp(0)
      this.voice1.amp(0)
      this.amp = random()
      this.insiders = 0
      this.dr = random(0.1, 0.6)
      this.d = random(TWO_PI)
      this.dx = cos(this.d)
      this.dy = sin(this.d)
      this.speed = random(2)
    }
    update() {
      if (random() > 0.99) {
        this.d = random(TWO_PI)
        this.dx = cos(this.d)
        this.dy = sin(this.d)
      }
      this.x += this.dx * this.speed
      this.y += this.dy * this.speed
      if (this.x < this.r) {

        this.dx *= -1
        this.x += this.r - this.x
      }
      if (this.x > width - this.r) {

        this.dx *= -1
        this.x -= this.x - (width - this.r)
      }
      if (this.y < this.r) {
        this.dy *= -1

        this.x += this.r - this.y
      }
      if (this.y > height - this.r) {

        this.dy *= -1
        this.x -= this.y - (height - this.r)
      }

      let t = 0.5
      let count = 0
      for (let w of walkers)
        if (this.ins(w.x, w.y, w.r))
          count++
      if (count != this.insiders) {
        if (this.insiders == 0) {
          this.inside = true
          this.voice.amp(this.amp, 0.2)
          this.voice1.amp(this.amp, 0.2)
        } else if (count == 0) {
          this.inside = false
          this.voice.amp(0, t)
          this.voice1.amp(0, t)
        }
      }
      if (count > 0)
        this.r -= 1 * this.dr
      if (this.life < 0) {
        this.r = 0

      }
      this.insiders = count
      // if(inside)
    }

    ins(x, y, r) {
      return sqrt(pow(x - this.x, 2) + pow(y - this.y, 2)) < this.r + r
    }

    draw() {
      if (this.inside) {
        stroke(0, 255, 0)
        strokeWeight(3)
        fill(255, 0, 0)
        noFill()
      } else {
        stroke(255)
        fill(255)
      }
      if (this.r > 0)
      ellipse(this.x, this.y, this.r * 2, this.r * 2)
    }
    close() {
      print('bye')
      this.voice.stop(0.1)
    }
  }

  class Walker {
    constructor() {
      this.x = random(width)
      this.y = random(height)
      this.d = random(TWO_PI)
      this.dx = cos(this.d)
      this.dy = sin(this.d)
      this.speed = 2
      this.r = 10
    }
    update() {
      this.x += this.dx * this.speed
      this.y += this.dy * this.speed
      if (this.x < this.r) {

        this.dx *= -1
        this.x += this.r - this.x
      }
      if (this.x > width - this.r) {

        this.dx *= -1
        this.x -= this.x - (width - this.r)
      }
      if (this.y < this.r) {
        this.dy *= -1

        this.x += this.r - this.y
      }
      if (this.y > height - this.r) {

        this.dy *= -1
        this.x -= this.y - (height - this.r)
      }
    }

    draw() {
      push()
      noStroke()
      fill(132, 151, 196)
      // fill(255)
      ellipse(this.x, this.y, this.r * 2, this.r * 2)
      pop()
    }
  }
