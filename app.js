var powerUpCreated = false;
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
const powerEl = document.querySelector(".activate");
canvas.width = innerWidth;
canvas.height = innerHeight;
var progressBar = null;
const asteriods = [];
const scrollPos = { x: 0, y: 0 };
const movingKeysActivated = {};
var playerPowerUps = {
    poison: false,
    push: false,
    rocket: false,
    sheild: false,
};
var gameOver = false
var compPowerUps = {"poison": false, "push": false, "rocket": false, "sheild": false };
var projectiles,
    powerups,
    names = ["push" ],
    colors = ["8FBCBB", "#88C0D0", "#81A1C1", "#5E81AC", "#BF616A"],
    stars,
    mousePos = { x: null, y: null },
    superBalls,
    inited = false;
var playerBall = {
    "radius": 4,
    "speed": 7,
    "color": "#D8DEE9"
}
var compBall = {
    "radius": 4,
    "speed": 7,
    "color": "#D8DEE9"
}
const explosives = [];

class Ammo {
    constructor(needDraw=true){
        this.x = innerWidth - 300

        this.y = innerHeight - 200

        this.constX = this.x

        this.constY = this.y

        this.isReloading = false

        this.currAmmo = 100

        this.needDraw = needDraw

        this.path = new Path2D("M 24.539062 0.125 C 24.140625 0.351562 22.664062 1.671875 22.101562 2.3125 C 19.746094 4.992188 18.359375 7.851562 17.714844 11.375 C 17.609375 11.984375 17.539062 13.054688 17.507812 14.863281 C 17.460938 17.039062 17.429688 17.480469 17.3125 17.480469 C 17.234375 17.480469 17.070312 17.585938 16.945312 17.726562 L 16.699219 17.960938 L 16.699219 43.742188 L 16.953125 43.9375 C 17.101562 44.054688 17.273438 44.140625 17.34375 44.140625 C 17.441406 44.140625 17.480469 44.277344 17.480469 44.578125 C 17.480469 44.941406 17.453125 45.019531 17.304688 45.019531 C 17.207031 45.019531 17.03125 45.117188 16.914062 45.242188 C 16.710938 45.460938 16.699219 45.554688 16.699219 47.5 C 16.699219 49.511719 16.699219 49.523438 16.945312 49.757812 L 17.179688 50 L 32.820312 50 L 33.054688 49.757812 C 33.300781 49.523438 33.300781 49.511719 33.300781 47.480469 C 33.300781 45.476562 33.300781 45.4375 33.078125 45.234375 C 32.949219 45.117188 32.773438 45.019531 32.6875 45.019531 C 32.558594 45.019531 32.519531 44.929688 32.519531 44.578125 C 32.519531 44.277344 32.558594 44.140625 32.65625 44.140625 C 32.726562 44.140625 32.898438 44.054688 33.046875 43.9375 L 33.300781 43.742188 L 33.300781 17.960938 L 33.054688 17.726562 C 32.929688 17.585938 32.765625 17.480469 32.6875 17.480469 C 32.570312 17.480469 32.539062 17.039062 32.492188 14.863281 C 32.441406 12.128906 32.351562 11.375 31.875 9.570312 C 31.035156 6.367188 28.992188 3.09375 26.503906 0.957031 C 25.546875 0.136719 25.34375 0.0078125 25 0.0078125 C 24.863281 0.0078125 24.65625 0.0585938 24.539062 0.125 Z M 26.21875 3.046875 C 28.171875 5.058594 29.460938 7.246094 30.203125 9.824219 C 30.683594 11.476562 30.78125 12.296875 30.828125 14.960938 L 30.878906 17.480469 L 19.121094 17.480469 L 19.171875 14.960938 C 19.21875 12.296875 19.316406 11.476562 19.796875 9.824219 C 20.28125 8.125 21.074219 6.476562 22.148438 4.953125 C 22.773438 4.054688 24.773438 1.953125 25 1.953125 C 25.078125 1.953125 25.632812 2.441406 26.21875 3.046875 Z M 31.640625 30.8125 L 31.640625 42.480469 L 18.359375 42.480469 L 18.359375 19.140625 L 31.640625 19.140625 Z M 30.859375 44.578125 L 30.859375 45.019531 L 19.140625 45.019531 L 19.140625 44.140625 L 30.859375 44.140625 Z M 31.640625 47.507812 L 31.640625 48.339844 L 18.359375 48.339844 L 18.359375 46.679688 L 31.640625 46.679688 Z M 31.640625 47.507812")
    }

    draw = () => {
        if(!this.needDraw){            
            return
        }

        
        this.x = innerWidth - 400
        
        this.y = innerHeight - 100
        
        const x = this.x + 20

        var color = ""

        if(this.currAmmo >= 80){
            color = "#A3BE8C"
        } else if(this.currAmmo >= 60){
            color = "#B48EAD"
        } else if(this.currAmmo >= 40){
            color = "#EBCB8B"
        } else if(this.currAmmo >= 20){
            color = "#D08770"
        } else {
            color = "#BF616A"
        }

        context.fillStyle = color

        for(let i = 0; i < Math.ceil(this.currAmmo / 10); i++){
            context.translate(this.x , this.y)

            context.fill(this.path)

            this.x += 35

            context.resetTransform()
        }

        if(this.isReloading){
            context.fillText("Reloading..." , x , this.y + 85)
        }

    }

    decreaseAmmo = () => {
        this.currAmmo -= 1
    }

    reload = () => {
        setTimeout(() => {
            this.currAmmo = 100

            this.isReloading = false
        } , 3000)

        this.isReloading = true

    } 


}

class CanvasBorderShadowController {
    constructor() {
        this.shadow = document.querySelector(".box-shadow");

        this.shadow.style.width = innerWidth + "px";

        this.shadow.style.height = innerHeight + "px";

        this.shadow.style.opacity = 0;

        this.color = "rgba(191, 97, 106 , 0.9)";
    }

    show = (reverse, called = true) => {
        if (!reverse) {
            try {
                this.shadow.classList.remove("unfade");
            } catch (err) { }

            this.shadow.classList.add("fade");

            setTimeout(() => {
                this.shadow.style.opacity = 0;
            }, 500);

            if (called) {
                setTimeout(() => {
                    if (this.shadow.style.opacity == 0) {
                        return;
                    }

                    this.show(true, false);
                }, 4000);
            }
        } else {
            try {
                this.shadow.classList.remove("fade");
            } catch (err) { }

            this.shadow.classList.add("unfade");

            setTimeout(() => {
                this.shadow.style.opacity = 1;
            }, 500);

            if (called) {
                setTimeout(() => {
                    if (this.shadow.style.opacity == 0) {
                        return;
                    }

                    this.show(false, false);
                }, 4000);
            }
        }
    };
}

class Progress {
    constructor(time, callback) {
        this.time = time;
        this.velocity = innerWidth / time;
        this.width = innerWidth;
        this.callback = callback;
    }

    draw = () => {
        context.fillStyle = "white";

        context.fillRect(0, innerHeight - 10, this.width, 10);

        this.width -= this.velocity;

        if (this.width <= 0) {
            progressBar = null;

            this.callback();
        }
    };
}

class PlayerProgress {
    constructor(x, y, name) {
        this.x = x;

        this.y = y;

        this.name = name;

        this.playerHealth = 10000;
    }

    draw = () => {
        this.innerBarWidth = 0.03 * this.playerHealth;

        context.fillStyle = "#D8DEE9";

        context.font = "20px comfortaa";

        context.lineWidth = -1;

        context.fillText(this.name, this.x, this.y);

        context.fillText(`${this.playerHealth} / 10000`, this.x, this.y + 50);

        context.fillStyle = "#3B4252";

        context.fillRect(this.x, this.y + 80, 300, 5);

        context.fillStyle = "#4C566A";

        context.fillRect(this.x, this.y + 80, this.innerBarWidth, 5);
    };

    decreaseHealth = (decrease) => {
        if(this.name == "Computer 1" && compPowerUps["sheild"]){
            return
        }

        if(this.name == "Player 1" && playerPowerUps["sheild"]) return

        this.playerHealth -= decrease;
    };
}

class Tank {
    constructor(x, y, speed, healthBar, ammoHandler) {
        this.x = x;

        this.y = y;

        this.width = 100;

        this.height = 100;

        this.healthBar = healthBar;

        this.keyActivated = {};

        this.ammoHandler = ammoHandler


        this.speed = speed;

        this.turret = new Turret(this.x , this.y - 500);
    }

    draw = () => {
        this.radius = 9;

        this.turret.draw();

        if(this.ammoHandler !== null){
            this.ammoHandler.draw()
        }


        this.healthBar.draw();

        this.turret.x = this.x;

        this.turret.y = this.y + 25;

        this.turret.updatePos();

        var x = this.x;

        var y = this.y;

        var widthPerPixel, heightPerPixel;

        context.save();

        context.beginPath();

        widthPerPixel = 10;

        heightPerPixel = 10;

        x += widthPerPixel * 2 

        y += heightPerPixel * 2

        context.moveTo(x , y)

        x -= widthPerPixel 

        y += heightPerPixel

        context.lineTo(x , y)

        y += heightPerPixel

        context.lineTo(x , y)

        x += widthPerPixel 

        y += heightPerPixel

        context.lineTo(x , y)

        for(let i = 0; i < 10; i++){
            x += widthPerPixel 

            context.lineTo(x , y)
        }

        x += widthPerPixel / 2

        y -= heightPerPixel / 2

        context.lineTo(x , y)

        x -= widthPerPixel + widthPerPixel / 2 - 5

        y -= heightPerPixel + heightPerPixel / 2 - 5

        context.lineTo(x , y)

        x -= widthPerPixel 

        context.lineTo(x , y)

        x -= parseInt(widthPerPixel + widthPerPixel / 2) - 2

        y -= parseInt(heightPerPixel + heightPerPixel / 2) - 2

        context.lineTo(x , y)

        for(let i = 0; i < 7; i++){
            x -= widthPerPixel 

            context.lineTo(x , y)
        }

        context.strokeStyle = "white";

        context.lineWidth = 1

        context.stroke();

        context.fillStyle = "#D8DEE9"

        context.fill()

        context.closePath()

        context.beginPath()

        y += heightPerPixel * 4 - heightPerPixel / 2

        x = this.x + 30

        context.moveTo(x , y)

        for(let i = 0; i < 10; i++){
            x += widthPerPixel 

            context.lineTo(x , y)
        }

        x -= widthPerPixel + 10

        context.arc(x , y , 25 , 0 , 0.5 * Math.PI , false)

        context.lineTo(x - widthPerPixel , y + 25)

        y += 25

        for(let i = 0; i < 6; i++){
            x -= widthPerPixel

            context.lineTo(x - widthPerPixel , y)
        }

        context.arc(x - 10 , y - 25 , 25 , 0.5 * Math.PI , Math.PI)

        context.strokeStyle = "white";

        context.lineWidth = 1

        context.stroke();

        context.fillStyle = "#D8DEE9"

        context.fill()

        context.restore();
        
        context.closePath();

    };

    drawLine = (x , y) => {
        context.lineTo(x , y)

        context.moveTo(x , y)

        
    }

    newValues = (original, key1, key2) => {
        var n =
            original -
            (this.keyActivated[key1] ? this.speed : 0) +
            (this.keyActivated[key2] ? this.speed : 0);

        return n;
    };
}

class Asteriods {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.path = new Path2D();

        this.path.addPath(
            new Path2D(
                "M 38.117188 2.023438 C 37.117188 2.761719 34.261719 4.882812 31.757812 6.726562 C 29.273438 8.585938 27.054688 10.1875 26.835938 10.296875 C 26.632812 10.40625 23.75 11.648438 20.4375 13.042969 C 17.132812 14.453125 14.34375 15.679688 14.246094 15.765625 C 14.082031 15.929688 9.570312 44.773438 9.570312 45.679688 C 9.570312 46.085938 13.78125 61.617188 14.082031 62.304688 C 14.179688 62.535156 15.96875 63.492188 20.929688 65.980469 L 27.671875 69.34375 L 39.085938 68.101562 C 48.601562 67.0625 50.558594 66.800781 50.75 66.609375 C 50.875 66.484375 52.582031 63.738281 54.5625 60.5 L 58.148438 54.617188 L 59.28125 45.253906 C 59.910156 40.101562 60.429688 35.640625 60.429688 35.34375 C 60.429688 35.039062 59.445312 30.09375 58.242188 24.335938 C 57.039062 18.59375 56.054688 13.835938 56.054688 13.78125 C 56.054688 13.699219 42.039062 1.929688 40.824219 0.984375 C 40.605469 0.820312 40.320312 0.683594 40.195312 0.683594 C 40.058594 0.683594 39.128906 1.285156 38.117188 2.023438 Z M 39.335938 12.933594 C 39.304688 12.960938 30.039062 10.789062 29.476562 10.625 C 29.40625 10.59375 31.59375 8.914062 34.328125 6.875 L 39.304688 3.1875 L 39.347656 8.039062 C 39.359375 10.703125 39.359375 12.90625 39.335938 12.933594 Z M 47.824219 8.953125 C 51.242188 11.796875 54.058594 14.203125 54.101562 14.289062 C 54.15625 14.453125 48.125 26.921875 47.988281 26.921875 C 47.945312 26.933594 46.359375 23.992188 44.476562 20.414062 L 41.015625 13.890625 L 41.015625 3.242188 L 41.328125 3.515625 C 41.492188 3.664062 44.421875 6.109375 47.824219 8.953125 Z M 32.992188 13.152344 C 35.902344 13.851562 38.265625 14.464844 38.253906 14.507812 C 38.226562 14.5625 35.246094 17.101562 31.625 20.152344 L 25.019531 25.703125 L 23.335938 23.953125 C 17.445312 17.882812 16.28125 16.609375 16.515625 16.5 C 18.171875 15.75 27.328125 11.90625 27.480469 11.894531 C 27.589844 11.894531 30.0625 12.453125 32.992188 13.152344 Z M 43.382812 21.890625 C 45.351562 25.621094 46.730469 28.382812 46.664062 28.453125 C 46.59375 28.519531 41.753906 30.625 35.914062 33.140625 L 25.292969 37.695312 L 25.292969 37.0625 C 25.292969 36.722656 25.390625 34.371094 25.511719 31.855469 L 25.730469 27.273438 L 26.085938 26.976562 C 26.289062 26.8125 29.4375 24.144531 33.085938 21.070312 C 36.734375 17.992188 39.785156 15.476562 39.851562 15.460938 C 39.9375 15.460938 41.523438 18.347656 43.382812 21.890625 Z M 56.738281 25.183594 C 57.710938 29.789062 58.488281 33.578125 58.476562 33.578125 C 58.460938 33.59375 56.382812 32.46875 53.867188 31.089844 C 51.171875 29.613281 49.289062 28.507812 49.289062 28.382812 C 49.289062 28.148438 54.867188 16.664062 54.933594 16.75 C 54.960938 16.773438 55.78125 20.578125 56.738281 25.183594 Z M 20.289062 23.160156 L 24.0625 27.109375 L 24.0625 27.808594 C 24.046875 28.929688 23.554688 38.429688 23.5 38.484375 C 23.378906 38.59375 11.457031 44.3125 11.414062 44.269531 C 11.375 44.214844 15.296875 18.609375 15.394531 18.335938 C 15.476562 18.101562 15.148438 17.773438 20.289062 23.160156 Z M 48.140625 31.539062 C 48.46875 32.429688 50.367188 37.609375 52.363281 43.066406 C 54.375 48.523438 55.984375 53.007812 55.972656 53.03125 C 55.945312 53.0625 50.460938 51.71875 43.789062 50.039062 L 31.648438 46.992188 L 28.710938 43.242188 C 27.097656 41.179688 25.757812 39.457031 25.742188 39.402344 C 25.71875 39.320312 47.15625 29.996094 47.453125 29.953125 C 47.507812 29.941406 47.8125 30.664062 48.140625 31.539062 Z M 54.441406 33.277344 C 56.765625 34.535156 58.679688 35.617188 58.71875 35.671875 C 58.761719 35.75 57.148438 49.617188 56.96875 50.585938 C 56.945312 50.777344 49.628906 30.980469 49.628906 30.707031 C 49.628906 30.652344 49.765625 30.679688 49.945312 30.789062 C 50.109375 30.898438 52.132812 32.019531 54.441406 33.277344 Z M 27.273438 44.0625 L 30.367188 48 L 30.148438 53.703125 C 30.007812 56.835938 29.898438 59.417969 29.886719 59.417969 C 29.777344 59.5 15.492188 61.070312 15.4375 61.003906 C 15.242188 60.796875 11.335938 46.304688 11.445312 46.210938 C 11.609375 46.03125 23.980469 40.070312 24.089844 40.101562 C 24.144531 40.113281 25.578125 41.90625 27.273438 44.0625 Z M 43.875 51.75 C 50.3125 53.375 55.6875 54.742188 55.808594 54.796875 C 56 54.878906 55.5625 55.6875 52.964844 59.953125 C 51.269531 62.726562 49.859375 65.023438 49.847656 65.039062 C 49.820312 65.078125 31.664062 59.59375 31.59375 59.527344 C 31.539062 59.472656 31.800781 52.117188 31.9375 50.066406 C 31.976562 49.382812 32.046875 48.808594 32.101562 48.808594 C 32.140625 48.808594 37.445312 50.132812 43.875 51.75 Z M 38.144531 63.246094 C 42.3125 64.503906 45.773438 65.570312 45.828125 65.609375 C 45.882812 65.664062 41.890625 66.132812 36.953125 66.679688 L 27.972656 67.648438 L 22.84375 65.078125 C 20.015625 63.65625 17.800781 62.492188 17.910156 62.480469 C 18.019531 62.46875 20.820312 62.140625 24.132812 61.742188 C 27.4375 61.332031 30.242188 61.003906 30.351562 60.992188 C 30.460938 60.976562 33.976562 62 38.144531 63.246094 Z M 38.144531 63.246094"
            )
        );

        this.path.addPath(
            new Path2D("M 16.078125 22.449219 C 15.820312 22.820312 15.789062 23.804688 16.023438 24.035156 C 16.257812 24.265625 17.023438 24.242188 17.226562 23.992188 C 17.527344 23.640625 17.570312 22.722656 17.296875 22.421875 C 16.953125 22.054688 16.335938 22.066406 16.078125 22.449219 Z M 16.078125 22.449219")
        );

        this.path.addPath(
            new Path2D(
                "M 15.570312 25.511719 C 15.476562 25.632812 15.039062 27.890625 14.601562 30.53125 C 13.890625 34.90625 13.835938 35.355469 14.015625 35.640625 C 14.257812 36.011719 14.902344 36.066406 15.230469 35.75 C 15.339844 35.628906 15.476562 35.34375 15.515625 35.09375 C 16.007812 32.226562 16.953125 26.289062 16.953125 26.003906 C 16.953125 25.785156 16.882812 25.554688 16.789062 25.457031 C 16.554688 25.226562 15.789062 25.25 15.570312 25.511719 Z M 15.570312 25.511719"
            )
        );

        this.velocity = { x: null, y: null };

        this.reqAnimation = false;
    }

    draw = () => {
        context.beginPath();

        context.fillStyle = "#FFFFFF";

        context.translate(this.x , this.y)

        context.fill(this.path)

        context.resetTransform()

        context.fill();
    };

    setVelocity = () => {
        const angle = Math.atan2(this.enemy.y - this.y, this.enemy.x - this.x);

        this.velocity = {
            x: Math.cos(angle) * 20,
            y: Math.sin(angle) * 20,
        };
    };

    update = () => {

        // if(playerPowerUps["push"]){
        //     this.enemy = compTank

        // } else if(compPowerUps["push"]){
        //     this.enemy = player

        // }

        const diffX = this.x - this.enemy.x;

        const diffY = this.y - this.enemy.y;

        const hypot = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        if (hypot < 12) {
            this.reqAnimation = false;

            asteriods.splice(asteriods.indexOf(this), 1);

            createExplosive(this.x + 25, this.y + 25);

            this.enemy.healthBar.decreaseHealth(1500)

            return;
        }

        this.setVelocity();

        this.x += this.velocity.x;

        this.y += this.velocity.y;
    };
}

class Star {
    constructor(x, y, radius, color) {
        this.x = x + 500;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw = () => {
        context.beginPath();

        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        context.fillStyle = this.color;

        context.fill();

        context.closePath();

        context.restore();
    };

    update = (rotation) => {
        context.save();

        context.rotate(0);

        context.translate(canvas.width / 2, canvas.height / 2);

        context.rotate(rotation);

        this.draw();

        context.resetTransform();
    };
}

class Projectile {
    constructor(x, y, radius, color, velocity, enemy, poison) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.enemy = enemy;
        this.isPoison = color === "#A3BE8C";
    }

    draw = () => {
        context.save();

        context.beginPath();

        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        context.fillStyle = this.color;

        context.fill();

        context.closePath();

        context.restore();
    };

    update = () => {
        this.x += this.velocity.x;

        this.y += this.velocity.y;
    };

    check = () => {
        if(paused) return

        if (
            this.x > this.enemy.x &&
            this.y > this.enemy.y &&
            this.x < this.enemy.x + 100 &&
            this.y < this.enemy.y + 100
        ) {
            projectiles.splice(projectiles.indexOf(this), 1);

            if (this.isPoison) {
                this.enemy.healthBar.decreaseHealth(100);
            } else {
                this.enemy.healthBar.decreaseHealth(10);
            }

            if (this.enemy == player) {
                if (this.isPoison) {
                    controller.color = "rgba(163, 190, 140, 0.9)";
                } else {
                    controller.color = "rgba(191, 97, 106 , 0.9)";
                }

                controller.show(true);
            }
        }
    };
}

class Explosive extends Projectile {
    check = () => { };
}

class PowerUp extends Projectile {
    setRotation = (rotation) => {
        this.rotation = rotation;
    };

    check = () => {
        
        var xDiff = this.x - player.x;
        
        var yDiff = this.y - player.y;

        var hypot = Math.abs(Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));

        if (hypot < 100) {
            powerups.splice(powerups.indexOf(this), 1);
            
            if(powerUpCreated){
                return
            }

            powerUpCreated = true;
            
            progressBar = new Progress(500, () => {
                powerUpCreated = false;

                playerPowerUps = {
                    poison: false,
                    push: false,
                    rocket: false,
                    sheild: false,
                }; 
            });

            playerPowerUps[this.name] = true;

            if(this.name === "sheild"){
                sheildIntensity = 25
            }

            return;
        }

        xDiff = this.x - compTank.x;

        yDiff = this.y - compTank.y;

        hypot = Math.abs(Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));

        if (hypot < 100) {
            powerups.splice(powerups.indexOf(this), 1);

            if(powerUpCreated){
                return
            }

            compPowerUps[this.name] = true;

            setTimeout(() => {
                compPowerUps = {
                    "poison": false,
                    "push": false,
                    "rocket": false,
                    "sheild": false,
                }; 

                powerUpCreated = false
            }, 10000);

            if(this.name === "sheild"){
                sheildIntensity = 25
            }


            powerUpCreated = true;

            return;
        }
    };

    init = (name, forTank) => {
        this.name = name;

        // this.callback = callback;

        this.forTank = forTank;

        this.path = null;

        switch (this.name) {
            case "poison":
                this.path = new Path2D();

                this.path.addPath(
                    new Path2D(
                        "M 12.949219 0.234375 C 10.554688 0.835938 8.253906 2.695312 7.277344 4.835938 C 6.558594 6.371094 6.207031 8.835938 6.324219 11.441406 C 6.441406 13.71875 6.558594 13.949219 8.394531 15.136719 C 9.511719 15.835938 9.53125 15.878906 9.53125 16.996094 L 9.53125 18.136719 L 11.625 18.136719 L 11.625 16.042969 L 13.695312 16.042969 L 13.765625 17.019531 L 13.835938 18.019531 L 15.925781 18.019531 L 15.996094 17.042969 L 16.066406 16.042969 L 18.136719 16.042969 L 18.136719 18.136719 L 20.230469 18.136719 L 20.230469 16.996094 C 20.230469 15.878906 20.253906 15.835938 21.367188 15.136719 C 23.203125 13.949219 23.320312 13.71875 23.4375 11.441406 C 23.691406 5.953125 22.113281 2.605469 18.4375 0.882812 C 16.855469 0.140625 14.484375 -0.140625 12.949219 0.234375 Z M 12.019531 9.113281 C 12.71875 9.882812 12.859375 10.554688 12.460938 11.464844 C 11.625 13.484375 8.601562 12.835938 8.601562 10.648438 C 8.601562 9.417969 9.417969 8.601562 10.648438 8.601562 C 11.277344 8.601562 11.695312 8.765625 12.019531 9.113281 Z M 20.578125 9.183594 C 21.34375 9.929688 21.367188 11.347656 20.648438 12.019531 C 19.878906 12.71875 19.207031 12.859375 18.300781 12.460938 C 16.277344 11.625 16.925781 8.601562 19.113281 8.601562 C 19.765625 8.601562 20.183594 8.765625 20.578125 9.183594 Z M 15.4375 12.136719 C 15.648438 12.417969 15.8125 12.90625 15.8125 13.183594 C 15.8125 13.648438 15.695312 13.71875 14.882812 13.71875 C 14.066406 13.71875 13.949219 13.648438 13.949219 13.183594 C 13.949219 12.625 14.53125 11.625 14.882812 11.625 C 14.996094 11.625 15.253906 11.859375 15.4375 12.136719 Z M 15.4375 12.136719"
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 3.230469 15.230469 C 2.90625 15.414062 2.488281 15.859375 2.347656 16.253906 C 2.1875 16.625 1.742188 17.066406 1.371094 17.230469 C 0.652344 17.507812 0 18.484375 0 19.277344 C 0 19.53125 0.277344 20.042969 0.605469 20.4375 C 1.324219 21.320312 2.628906 21.4375 3.558594 20.695312 L 4.140625 20.230469 L 7.417969 21.695312 C 9.207031 22.484375 10.695312 23.203125 10.695312 23.273438 C 10.695312 23.367188 10.160156 23.648438 9.511719 23.925781 C 8.324219 24.414062 8.324219 24.414062 7.742188 23.949219 C 6.558594 23.019531 4.628906 23.648438 4.347656 25.042969 C 4.160156 26.042969 4.789062 27.132812 5.71875 27.4375 C 6.207031 27.597656 6.511719 27.855469 6.511719 28.109375 C 6.511719 28.644531 7.324219 29.484375 8.023438 29.667969 C 8.765625 29.855469 9.929688 29.367188 10.277344 28.761719 C 10.417969 28.507812 10.53125 27.972656 10.554688 27.597656 C 10.578125 26.925781 10.765625 26.832031 18.113281 23.578125 L 25.625 20.230469 L 26.203125 20.695312 C 27.132812 21.4375 28.4375 21.320312 29.15625 20.4375 C 29.484375 20.042969 29.761719 19.53125 29.761719 19.277344 C 29.761719 18.484375 29.109375 17.507812 28.390625 17.230469 C 28.019531 17.066406 27.578125 16.625 27.414062 16.253906 C 27.132812 15.53125 26.15625 14.882812 25.367188 14.882812 C 24.554688 14.882812 23.507812 15.972656 23.4375 16.902344 L 23.367188 17.765625 L 19.296875 19.578125 C 17.066406 20.554688 15.066406 21.367188 14.882812 21.367188 C 14.695312 21.367188 12.695312 20.554688 10.464844 19.578125 L 6.394531 17.765625 L 6.324219 16.902344 C 6.277344 16.300781 6.046875 15.878906 5.558594 15.460938 C 4.765625 14.8125 4.117188 14.742188 3.230469 15.230469 Z M 3.230469 15.230469"
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 22.042969 23.949219 C 21.53125 24.320312 21.34375 24.367188 20.761719 24.136719 C 20.136719 23.902344 19.832031 23.972656 18.277344 24.648438 C 17.300781 25.089844 16.507812 25.507812 16.507812 25.601562 C 16.507812 25.667969 17.136719 26.019531 17.925781 26.367188 C 18.972656 26.832031 19.320312 27.066406 19.207031 27.34375 C 18.789062 28.460938 20.4375 29.996094 21.738281 29.667969 C 22.4375 29.484375 23.25 28.644531 23.25 28.109375 C 23.25 27.855469 23.554688 27.597656 24.042969 27.4375 C 24.972656 27.132812 25.601562 26.042969 25.414062 25.042969 C 25.136719 23.648438 23.203125 23.019531 22.042969 23.949219 Z M 22.042969 23.949219"
                    )
                );

                break;

            case "push":
                this.path = new Path2D();

                this.path.addPath(
                    new Path2D(
                        "M 24.023438 2.734375 C 22.734375 5.234375 23.125 6.328125 26.875 10.46875 C 28.789062 12.539062 30.546875 14.648438 30.78125 15.117188 C 31.09375 15.664062 31.25 18.398438 31.25 23.007812 C 31.25 28.867188 31.132812 30.117188 30.625 30.625 C 29.882812 31.40625 29.882812 31.40625 29.140625 30.625 C 28.671875 30.15625 28.515625 29.179688 28.515625 26.40625 C 28.515625 22.34375 28.007812 21.367188 25.78125 21.367188 C 23.515625 21.367188 23.4375 21.601562 23.4375 29.921875 C 23.4375 37.1875 23.476562 37.5 24.335938 38.476562 C 25 39.257812 27.929688 40.507812 36.71875 43.710938 C 43.046875 46.054688 48.632812 48.046875 49.140625 48.203125 L 50 48.515625 L 49.921875 41.992188 L 49.804688 35.46875 L 46.679688 34.335938 C 44.960938 33.710938 42.8125 32.929688 41.875 32.578125 C 39.648438 31.757812 37.929688 30.234375 37.070312 28.320312 C 36.445312 26.992188 36.328125 25.703125 36.328125 19.765625 L 36.328125 12.773438 L 30.78125 7.148438 C 27.734375 4.0625 25.078125 1.5625 24.921875 1.5625 C 24.765625 1.5625 24.375 2.070312 24.023438 2.734375 Z M 24.023438 2.734375"
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 1.835938 8.085938 C 0.625 9.335938 0 10.3125 0 10.976562 C 0 12.34375 3.476562 15.742188 4.6875 15.546875 C 5.976562 15.390625 6.5625 14.257812 5.9375 13.28125 C 5.46875 12.539062 5.625 12.5 12.421875 12.421875 L 19.335938 12.304688 L 19.335938 9.570312 L 12.421875 9.453125 C 5.625 9.375 5.46875 9.335938 5.9375 8.59375 C 6.601562 7.578125 5.9375 6.484375 4.648438 6.328125 C 3.945312 6.25 3.203125 6.71875 1.835938 8.085938 Z M 1.835938 8.085938"
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 1.835938 19.804688 C 0.625 21.054688 0 22.03125 0 22.695312 C 0 24.0625 3.476562 27.460938 4.6875 27.265625 C 5.976562 27.109375 6.5625 25.976562 5.9375 25 C 5.46875 24.257812 5.625 24.21875 12.421875 24.140625 L 19.335938 24.023438 L 19.335938 21.289062 L 12.421875 21.171875 C 5.625 21.09375 5.46875 21.054688 5.9375 20.3125 C 6.601562 19.296875 5.9375 18.203125 4.648438 18.046875 C 3.945312 17.96875 3.203125 18.4375 1.835938 19.804688 Z M 1.835938 19.804688 "
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 1.835938 31.523438 C 0.625 32.773438 0 33.75 0 34.414062 C 0 35.78125 3.476562 39.179688 4.6875 38.984375 C 5.976562 38.828125 6.5625 37.695312 5.9375 36.71875 C 5.46875 35.976562 5.625 35.9375 12.421875 35.859375 L 19.335938 35.742188 L 19.335938 33.007812 L 12.421875 32.890625 C 5.625 32.8125 5.46875 32.773438 5.9375 32.03125 C 6.601562 31.015625 5.9375 29.921875 4.648438 29.765625 C 3.945312 29.6875 3.203125 30.15625 1.835938 31.523438 Z M 1.835938 31.523438"
                    )
                );

                break;

            case "rocket":
                this.path = new Path2D();

                this.path.addPath(
                    new Path2D(
                        "M 25.214844 0.0664062 C 23.191406 0.332031 20.324219 1.554688 17.460938 3.378906 C 15.777344 4.441406 14.132812 5.679688 12.535156 7.082031 C 11.585938 7.917969 11.566406 7.929688 11.273438 7.929688 C 11.140625 7.929688 10.589844 7.824219 10.046875 7.691406 C 9.230469 7.492188 8.996094 7.457031 8.628906 7.472656 C 7.753906 7.519531 7.9375 7.367188 3.777344 11.53125 C 1.277344 14.035156 0.0546875 15.300781 0.0273438 15.402344 C -0.0351562 15.664062 0.0429688 15.851562 0.253906 15.941406 C 0.351562 15.988281 1.636719 16.222656 3.089844 16.445312 C 6.042969 16.90625 6.269531 16.917969 6.859375 16.648438 C 7.042969 16.5625 7.28125 16.429688 7.378906 16.355469 C 7.484375 16.273438 7.632812 16.207031 7.707031 16.207031 C 7.808594 16.207031 8.582031 16.949219 10.773438 19.140625 C 12.378906 20.75 13.703125 22.113281 13.703125 22.164062 C 13.703125 22.21875 13.636719 22.335938 13.5625 22.429688 C 13.34375 22.683594 13.132812 23.152344 13.054688 23.542969 C 12.984375 23.886719 12.996094 24.015625 13.402344 26.621094 C 13.636719 28.113281 13.851562 29.421875 13.878906 29.535156 C 13.945312 29.761719 14.082031 29.851562 14.355469 29.851562 C 14.527344 29.851562 14.851562 29.539062 18.292969 26.097656 C 21.648438 22.761719 22.066406 22.324219 22.210938 22.007812 C 22.496094 21.398438 22.492188 21.167969 22.183594 19.863281 C 22.027344 19.191406 21.925781 18.660156 21.949219 18.589844 C 21.972656 18.519531 22.285156 18.136719 22.644531 17.726562 C 26.28125 13.621094 28.867188 9.066406 29.644531 5.394531 C 29.792969 4.734375 29.808594 4.5 29.8125 3.613281 C 29.8125 2.660156 29.808594 2.5625 29.660156 2.117188 C 29.285156 1.003906 28.535156 0.320312 27.402344 0.0820312 C 26.996094 -0.0078125 25.792969 -0.0195312 25.214844 0.0664062 Z M 23.464844 4.5625 C 25.449219 5.203125 26.210938 7.632812 24.957031 9.285156 C 24.0625 10.472656 22.503906 10.855469 21.179688 10.199219 C 20.101562 9.675781 19.472656 8.65625 19.472656 7.460938 C 19.472656 6.601562 19.753906 5.910156 20.371094 5.304688 C 21.183594 4.488281 22.367188 4.203125 23.464844 4.5625 Z M 23.464844 4.5625"
                    )
                );

                this.path.addPath(
                    new Path2D(
                        "M 6.871094 18.929688 C 5.667969 20.199219 4.289062 22.570312 3.445312 24.839844 C 3.039062 25.953125 2.84375 27.003906 3.027344 27.183594 C 3.113281 27.273438 3.285156 27.210938 4.402344 26.683594 C 4.914062 26.441406 5.910156 26.019531 6.613281 25.746094 C 8.675781 24.933594 9.160156 24.6875 9.96875 24.0625 C 10.480469 23.65625 11.269531 22.910156 11.328125 22.777344 C 11.351562 22.714844 11.335938 22.589844 11.28125 22.480469 C 11.226562 22.378906 10.375 21.472656 9.371094 20.476562 C 7.671875 18.792969 7.527344 18.65625 7.339844 18.65625 C 7.175781 18.65625 7.089844 18.707031 6.871094 18.929688 Z M 6.871094 18.929688"
                    )
                );

                break;

            case "sheild":
                this.path = new Path2D(
                    "M 14.734375 0.0390625 C 13.257812 0.453125 2.9375 3.59375 2.804688 3.667969 C 2.703125 3.734375 2.566406 3.855469 2.496094 3.945312 L 2.375 4.109375 L 2.375 11.0625 C 2.375 16.453125 2.390625 18.105469 2.449219 18.410156 C 3.007812 21.359375 5.351562 24.210938 9.53125 27.03125 C 11.53125 28.371094 14.523438 30 15 30 C 15.476562 30 18.46875 28.371094 20.46875 27.03125 C 24.648438 24.210938 26.992188 21.359375 27.550781 18.410156 C 27.609375 18.105469 27.625 16.453125 27.625 11.0625 L 27.625 4.109375 L 27.503906 3.945312 C 27.433594 3.855469 27.296875 3.734375 27.195312 3.667969 C 26.964844 3.53125 15.410156 0.0625 15.085938 0.03125 C 14.960938 0.015625 14.800781 0.0234375 14.734375 0.0390625 Z M 20.46875 3.4375 L 25.898438 5.070312 L 25.898438 11.289062 C 25.898438 15.339844 25.875 17.671875 25.835938 17.96875 C 25.703125 18.949219 25.164062 20.144531 24.40625 21.164062 C 23.917969 21.808594 22.75 23.023438 21.984375 23.679688 C 20.519531 24.9375 18.601562 26.21875 16.4375 27.40625 C 15.351562 27.996094 15.054688 28.136719 14.917969 28.101562 C 14.554688 28.007812 11.898438 26.484375 10.632812 25.648438 C 8.554688 24.265625 6.664062 22.582031 5.59375 21.164062 C 4.835938 20.144531 4.296875 18.949219 4.164062 17.96875 C 4.125 17.671875 4.101562 15.339844 4.101562 11.289062 L 4.101562 5.070312 L 9.480469 3.453125 C 12.433594 2.5625 14.894531 1.828125 14.941406 1.820312 C 14.988281 1.816406 17.472656 2.542969 20.46875 3.4375 Z M 20.46875 3.4375"
                );
        }
    };

    draw = () => {
        var x = this.x;

        var y = this.y;

        var coordinates = this.generateCoordinates(
            x + 30,
            y + 30,
            6,
            30,
            this.rotation
        );

        context.strokeStyle = "#4C566A";

        context.beginPath();

        coordinates.forEach(function (coordinate, index) {
            if (index === 0) {
                context.moveTo(coordinate.x, coordinate.y);
            } else {
                context.lineTo(coordinate.x, coordinate.y);
            }
        });

        context.closePath();

        context.lineWidth = 2
        
        context.stroke();

        context.fillStyle = "#88C0D0"

        context.fill()

        context.translate(this.x + 29, this.y + 29);

        context.rotate(rotation * 2);

        context.translate(-15, -15);

        context.fillStyle = "#2E3440";

        context.fill(this.path);

        context.resetTransform();
    };

    generateCoordinates = (centerX, centerY, numberOfSides, radius, rotation) => {
        var coordinates = [];
        for (var i = 0; i < numberOfSides; i++) {
            coordinates.push({
                x: parseFloat(
                    (
                        centerX +
                        radius * Math.cos(rotation + (i * 2 * Math.PI) / numberOfSides)
                    ).toFixed(4)
                ),
                y: parseFloat(
                    (
                        centerY +
                        radius * Math.sin(rotation + (i * 2 * Math.PI) / numberOfSides)
                    ).toFixed(4)
                ),
            });
        }
        
        return coordinates;
    };

    update = () => {
        this.x += this.velocity.x;

        this.y += this.velocity.y;
    };
}

class Turret {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.openingPos = { x: x, y: y };
        this.rotation = 50;
    }

    draw = () => {
        context.save();

        context.beginPath();

        context.translate(this.x + 85, this.y);

        context.rotate((this.rotation * Math.PI) / 180);

        context.rect(-80, -5, 80, 5);

        context.fillStyle = "white";

        context.closePath();

        context.fill();

        context.restore();
    };

    setRotation = (angle) => {
        

        if(!angle){
            angle =
                (Math.atan2(this.y - mousePos.y, this.x - mousePos.x) * 180) / Math.PI;
        }

        this.rotation = angle;
    };

    updatePos = () => {
        const newPoints = this.getRotatedPoints(
            this.x + 80,
            this.y,
            this.rotation,
            -80,
            -5
        );

        this.openingPos.x = newPoints.x;

        this.openingPos.y = newPoints.y;
    };

    getRotatedPoints = (X, Y, R, Xos, Yos) => {
        var rotatedX =
            X + Xos * Math.cos(this.radians(R)) - Yos * Math.sin(this.radians(R));
        var rotatedY =
            Y + Xos * Math.sin(this.radians(R)) + Yos * Math.cos(this.radians(R));

        return { x: rotatedX, y: rotatedY };
    };

    radians = (deg) => {
        return deg * 0.0174533;
    };
}

setTimeout(() => {
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * (canvas.width + 1000) - (canvas.width + 1000) / 2;

        const y = Math.random() * (canvas.width + 1000) - (canvas.width + 1000) / 2;

        stars.push(
            new Star(
                x,
                y,
                Math.random() * 3,
                colors[Math.floor(Math.random() * colors.length)]
            )
        );

        stars[i].draw();
    }
}, 0);

var paused = false

const increaseBalls = () => {
    superBalls = { speed: 10, color: "#88C0D0" };
};

const enablePoison = () => {
    // powerUpsUnlocked["poison"] = true;
};

const decreaseHealth = (powerup) => {
    powerEl.classList.add("unfade");

    setTimeout(() => {
        powerEl.classList.remove("unfade");

        powerEl.classList.add("fade");
    }, 10000);
};

const spawnPowerUps = () => {
    setTimeout(() => {
        if(!inited || paused){
            return
        }

        if (powerUpCreated) {
            spawnPowerUps();

            return;
        }


        // alert("Spawning")

        const radius = 29;

        let x, y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? -radius : canvas.width + radius + 100;

            y = Math.random() * canvas.height;
            
        } else {
            x = Math.random() * canvas.width;
            
            y = Math.random() < 0.5 ? -radius : canvas.height + radius + 100;
        }
        
        const endX = canvas.width - x
        
        const endY = canvas.height - y

        const angle = Math.atan2(player.y - y, player.x - x);

        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3,
        };

        const powerup = new PowerUp(x, y, null, null, velocity);

        powerup.init(names[Math.floor(Math.random() * names.length)], player);

        powerups.push(powerup);

        spawnPowerUps();
    }, Math.random() * (15000 - 10000) + 10000);
};

setInterval(() => {
    if(!inited || paused){
        return
    }

    var xUpdate = 0, yUpdate = 0

    try{
        // var angle = Math.atan2(powerups[0].y - compTank.y , powerups[0].x - compTank.x)
        const p = powerups[0]

        if(compTank.x > p.x){
            xUpdate -= 1.5
        }
        
        if(compTank.x < p.x){
            xUpdate += 1.5
        }
        

        if(compTank.y > p.y){
            yUpdate -= 1.5
        }
        

        if(compTank.y < p.y){
            yUpdate += 1.5
        }
        
    } catch{
        if(compTank.x > player.x + 50){
            xUpdate -= 1.5
        }
        
        if(compTank.x < player.x + 50){
            xUpdate += 1.5
        }
        

        if(compTank.y > player.y + 50){
            yUpdate -= 1.5
        }
        

        if(compTank.y < player.y + 50){
            yUpdate += 1.5
        }
        
        if(Math.abs(player.x - compTank.x) < 100 || Math.abs(player.y - compTank.y) < 100) return

    }

    compTank.x += xUpdate

    compTank.y += yUpdate
})

var playerProgress = new PlayerProgress(30, 40, "Player 1");

var ammoHandler = new Ammo()

var player = new Tank(250, 400, 7, playerProgress , ammoHandler);

var compProgress = new PlayerProgress(innerWidth - 350, 50, "Computer 1");

var compAmmo = new Ammo(false)

var compTank = new Tank(1400, 400, 7, compProgress, compAmmo);

setInterval(() => {
    if(!inited || paused){
        return
    }

    if(compAmmo.currAmmo === 0 || compAmmo.isReloading){
        compAmmo.reload()

        return
    }

    const angle = Math.atan2(
        player.y + 50 - compTank.turret.openingPos.y,
        player.x + 50 - compTank.turret.openingPos.x
    );

    const velocity = {
        x: Math.cos(angle) * compBall["speed"],
        y: Math.sin(angle) * compBall["speed"],
    };

    if (compPowerUps["poison"]) {
        projectiles.push(
            new Projectile(
                compTank.turret.openingPos.x,
                compTank.turret.openingPos.y,
                4,
                "#A3BE8C",
                velocity,
                player
            )
        );
    } else {
        projectiles.push(
            new Projectile(
                compTank.turret.openingPos.x,
                compTank.turret.openingPos.y,
                4,
                "#BF616A",
                velocity,
                player
            )
        );
    }

    compAmmo.decreaseAmmo()
}, 100);

// Event listeners
addEventListener("resize", () => {
    canvas.width = innerWidth;

    canvas.height = innerHeight;

    controller.shadow.style.width = innerWidth + "px";

    controller.shadow.style.height = innerHeight + "px";
});

addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;

    mousePos.y = e.clientY;
});

var rotation = 0;
var hexRotation = 0;

const createExplosive = (x, y, count=50) => {
    for (let i = 0; i < count; i++) {
        explosives.push(
            new Explosive(x, y, Math.random() * 4, "white", {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10,
            })
        );
    }
};

// setInterval(() => {
//     if(!inited) return

//     const angle = Math.atan2(player.y - compTank.y , player.x - compTank.x)

//     const velocity = {
//         x: Math.cos(angle) * 6,
//         y: Math.sin(angle) * 6
//     }

//     compTank.x += velocity.x

//     compTank.y += velocity.y
// } , 20)

// Game loop

var sheildIntensity = 0;

const animate = () => {
    handleNumber = requestAnimationFrame(animate);

    context.fillStyle = "rgba(46 , 52 , 64 , 0.4)";

    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let projectile of projectiles) {
        projectile.draw();
        
        projectile.update();
        
        if (
            projectile.x < 0 ||
            projectile.y < 0 ||
            projectile.x > innerWidth ||
            projectile.y > innerHeight
            ) {
                projectiles.splice(projectiles.indexOf(projectile), 1);
            }
            projectile.check();
        }

        if(!paused){
            for (let explosion of explosives) {
                explosion.draw();
                
                explosion.update();
            }
        }
        
        
        finished = false;
        
        for (let powerup of powerups) {
            powerup.draw();
            
            powerup.update();
            
            powerup.check();
            
            powerup.setRotation(hexRotation);
        }
        
        for (let asteriod of asteriods) {
            asteriod.draw();
            
            if (asteriod.reqAnimation) {
                asteriod.update();
            }
        }
        
        for (let star of stars) {
            star.draw();
            
            star.update(rotation);
        }
        
        rotation += 0.001;
        
        hexRotation += 1;
        
        if (progressBar !== null) {
            progressBar.draw();
        }
        
        if (playerPowerUps["sheild"]) {
            context.save();
            
            context.beginPath();
            
            context.arc(player.x + 70, player.y + 45, 100, 0, Math.PI * 2, false);
            
            context.strokeStyle = "#4C566A";
            
            context.shadowColor = "#4C566A";
            
            context.shadowBlur = sheildIntensity;
            
            context.shadowOffsetX = 0;
            
            context.shadowOffsetY = 0;
            
            context.stroke();
            
            context.closePath();
            
            context.restore();
            
            sheildIntensity -= 0.05;
        }
        player.x = player.newValues(player.x, 65, 68);
        
        player.y = player.newValues(player.y, 87, 83);
        
        player.turret.setRotation();
        
        if(player !== null){
            player.draw();
        }

        if(compTank !== null){
            compTank.draw();            
        }

    };
    
    var progressiveId = null;
    
    var xInterval, yInterval;

var intervalId = 0;

const controller = new CanvasBorderShadowController();

var isMouseDown = false;

addEventListener("mouseup", () => {
    isMouseDown = false;
});

addEventListener("keydown", (e) => {
    player.keyActivated[e.which] = true;

    movingKeysActivated[e.which] = true;

    if ([40, 39, 38, 37].includes(e.which)) {
        e.preventDefault();

        return;
    }

    if (playerPowerUps["push"] && e.which === 81) {
        for (let rock of asteriods) {
            if (
                rock.x > player.x &&
                rock.y > player.y - 100 &&
                rock.y &&
                player.y + 100
            ) {
                rock.reqAnimation = true;

                rock.enemy = compTank
            }
        }

        playerPowerUps["push"] = false;

        powerUpCreated = false;

        progressBar = null;
    }

    if(e.which === 82){
        player.ammoHandler.reload()
    }
});

addEventListener("keyup", (e) => {
    player.keyActivated[e.which] = false;

    movingKeysActivated[e.which] = false;
});

addEventListener("mousedown", () => {
    isMouseDown = true;

    if (!inited) return;

    intervalId = setInterval(() => {
        if (!isMouseDown) {
            clearInterval(intervalId);
        }

        if(player.ammoHandler.currAmmo === 0 || player.ammoHandler.isReloading){
            player.ammoHandler.reload()

            return
        }

        const angle = Math.atan2(
            mousePos.y - player.turret.openingPos.y,
            mousePos.x - player.turret.openingPos.x
        );

        const velocity = {
            x: Math.cos(angle) * playerBall["speed"],
            y: Math.sin(angle) * playerBall["speed"],
        };

        var color = "";

        if (playerPowerUps["poison"]) {
            color = "#A3BE8C";
        } else {
            color = playerBall["color"];
        }

        projectiles.push(
            new Projectile(
                player.turret.openingPos.x,
                player.turret.openingPos.y,
                4,
                color,
                velocity,
                compTank
            )
        );

        player.ammoHandler.decreaseAmmo()

    }, 50);
});

var handleNumber = null;

const init = () => {
    projectiles = [];

    powerups = [];

    colors = ["8FBCBB", "#88C0D0", "#81A1C1", "#5E81AC", "#BF616A"];

    mousePos = { x: null, y: null };

    superBalls = { speed: 7, color: "white" };

    inited = true;

    animate();

    spawnPowerUps();

    const element = document.querySelector(".buttons");

    element.classList.add("fade");

    document.querySelector(".gameName").classList.add("fade");

    setTimeout(() => {
        document.querySelector(".gameName").style.display = "none";
    }, 500);

    setTimeout(() => {
        element.style.display = "none";
    }, 500);

    for (let i = 0; i < 5; i++) {
        asteriods.push(
            new Asteriods(
                Math.random() * innerWidth,
                Math.random() * innerHeight,
            )
        );
    }
};

stars = [];


addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
        cancelAnimationFrame(handleNumber);

        document.querySelector(".gamePaused").style.display = "block";

    }
});

document.querySelector(".resume").addEventListener("click", () => {
    animate();

    document.querySelector(".gamePaused").classList.add("fade");

    setTimeout(() => {
        document.querySelector(".gamePaused").style.display = "none";
    }, 500);
});


setInterval(() => {
    if(playerPowerUps["rocket"]){
        playerBall["color"] = "#88C0D0"

        playerBall["speed"] = 10
    } else {
        playerBall = {
            "radius": 4,
            "speed": 7,
            "color": "#D8DEE9"
        }
    }
} , 5)

setInterval(() => {
    if(paused) return

    const angle = Math.atan2(player.y + 50 - compTank.turret.y , player.x + 50 - compTank.turret.x) * 180 / Math.PI;

    compTank.turret.setRotation(angle)

    if (compPowerUps["push"] ) {
        for (let rock of asteriods) {
            if (
                rock.x + 50 > compTank.x &&
                rock.y + 50 > compTank.y - 100
                // rock.y &&
                // compTank.y + 100
            ) {
                rock.reqAnimation = true;

                rock.enemy = player
            }
        }

        compPowerUps["push"] = false;

        powerUpCreated = false;

        progressBar = null;
    }

    if(compPowerUps["rocket"]){
        compBall["speed"] = 15
    } else {
        compBall["speed"] = 7
    }

    if(compPowerUps["sheild"]){
        context.save();
            
        context.beginPath();
        
        context.arc(compTank.x + 70, compTank.y + 45, 100, 0, Math.PI * 2, false);
        
        context.strokeStyle = "#4C566A";
        
        context.shadowColor = "#4C566A";
        
        context.shadowBlur = sheildIntensity;
        
        context.shadowOffsetX = 0;
        
        context.shadowOffsetY = 0;
        
        context.stroke();
        
        context.closePath();
        
        context.restore();
        
        sheildIntensity -= 0.05;
    }

} , 5)

const badge = document.querySelector(".badge")

setInterval(() => {
    if(player.healthBar.playerHealth <= 0 && !paused){
        paused = true

        createExplosive(player.x + 50 , player.y + 50 , 200)

        player = null

        badge.innerHTML = "You Lose!"

        badge.classList.add("unfade")

        setTimeout(() => {
            badge.style.opacity = 1
        } , 500)

        return
    }

    if(compTank.healthBar.playerHealth <= 0 && !paused){
        paused = true
        
        createExplosive(compTank.x + 50 , compTank.y + 50 , 200)
        
        compTank = null
        
        badge.innerHTML = "You Won!"
        
        badge.classList.add("unfade")

        setTimeout(() => {
            badge.style.opacity = 1
        } , 500)
        
        return


    }

    
})