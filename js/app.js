//getting the canvas id & setting the screen size
const canvas = document.querySelector("#pong");
canvas.width = innerWidth;
canvas.height = innerHeight;

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  //adjust the ball speed
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
    const f = value / this.len;
    this.x *= f;
    this.y *= f;
  }
}

class Rect {
  constructor(x = 0, y = 0) {
    this.pos = new Vec(0, 0);
    this.size = new Vec(x, y);
  }

  //getting the position values to evaluate the position for bouncing the ball when it hits the corners
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  constructor() {
    //inheriting the super class properties for the ball
    super(40, 40);
    this.vel = new Vec();
  }
}

class Player extends Rect {
  constructor() {
    //inheriting the super class properties for the bars
    super(40, 200);
    this.vel = new Vec();
    this.score = 0;

    this._lastPos = new Vec();
  }
  update(dt) {
    this.vel.y = (this.pos.y - this._lastPos.y) / dt;
    this._lastPos.y = this.pos.y;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext("2d");

    //initial speed of the ball
    this.initialSpeed = 500;

    this.ball = new Ball();

    this.players = [new Player(), new Player()];

    //initializing the 2 players position and aligning them in middle
    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    //middle
    this.players.forEach(p => (p.pos.y = this._canvas.height / 2));

    let lastTime = null;
    this._frameCallback = millis => {
      if (lastTime !== null) {
        const diff = millis - lastTime;
        this.update(diff / 1000);
      }
      lastTime = millis;
      requestAnimationFrame(this._frameCallback);
    };
    //displaying score using pixels on canvas
    this.CHAR_PIXEL = 15;
    this.CHARS = [
      "111101101101111",
      "010010010010010",
      "111001111100111",
      "111001111001111",
      "101101111001001",
      "111100111001111",
      "111100111101111",
      "111001001001001",
      "111101111101111",
      "111101111001111"
    ].map(str => {
      const canvas = document.createElement("canvas");
      const s = this.CHAR_PIXEL;
      canvas.height = s * 5;
      canvas.width = s * 3;
      const context = canvas.getContext("2d");
      context.fillStyle = "black";
      str.split("").forEach((fill, i) => {
        if (fill === "1") {
          context.fillRect((i % 3) * s, ((i / 3) | 0) * s, s, s);
        }
      });
      return canvas;
    });

    this.reset();
  }
  clear() {
    this._context.fillStyle = "white";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  //when the ball hits the bar repel the velocity of ball
  collide(player, ball) {
    if (
      player.left < ball.right &&
      player.right > ball.left &&
      player.top < ball.bottom &&
      player.bottom > ball.top
    ) {
      ball.vel.x = -ball.vel.x * 1.05;
      //changing the angle of the ball when it hits the bar
      const len = ball.vel.len;
      ball.vel.y += player.vel.y * 0.2;
      ball.vel.len = len;
    }
  }

  //drawing the ball and bars
  draw() {
    this.clear();

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  //drawing the bars
  drawRect(rect) {
    this._context.fillStyle = "black";
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }
  drawScore() {
    const align = this._canvas.width / 3;
    const cw = this.CHAR_PIXEL * 4;
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split("");
      const offset =
        align * (index + 1) - (cw * chars.length) / 2 + this.CHAR_PIXEL / 2;
      //drawing the score image on canvas
      chars.forEach((char, pos) => {
        this._context.drawImage(this.CHARS[char | 0], offset + pos * cw, 20);
      });
    });
  }

  //if ball is idle then add velocity to it and play
  play() {
    const b = this.ball;
    if (b.vel.x === 0 && b.vel.y === 0) {
      //randomly move the ball on click
      b.vel.x = 200 * (Math.random() > 0.5 ? 1 : -1);
      b.vel.y = 200 * (Math.random() * 2 - 1);
      //adjusting the speeed of the ball
      b.vel.len = this.initialSpeed;
    }
  }

  //when the ball hits the boundries set its velocity to 0 and position it in middle
  reset() {
    const b = this.ball;
    b.vel.x = 0;
    b.vel.y = 0;
    b.pos.x = this._canvas.width / 2;
    b.pos.y = this._canvas.height / 2;
  }
  start() {
    requestAnimationFrame(this._frameCallback);
  }
  update(dt) {
    const cvs = this._canvas;
    const ball = this.ball;
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;

    if (ball.right < 0 || ball.left > cvs.width) {
      ++this.players[(ball.vel.x < 0) | 0].score;
      this.reset();
    }

    if (
      (ball.vel.y < 0 && ball.top < 0) ||
      (ball.vel.y > 0 && ball.bottom > cvs.height)
    ) {
      ball.vel.y = -ball.vel.y;
    }

    //right bar follows the position of the bar
    this.players[1].pos.y = ball.pos.y;

    this.players.forEach(player => {
      player.update(dt);
      this.collide(player, ball);
    });

    this.draw();
  }
}

const pong = new Pong(canvas);

canvas.addEventListener("click", () => pong.play());

canvas.addEventListener("mousemove", event => {
  console.log("clilcked");
  const scale = event.offsetY / event.target.getBoundingClientRect().height;
  pong.players[0].pos.y = canvas.height * scale;
});

pong.start();
