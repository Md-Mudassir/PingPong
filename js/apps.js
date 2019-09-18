class Vec
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
    }
}

class Rect
{
    constructor(x = 0, y = 0)
    {
        this.pos = new Vec(0, 0);
        this.size = new Vec(x, y);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(10, 10);
        this.vel = new Vec;
    }
}

class Player extends Rect
{
    constructor()
    {
        super(20, 100);
        this.vel = new Vec;
        this.score = 0;

        this._lastPos = new Vec;
    }
    update(dt)
    {
        this.vel.y = (this.pos.y - this._lastPos.y) / dt;
        this._lastPos.y = this.pos.y;
    }
}

class Pong
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.initialSpeed = 250;

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(p => p.pos.y = this._canvas.height / 2);

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };