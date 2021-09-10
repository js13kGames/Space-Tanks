CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, color, top_left_radius, top_right_radius, bottom_left_radius, bottom_right_radius) {
    this.save()

    this.globalAlpha = 1

    this.beginPath();

    this.moveTo(x + top_left_radius, y);

    this.arcTo(x + w, y, x + w, y + h, top_right_radius);

    this.arcTo(x + w, y + h, x, y + w, bottom_right_radius);

    this.arcTo(x, y + h, x, y, bottom_left_radius);

    this.arcTo(x, y, x + w, y, top_left_radius);

    this.fillStyle = color

    this.fill()

    this.closePath();

    this.restore()

    return this;
};

scrollTo(0, 0)

var canvas = document.querySelector("canvas")
var context = canvas.getContext("2d")

canvas.width = innerWidth * 2

const explosives = []

canvas.height = innerHeight * 2

const powerEl = document.querySelector(".activate")

const asteriods = []

const scrollPos = { x: 0, y: 0 }

const movingKeysActivated = {}

var projectiles, powerups, names, colors = ["8FBCBB", "#88C0D0", "#81A1C1", "#5E81AC", "#BF616A"], stars, mousePos = { x: null, y: null }, superBalls, powerUpsUnlocked, inited = false, player, playerProgress, compTank, compProgress

class CanvasBorderShadowController {
    constructor() {
        this.shadow = document.querySelector(".box-shadow")

        this.shadow.style.width = innerWidth + 'px'

        this.shadow.style.height = innerHeight + 'px'

        this.shadow.style.opacity = 0

        this.color = "rgba(191, 97, 106 , 0.9)"


    }

    show = (reverse, called = true) => {

        if (!reverse) {
            try {
                this.shadow.classList.remove('unfade')
            } catch (err) { }

            this.shadow.classList.add('fade')

            setTimeout(() => {
                this.shadow.style.opacity = 0
            }, 500)

            if (called) {
                setTimeout(() => {
                    if (this.shadow.style.opacity == 0) {
                        return
                    }

                    this.show(true, false)
                }, 4000)
            }


        } else {
            try {
                this.shadow.classList.remove('fade')
            } catch (err) { }

            this.shadow.classList.add('unfade')

            setTimeout(() => {
                this.shadow.style.opacity = 1
            }, 500)


            if (called) {
                setTimeout(() => {
                    if (this.shadow.style.opacity == 0) {
                        return
                    }

                    this.show(false, false)
                }, 4000)
            }


        }
    }

}

class Progress {
    constructor(time) {
        this.time = time
        this.velocity = innerWidth / time
        this.width = innerWidth
    }

    draw = () => {
        context.fillStyle = "white"

        context.fillRect(0, innerHeight - 10, this.width, 10)

        this.width -= this.velocity
    }
}

const progress = new Progress(500)


class PlayerProgress {
    constructor(x, y, name) {
        this.x = x

        this.y = y

        this.name = name

        this.playerHealth = 10000

    }

    draw = () => {
        this.innerBarWidth = 0.03 * this.playerHealth

        context.font = "20px comfortaa"

        context.lineWidth = -1

        context.fillText(this.name, this.x, this.y)

        context.fillText(`${this.playerHealth} / 10000`, this.x, this.y + 50)

        context.fillStyle = "#3B4252"

        context.fillRect(this.x, this.y + 80, 300, 5)

        context.fillStyle = "#4C566A"

        context.fillRect(this.x, this.y + 80, this.innerBarWidth, 5)
    }

    decreaseHealth = (decrease) => {
        this.playerHealth -= decrease
    }
}

class Tank {
    constructor(x, y, speed = 1, healthBar) {
        this.x = x
        this.y = y
        this.width = 100
        this.healthBar = healthBar
        this.height = 100
        this.keyActivated = {}
        this.alphaValue = 1
        this.mapStyles = {
            1: function (x, y, width, height, color) { context.roundRect(x, y, width, height, color, 0, 0, 0, 0) },
            2: function (x, y, width, height, color) { context.roundRect(x, y, width, height, color, 10, 0, 0, 0) },
            4: function (x, y, width, height, color) { context.roundRect(x, y, width, height, color, 0, 10, 0, 0) },
            5: function (x, y, width, height, color) { context.roundRect(x, y, width, height, color, 0, 0, 0, 10) },
            6: function (x, y, width, height, color) { context.roundRect(x, y, width, height, color, 0, 0, 10, 0) }
        };

        this.pixelMap = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 1],
            [7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5],
            [17, 3, 3, 3, 3, 3, 1, 1],
            [7, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 5],
            [1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 4],
            [1, 2, 3, 4, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 8],
            [1, 3, 1, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1],
            [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1],
            [3, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 3, 1, 1],
            [6, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 1, 1],
        ];

        this.speed = speed

        this.turret = new Turret(this.x + 10, this.y + 10)
    }

    draw = () => {

        this.turret.draw()

        this.healthBar.draw()

        this.turret.x = this.x + 10

        this.turret.y = this.y + 10

        var width = 9

        var x = this.x

        var y = this.y

        for (let i = 0; i < this.pixelMap.length; i++) {

            for (let key of this.pixelMap[i]) {
                x += width

                width = 9

                var height = 9

                switch (key) {
                    case 1:
                        this.mapStyles[1](x, y, 9, 9, "rgba(0, 0 , 0 , 0)")

                        break

                    case 2:
                        this.mapStyles[2](x, y, 9, 9, "#D8DEE9")

                        break

                    case 3:
                        this.mapStyles[1](x, y, 9, 9, "#D8DEE9")

                        break

                    case 4:
                        this.mapStyles[4](x, y, 9, 9, "#D8DEE9")

                        break

                    case 5:
                        this.mapStyles[1](x, y, 9, 3, "#D8DEE9")

                        height = 3

                        break

                    case 6:
                        this.mapStyles[6](x, y, 9, 9, "#D8DEE9")

                        break

                    case 7:
                        this.mapStyles[1](x, y, 9, 3, "rbga(0 , 0 , 0 , 0)")

                        height = 3

                        break


                    case 8:
                        this.mapStyles[5](x, y, 9, 9, "#D8DEE9")

                        break

                    case 9:
                        this.mapStyles[1](x, y, 9, 9, "orange")

                        break

                    case 17:
                        // this.turret = new Turret(x , y)

                        // this.turret.draw()

                        width = 80
                }
            }

            y += height

            this.height = y

            x = this.x
        }

    }

    newValues = (original, key1, key2) => {
        var n = original - (this.keyActivated[key1] ? this.speed : 0) + (this.keyActivated[key2] ? this.speed : 0);

        return n
    }

}

class Asteriods {
    constructor(x, y, enemy) {
        this.x = x
        this.y = y
        this.enemy = enemy
        this.path = new Path2D()

        this.path.addPath(new Path2D("M3802 5008 c428 -417 479 -1068 122 -1541 -36 -46 -260 -279 -518 -537 -375 -374 -456 -451 -461 -435 -34 107 -107 190 -192 219 -59 20 -156 20 -216 0 -102 -34 -185 -146 -194 -258 -8 -91 16 -161 74 -226 47 -52 127 -100 168 -100 14 0 -90 -110 -330 -350 l-350 -350 -87 0 -88 0 0 -88 0 -88 -348 -345 c-367 -366 -425 -415 -586 -490 -73 -33 -203 -77 -280 -94 l-29 -6 24 -16 c13 -9 26 -20 29 -23 34 -41 218 -139 336 -179 147 -49 257 -64 419 -58 237 10 436 75 632 208 60 41 388 362 1427 1398 741 741 1390 1392 1441 1448 104 114 159 193 210 300 272 568 47 1257 -506 1545 -194 101 -363 138 -638 138 l-134 0 75 -72z"))

        this.path.addPath(new Path2D("M1382 4728 l3 -93 90 0 90 0 3 93 3 92 -96 0 -96 0 3 -92z"))

        this.path.addPath(new Path2D("M2862 4467 l-124 -124 26 -21 c59 -46 162 -36 219 22 61 61 70 164 19 225 -17 21 -18 21 -140 -102z"))

        this.path.addPath(new Path2D("M3290 4120 l0 -90 90 0 90 0 0 90 0 90 -90 0 -90 0 0 -90z"))

        this.path.addPath(new Path2D("M1560 2820 l0 -90 90 0 90 0 0 90 0 90 -90 0 -90 0 0 -90z"))

        this.path.addPath(new Path2D("M0 2470 l0 -90 90 0 90 0 0 90 0 90 -90 0 -90 0 0 -90z"))

        this.path.addPath(new Path2D("M890 1755 l-125 -126 25 -19 c74 -58 211 -26 254 58 32 64 28 143 -12 191 -17 21 -18 21 -142 -104z"))

        this.path.addPath(new Path2D("M4772 738 l3 -93 85 0 85 0 3 93 3 92 -91 0 -91 0 3 -92z"))

        this.path.addPath(new Path2D("M2770 215 l0 -95 90 0 90 0 0 95 0 95 -90 0 -90 0 0 -95z"))

        this.velocity = {x: null , y: null}

        this.reqAnimation = false
    }

    draw = () => {
        context.beginPath()

        context.fillStyle = "#FFFFFF"

        context.arc(this.x, this.y, 50, 0, Math.PI * 2, false)

        context.fill()
    }

    setVelocity = () => {
        const angle = Math.atan2(this.enemy.y - this.y, this.enemy.x - this.x)

        this.velocity = {
            x: Math.cos(angle) * 20,
            y: Math.sin(angle) * 20
        }
    }

    update = () => {
        if(this.x >= this.enemy.x || this.y >= this.enemy.y){
            this.reqAnimation = false

            createExplosive(this.x + 25, this.y + 25)

            asteriods.splice(asteriods.indexOf(this) , 1)

            return
        }

        this.setVelocity()


        this.x += this.velocity.x

        this.y += this.velocity.y
    }
}

class Star {
    constructor(x, y, radius, color) {
        this.x = x + 500
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw = () => {
        context.beginPath()

        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)

        context.fillStyle = this.color

        context.fill()

        context.closePath()

        context.restore()
    }

    update = (rotation) => {
        context.save()

        context.rotate(0)

        context.translate(canvas.width / 2, canvas.height / 2)

        context.rotate(rotation)

        this.draw()

        context.resetTransform()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, enemy, poison) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.enemy = enemy
        this.poison = poison
    }

    draw = () => {
        context.save()

        context.beginPath()

        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)

        context.fillStyle = this.color

        context.fill()

        context.closePath()

        context.restore()
    }

    update = () => {
        this.x += this.velocity.x

        this.y += this.velocity.y
    }

    check = () => {
        if (this.x > this.enemy.x && this.y > this.enemy.y && this.x < this.enemy.x + 100 && this.y < this.enemy.y + 100) {
            projectiles.splice(projectiles.indexOf(this), 1)

            if (powerUpsUnlocked["poison"]) {
                this.enemy.healthBar.decreaseHealth(200)
            } else {
                this.enemy.healthBar.decreaseHealth(50)
            }


            if (this.enemy == player) {

                if (powerUpsUnlocked["poison"]) {
                    controller.color = "rgba(163, 190, 140, 0.9)"
                } else {
                    controller.color = "rgba(191, 97, 106 , 0.9)"
                }

                controller.show(true)
            }
        }
    }
}

class Explosive extends Projectile{
    check = () => {}
}

class PowerUp extends Projectile {

    setRotation = (rotation) => {
        this.rotation = rotation
    }

    check = () => {
        var xDiff = this.x - player.x

        var yDiff = this.y - player.y

        var hypot = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

        if (hypot < 70) {
            powerups.splice(powerups.indexOf(this), 1)

            powerUpsUnlocked[this.name] = true

            this.caughtBy = player

            this.callback()

            return
        }

        xDiff = this.x - compTank.x

        yDiff = this.y - compTank.y

        hypot = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

        if (hypot < 70) {
            powerups.splice(powerups.indexOf(this), 1)

            powerUpsUnlocked[this.name] = true

            this.caughtBy = compTank

            this.callback()

            return
        }
    }

    init = (name, callback, forTank) => {
        this.name = name

        this.callback = callback

        this.forTank = forTank

        this.caughtBy = null

        this.path = null

        switch (this.name) {
            case "poison":
                this.path = new Path2D()

                this.path.addPath(new Path2D("M 12.949219 0.234375 C 10.554688 0.835938 8.253906 2.695312 7.277344 4.835938 C 6.558594 6.371094 6.207031 8.835938 6.324219 11.441406 C 6.441406 13.71875 6.558594 13.949219 8.394531 15.136719 C 9.511719 15.835938 9.53125 15.878906 9.53125 16.996094 L 9.53125 18.136719 L 11.625 18.136719 L 11.625 16.042969 L 13.695312 16.042969 L 13.765625 17.019531 L 13.835938 18.019531 L 15.925781 18.019531 L 15.996094 17.042969 L 16.066406 16.042969 L 18.136719 16.042969 L 18.136719 18.136719 L 20.230469 18.136719 L 20.230469 16.996094 C 20.230469 15.878906 20.253906 15.835938 21.367188 15.136719 C 23.203125 13.949219 23.320312 13.71875 23.4375 11.441406 C 23.691406 5.953125 22.113281 2.605469 18.4375 0.882812 C 16.855469 0.140625 14.484375 -0.140625 12.949219 0.234375 Z M 12.019531 9.113281 C 12.71875 9.882812 12.859375 10.554688 12.460938 11.464844 C 11.625 13.484375 8.601562 12.835938 8.601562 10.648438 C 8.601562 9.417969 9.417969 8.601562 10.648438 8.601562 C 11.277344 8.601562 11.695312 8.765625 12.019531 9.113281 Z M 20.578125 9.183594 C 21.34375 9.929688 21.367188 11.347656 20.648438 12.019531 C 19.878906 12.71875 19.207031 12.859375 18.300781 12.460938 C 16.277344 11.625 16.925781 8.601562 19.113281 8.601562 C 19.765625 8.601562 20.183594 8.765625 20.578125 9.183594 Z M 15.4375 12.136719 C 15.648438 12.417969 15.8125 12.90625 15.8125 13.183594 C 15.8125 13.648438 15.695312 13.71875 14.882812 13.71875 C 14.066406 13.71875 13.949219 13.648438 13.949219 13.183594 C 13.949219 12.625 14.53125 11.625 14.882812 11.625 C 14.996094 11.625 15.253906 11.859375 15.4375 12.136719 Z M 15.4375 12.136719"))

                this.path.addPath(new Path2D("M 3.230469 15.230469 C 2.90625 15.414062 2.488281 15.859375 2.347656 16.253906 C 2.1875 16.625 1.742188 17.066406 1.371094 17.230469 C 0.652344 17.507812 0 18.484375 0 19.277344 C 0 19.53125 0.277344 20.042969 0.605469 20.4375 C 1.324219 21.320312 2.628906 21.4375 3.558594 20.695312 L 4.140625 20.230469 L 7.417969 21.695312 C 9.207031 22.484375 10.695312 23.203125 10.695312 23.273438 C 10.695312 23.367188 10.160156 23.648438 9.511719 23.925781 C 8.324219 24.414062 8.324219 24.414062 7.742188 23.949219 C 6.558594 23.019531 4.628906 23.648438 4.347656 25.042969 C 4.160156 26.042969 4.789062 27.132812 5.71875 27.4375 C 6.207031 27.597656 6.511719 27.855469 6.511719 28.109375 C 6.511719 28.644531 7.324219 29.484375 8.023438 29.667969 C 8.765625 29.855469 9.929688 29.367188 10.277344 28.761719 C 10.417969 28.507812 10.53125 27.972656 10.554688 27.597656 C 10.578125 26.925781 10.765625 26.832031 18.113281 23.578125 L 25.625 20.230469 L 26.203125 20.695312 C 27.132812 21.4375 28.4375 21.320312 29.15625 20.4375 C 29.484375 20.042969 29.761719 19.53125 29.761719 19.277344 C 29.761719 18.484375 29.109375 17.507812 28.390625 17.230469 C 28.019531 17.066406 27.578125 16.625 27.414062 16.253906 C 27.132812 15.53125 26.15625 14.882812 25.367188 14.882812 C 24.554688 14.882812 23.507812 15.972656 23.4375 16.902344 L 23.367188 17.765625 L 19.296875 19.578125 C 17.066406 20.554688 15.066406 21.367188 14.882812 21.367188 C 14.695312 21.367188 12.695312 20.554688 10.464844 19.578125 L 6.394531 17.765625 L 6.324219 16.902344 C 6.277344 16.300781 6.046875 15.878906 5.558594 15.460938 C 4.765625 14.8125 4.117188 14.742188 3.230469 15.230469 Z M 3.230469 15.230469"))

                this.path.addPath(new Path2D("M 22.042969 23.949219 C 21.53125 24.320312 21.34375 24.367188 20.761719 24.136719 C 20.136719 23.902344 19.832031 23.972656 18.277344 24.648438 C 17.300781 25.089844 16.507812 25.507812 16.507812 25.601562 C 16.507812 25.667969 17.136719 26.019531 17.925781 26.367188 C 18.972656 26.832031 19.320312 27.066406 19.207031 27.34375 C 18.789062 28.460938 20.4375 29.996094 21.738281 29.667969 C 22.4375 29.484375 23.25 28.644531 23.25 28.109375 C 23.25 27.855469 23.554688 27.597656 24.042969 27.4375 C 24.972656 27.132812 25.601562 26.042969 25.414062 25.042969 C 25.136719 23.648438 23.203125 23.019531 22.042969 23.949219 Z M 22.042969 23.949219"))

                break

            case "decrease":
                this.path = new Path2D()

                this.path.addPath(new Path2D("M 24.023438 2.734375 C 22.734375 5.234375 23.125 6.328125 26.875 10.46875 C 28.789062 12.539062 30.546875 14.648438 30.78125 15.117188 C 31.09375 15.664062 31.25 18.398438 31.25 23.007812 C 31.25 28.867188 31.132812 30.117188 30.625 30.625 C 29.882812 31.40625 29.882812 31.40625 29.140625 30.625 C 28.671875 30.15625 28.515625 29.179688 28.515625 26.40625 C 28.515625 22.34375 28.007812 21.367188 25.78125 21.367188 C 23.515625 21.367188 23.4375 21.601562 23.4375 29.921875 C 23.4375 37.1875 23.476562 37.5 24.335938 38.476562 C 25 39.257812 27.929688 40.507812 36.71875 43.710938 C 43.046875 46.054688 48.632812 48.046875 49.140625 48.203125 L 50 48.515625 L 49.921875 41.992188 L 49.804688 35.46875 L 46.679688 34.335938 C 44.960938 33.710938 42.8125 32.929688 41.875 32.578125 C 39.648438 31.757812 37.929688 30.234375 37.070312 28.320312 C 36.445312 26.992188 36.328125 25.703125 36.328125 19.765625 L 36.328125 12.773438 L 30.78125 7.148438 C 27.734375 4.0625 25.078125 1.5625 24.921875 1.5625 C 24.765625 1.5625 24.375 2.070312 24.023438 2.734375 Z M 24.023438 2.734375"))

                this.path.addPath(new Path2D("M 1.835938 8.085938 C 0.625 9.335938 0 10.3125 0 10.976562 C 0 12.34375 3.476562 15.742188 4.6875 15.546875 C 5.976562 15.390625 6.5625 14.257812 5.9375 13.28125 C 5.46875 12.539062 5.625 12.5 12.421875 12.421875 L 19.335938 12.304688 L 19.335938 9.570312 L 12.421875 9.453125 C 5.625 9.375 5.46875 9.335938 5.9375 8.59375 C 6.601562 7.578125 5.9375 6.484375 4.648438 6.328125 C 3.945312 6.25 3.203125 6.71875 1.835938 8.085938 Z M 1.835938 8.085938"))

                this.path.addPath(new Path2D("M 1.835938 19.804688 C 0.625 21.054688 0 22.03125 0 22.695312 C 0 24.0625 3.476562 27.460938 4.6875 27.265625 C 5.976562 27.109375 6.5625 25.976562 5.9375 25 C 5.46875 24.257812 5.625 24.21875 12.421875 24.140625 L 19.335938 24.023438 L 19.335938 21.289062 L 12.421875 21.171875 C 5.625 21.09375 5.46875 21.054688 5.9375 20.3125 C 6.601562 19.296875 5.9375 18.203125 4.648438 18.046875 C 3.945312 17.96875 3.203125 18.4375 1.835938 19.804688 Z M 1.835938 19.804688 "))

                this.path.addPath(new Path2D("M 1.835938 31.523438 C 0.625 32.773438 0 33.75 0 34.414062 C 0 35.78125 3.476562 39.179688 4.6875 38.984375 C 5.976562 38.828125 6.5625 37.695312 5.9375 36.71875 C 5.46875 35.976562 5.625 35.9375 12.421875 35.859375 L 19.335938 35.742188 L 19.335938 33.007812 L 12.421875 32.890625 C 5.625 32.8125 5.46875 32.773438 5.9375 32.03125 C 6.601562 31.015625 5.9375 29.921875 4.648438 29.765625 C 3.945312 29.6875 3.203125 30.15625 1.835938 31.523438 Z M 1.835938 31.523438"))

                break

            case "rocket":
                this.path = new Path2D()

                this.path.addPath(new Path2D("M 25.214844 0.0664062 C 23.191406 0.332031 20.324219 1.554688 17.460938 3.378906 C 15.777344 4.441406 14.132812 5.679688 12.535156 7.082031 C 11.585938 7.917969 11.566406 7.929688 11.273438 7.929688 C 11.140625 7.929688 10.589844 7.824219 10.046875 7.691406 C 9.230469 7.492188 8.996094 7.457031 8.628906 7.472656 C 7.753906 7.519531 7.9375 7.367188 3.777344 11.53125 C 1.277344 14.035156 0.0546875 15.300781 0.0273438 15.402344 C -0.0351562 15.664062 0.0429688 15.851562 0.253906 15.941406 C 0.351562 15.988281 1.636719 16.222656 3.089844 16.445312 C 6.042969 16.90625 6.269531 16.917969 6.859375 16.648438 C 7.042969 16.5625 7.28125 16.429688 7.378906 16.355469 C 7.484375 16.273438 7.632812 16.207031 7.707031 16.207031 C 7.808594 16.207031 8.582031 16.949219 10.773438 19.140625 C 12.378906 20.75 13.703125 22.113281 13.703125 22.164062 C 13.703125 22.21875 13.636719 22.335938 13.5625 22.429688 C 13.34375 22.683594 13.132812 23.152344 13.054688 23.542969 C 12.984375 23.886719 12.996094 24.015625 13.402344 26.621094 C 13.636719 28.113281 13.851562 29.421875 13.878906 29.535156 C 13.945312 29.761719 14.082031 29.851562 14.355469 29.851562 C 14.527344 29.851562 14.851562 29.539062 18.292969 26.097656 C 21.648438 22.761719 22.066406 22.324219 22.210938 22.007812 C 22.496094 21.398438 22.492188 21.167969 22.183594 19.863281 C 22.027344 19.191406 21.925781 18.660156 21.949219 18.589844 C 21.972656 18.519531 22.285156 18.136719 22.644531 17.726562 C 26.28125 13.621094 28.867188 9.066406 29.644531 5.394531 C 29.792969 4.734375 29.808594 4.5 29.8125 3.613281 C 29.8125 2.660156 29.808594 2.5625 29.660156 2.117188 C 29.285156 1.003906 28.535156 0.320312 27.402344 0.0820312 C 26.996094 -0.0078125 25.792969 -0.0195312 25.214844 0.0664062 Z M 23.464844 4.5625 C 25.449219 5.203125 26.210938 7.632812 24.957031 9.285156 C 24.0625 10.472656 22.503906 10.855469 21.179688 10.199219 C 20.101562 9.675781 19.472656 8.65625 19.472656 7.460938 C 19.472656 6.601562 19.753906 5.910156 20.371094 5.304688 C 21.183594 4.488281 22.367188 4.203125 23.464844 4.5625 Z M 23.464844 4.5625"))

                this.path.addPath(new Path2D("M 6.871094 18.929688 C 5.667969 20.199219 4.289062 22.570312 3.445312 24.839844 C 3.039062 25.953125 2.84375 27.003906 3.027344 27.183594 C 3.113281 27.273438 3.285156 27.210938 4.402344 26.683594 C 4.914062 26.441406 5.910156 26.019531 6.613281 25.746094 C 8.675781 24.933594 9.160156 24.6875 9.96875 24.0625 C 10.480469 23.65625 11.269531 22.910156 11.328125 22.777344 C 11.351562 22.714844 11.335938 22.589844 11.28125 22.480469 C 11.226562 22.378906 10.375 21.472656 9.371094 20.476562 C 7.671875 18.792969 7.527344 18.65625 7.339844 18.65625 C 7.175781 18.65625 7.089844 18.707031 6.871094 18.929688 Z M 6.871094 18.929688"))


                break
        }
    }

    draw = () => {
        var x = this.x

        var y = this.y

        var coordinates = this.generateCoordinates(x + this.radius, y + this.radius, 6, this.radius, this.rotation);

        context.strokeStyle = "black";

        context.beginPath();

        coordinates.forEach(function (coordinate, index) {
            if (index === 0) {
                context.moveTo(coordinate.x, coordinate.y)
            } else {
                context.lineTo(coordinate.x, coordinate.y);
            }
        });

        context.closePath();

        context.fillStyle = "#88C0D0"

        context.fill()

        context.strokeStyle = "#3B4252"

        context.lineWidth = 2

        context.stroke();

        context.translate(this.x + 29, this.y + 29)

        context.rotate(rotation * 2)

        context.translate(-15, -15)

        context.fillStyle = "#2E3440"

        context.fill(this.path)

        context.resetTransform()
    }

    generateCoordinates = (centerX, centerY, numberOfSides, radius, rotation) => {
        var coordinates = [];
        for (var i = 0; i < numberOfSides; i++) {
            coordinates.push({
                x: parseFloat((centerX + radius * Math.cos(rotation + (i * 2 * Math.PI / numberOfSides))).toFixed(4)),
                y: parseFloat((centerY + radius * Math.sin(rotation + (i * 2 * Math.PI / numberOfSides))).toFixed(4))
            })
        }
        return coordinates;
    };


    update = () => {
        this.x += this.velocity.x

        this.y += this.velocity.y
    }
}


class Turret {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw = () => {
        context.fillStyle = "#D8DEE9"

        context.fillRect(this.x, this.y, 80, 10)
    }
}

playerProgress = new PlayerProgress(30, 40, "Player 1")

player = new Tank(250, 400, 7, playerProgress)

compProgress = new PlayerProgress(innerWidth - 350, 50, "Computer 1")

compTank = new Tank(1400, 400, 7, compProgress)

setTimeout(() => {
    for (let i = 0; i < 400; i++) {
        const x = (Math.random() * (canvas.width + 1000)) - (canvas.width + 1000) / 2;

        const y = (Math.random() * (canvas.width + 1000)) - (canvas.width + 1000) / 2;

        stars.push(new Star(x, y, Math.random() * 3, colors[Math.floor(Math.random() * colors.length)]))

        stars[i].draw()
    }
}, 0)


const increaseBalls = () => {
    superBalls = { speed: 10, color: "#88C0D0" }
}

const enablePoison = () => {
    powerUpsUnlocked["poison"] = true
}

const decreaseHealth = (powerup) => {

    powerEl.classList.add("unfade")

    powerUpsUnlocked["push"] = true

    setTimeout(() => {
        powerEl.classList.remove("unfade")

        powerEl.classList.add("fade")
    } , 10000)

}

const spawnPowerUps = () => {
    setTimeout(() => {
        const radius = 29

        let x, y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? -radius : canvas.width + radius + 100

            y = Math.random() * canvas.height

        } else {
            x = Math.random() * canvas.width

            y = Math.random() < 0.5 ? -radius : canvas.height + radius + 100

        }

        const color = "green"

        const angle = Math.atan2(player.y - y, player.x - x)

        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        }


        const powerup = new PowerUp(x, y, radius, color, velocity)

        _name = names[Math.floor(Math.random() * names.length)]

        switch (_name) {
            case "poison":


                powerup.init(_name, enablePoison, player)

                break

            case "rocket":
                powerup.init(_name, increaseBalls, player)

                break

            case "decrease":
                powerup.init(_name, () => { decreaseHealth(powerup) }, player)

                break

        }


        powerups.push(powerup)

        spawnPowerUps()

    }, Math.random() * (10000 - 50000) + 50000)
}




//     // var angle = Math.atan2(player.y - compTank.y, player.x - compTank.x)

//     // var velocity = {
//     //     x: Math.cos(angle) * 2,
//     //     y: Math.sin(angle) * 2
//     // }

//     // compTank.x += velocity.x 

//     // compTank.y += velocity.y

// } , 10)

setInterval(() => {
    if (!inited) return

    const angle = Math.atan2(player.y + 50 - compTank.turret.y, player.x + 50 - compTank.turret.x)

    const velocity = {
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7
    }

    if (powerUpsUnlocked["poison"]) {
        projectiles.push(new Projectile(compTank.turret.x, compTank.turret.y, 5, "#A3BE8C", velocity, player))
    } else {
        projectiles.push(new Projectile(compTank.turret.x, compTank.turret.y, 5, "#BF616A", velocity, player))
    }

}, 400)

// Event listeners
addEventListener("resize", () => {
    canvas.width = innerWidth

    canvas.height = innerHeight
})

addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX

    mousePos.y = e.clientY
})

var rotation = 0
var hexRotation = 0

const createExplosive = (x , y) => {
    for(let i = 0; i < 50; i++){
        explosives.push(new Explosive(x , y , Math.random() * 4 , "white" , {x: (Math.random() - 0.5) * 10 , y: (Math.random() - 0.5) * 10}))
    }
}

// setInterval(() => {
//     const angle = Math.atan2(player.y - compTank.y , player.x - compTank.x)

//     const velocity = {
//         x: Math.cos(angle) * superBalls["speed"],
//         y: Math.sin(angle) * superBalls["speed"]
//     }

//     compTank.x += velocity.x

//     compTank.y += velocity.y
// })

// Game loop

const animate = () => {
    
    requestAnimationFrame(animate)

    player.x = player.newValues(player.x, 65, 68)
    
    player.y = player.newValues(player.y, 87, 83)
    
    for (let projectile of projectiles) {
        projectile.draw()
    
        projectile.update()
    
        if (projectile.x < 0 || projectile.y < 0 || projectile.x > innerWidth || projectile.y > innerHeight) {
            projectiles.splice(projectiles.indexOf(projectile), 1)
        }
        projectile.check()
    }
    
    
    for (let explosion of explosives) {
        explosion.draw()
    
        explosion.update()
    }


    finished = false

    player.draw()

    compTank.draw()


    for (let powerup of powerups) {
        powerup.draw()

        powerup.update()

        powerup.check()

        powerup.setRotation(hexRotation)

    }

    for(let asteriod of asteriods){
        asteriod.draw()

        if(asteriod.reqAnimation){
            asteriod.update()
        }
    }

    for(let star of stars){
        star.draw()
    }

    rotation += 0.001

    hexRotation += 1
}

var progressiveId = null

var xInterval, yInterval

var intervalId = 0

const controller = new CanvasBorderShadowController()

var isMouseDown = false

addEventListener("mouseup", () => {
    isMouseDown = false
})

addEventListener("keydown", (e) => {
    player.keyActivated[e.which] = true
    
    movingKeysActivated[e.which] = true
    
    if ([40, 39, 38, 37].includes(e.which)) {
        e.preventDefault()
        
        return
    }
    
    if(powerUpsUnlocked["push"] && e.which === 81){
        for(let rock of asteriods){
            if(rock.x > player.x && rock.y > player.y - 100 && rock.y && player.y + 100){
                rock.reqAnimation = true
            }
        }
        
        powerUpsUnlocked["push"] = false
    }
    
})

// setInterval(() => {
    //     const frequency = 50
    
    //     if(movingKeysActivated[87]){
        //         scrollPos.y = Math.max(scrollPos.y -  frequency , 0)
        
        //     }
        
        //     if(movingKeysActivated[65]){
            //         scrollPos.x = Math.max(scrollPos.x -  frequency , 0)
            
            //     }
            
            //     if(movingKeysActivated[68]){
//         scrollPos.x = Math.max(scrollPos.x + frequency , 0)

//     }

//     if(movingKeysActivated[83]){
//         scrollPos.y = Math.max(scrollPos.y -  frequency , 0)
//     }

//     // console.log(scrollPos)

//     window.scrollTo({
    //         "behavior": "smooth",
    //         "left": scrollPos.x,
    //         "top": scrollPos.y
    //     })
    
    // } , 20)
    
addEventListener("keyup", (e) => {
    player.keyActivated[e.which] = false
    
    movingKeysActivated[e.which] = false
})

addEventListener("mousedown", () => {
    isMouseDown = true

    if (!inited) return

    intervalId = setInterval(() => {
        if (!isMouseDown) {
            clearInterval(intervalId)
        }

        const angle = Math.atan2(mousePos.y - player.turret.y, mousePos.x - player.turret.x)

        const velocity = {
            x: Math.cos(angle) * superBalls["speed"],
            y: Math.sin(angle) * superBalls["speed"]
        }

        projectiles.push(new Projectile(player.turret.x + 5, player.turret.y + 5, 5, superBalls["color"], velocity, compTank))
    }, 60)

})


const init = () => {
    projectiles = []
    powerups = []
    colors = ["8FBCBB", "#88C0D0", "#81A1C1", "#5E81AC", "#BF616A"]
    mousePos = { x: null, y: null }
    superBalls = { speed: 7, color: "white" }
    powerUpsUnlocked = { "poison": false, "rocket": false, "decrease": false }
    inited = true

    animate()

    spawnPowerUps()

    const element = document.querySelector(".buttons")

    element.classList.add("fade")

    setTimeout(() => {
        element.style.display = "none"
    }, 500)

    for (let i = 0; i < 5; i++) {
        asteriods.push(new Asteriods(Math.random() * innerWidth, Math.random() * innerHeight, compTank))
    }
}

stars = []

const starsAnimation = () => {
    requestAnimationFrame(starsAnimation)

    context.fillStyle = "rgba(46 , 52 , 64 , 0.4)"

    context.fillRect(0, 0, canvas.width, canvas.height)

    // progress.draw()


    // for (let star of stars) {
    //     star.update(rotation)
    // }

    rotation += 0.001

}

starsAnimation()