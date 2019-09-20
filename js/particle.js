let canvas = document.querySelector("canvas");

//canvas size
canvas.width = innerWidth;
canvas.height = innerHeight - 10;

let c = canvas.getContext("2d");

let colors = ["#272F32", "#9DBDC6", "#FF3D2E", "#DAEAEF"];

//constructor
function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = colors[Math.floor(Math.random() * colors.length)];
  //drawing a circle
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  };

  //when the circle hits the boundries, repel
  this.update = () => {
    if (this.x + radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  };
}

//add 300 circles in an array with random values
let circleArr = [];
for (let i = 0; i < 300; i++) {
  let x = Math.random() * innerWidth;
  let dx = (Math.random() - 0.5) * 7;
  let radius = Math.random() * 7;
  let y = Math.random() * innerHeight;
  let dy = (Math.random() - 0.5) * 7;

  circleArr.push(new Circle(x, y, dx, dy, radius));
}
console.log(circleArr);

animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArr.length; i++) {
    circleArr[i].update();
  }
};
animate();
