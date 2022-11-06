function startDoomsday() {
    let el = document.getElementById("hero");

    el.style.fontSize = "500px";
    el.style.backgroundImage = "none";
    document.body.style.backgroundImage = "none";

    window.scrollTo(0, 0);
    window.setInterval(() => changeColor(el), 50);

    let rotation = { value: 0 };
    window.setInterval(() => rotate(el, rotation), 0);
}

function changeColor(el) {
    el.style.color = nextColor(el.style.color, ["red", "blue", "yellow", "green"]);
    el.style.backgroundColor = nextColor(el.style.backgroundColor, ["pink", "springgreen"]);
    document.body.style.backgroundColor = nextColor(document.body.style.backgroundColor, ["yellow", "black"]);    
}

function nextColor(currentColor, allColors) {
    let currentColorIndex = allColors.indexOf(currentColor);
    if (currentColorIndex + 1 < allColors.length) {
        return allColors[currentColorIndex + 1];
    } else {
        return allColors[0];
    }
}

function rotate(el, rotation) {
    el.style.transform = `rotate(-${rotation.value}deg)`;
    rotation.value++;
}


//https://www.w3schools.com/howto/howto_js_slideshow.asp
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("my-slides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].classList.add("active");
}

document.getElementById("navigationButton").addEventListener("click", () => {
    let nav = document.getElementById("nav");
    if (!nav.classList.contains("open")) {
        nav.classList.add("open");
        nav.style.top = "0";
    } else {
        nav.classList.remove("open");
    }
});

// Shows and hides navigation on scroll
var previousScrollPosition = window.pageYOffset;
window.onscroll = () => {
    var currentScrollPos = window.pageYOffset;

    let nav = document.getElementById("nav");
    nav.classList.remove("open");

    if (previousScrollPosition > currentScrollPos) {
        nav.style.top = "0";
    } else {
        nav.style.top = `-${nav.offsetHeight - 5}px`;
    }
    previousScrollPosition = currentScrollPos;
}


class Hitbox {
    constructor(shape, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.shape = shape;
        if (shape == "rectangle") {
            this.width = width;
            this.height = height;
        } else if (shape ==  "circle") {
            this.radius = width / 2;
        } else {
            throw "Invalid shape";
        }
    }
    static createRectangle(x, y, width, height) {
        return new Hitbox("rectangle", x, y, width, height);
    }
    static createCircle(x, y, radius) {
        return new Hitbox("circle", x, y, radius*2);
    }
    isCollidingWithPoint(x, y) {
        if (this.shape = "rectangle") {
            let halfWidth = this.width / 2;
            let halfHeight = this.height / 2;
            return (
                x >= this.x - halfWidth && x <= this.x + halfWidth &&
                y >= this.y - halfHeight && y <= this.y + halfHeight
            );
        } else {
            throw "Not implemented";
        }
    }
    isCollidingWith(hitbox) {
        if (hitbox.shape == "rectangle") {
            if (this.shape == "rectangle") {
                return this.isCollidingRectangleRectangle(this, hitbox);
            } else {
                return this.isCollidingRectangleCircle(this, hitbox);
            }
        } else {
            if (this.shape == "rectangle") {
                return this.isCollidingRectangleCircle(this, hitbox);
            } else {
                throw "Not implemented";
            }
        }
    }
    isCollidingRectangleRectangle() {
        throw "Not implemented"
    }
    isCollidingRectangleCircle(rectangle, circle) {
        return (
            circle.x + circle.radius > rectangle.x - rectangle.width/2 &&
            circle.x - circle.radius < rectangle.x + rectangle.width/2 &&
            circle.y + circle.radius > rectangle.y - rectangle.height/2 &&
            circle.y - circle.radius < rectangle.y + rectangle.height/2
        );
    }
}
class Obstacle {
    constructor(x, y, width, height) {
        this.width = width;
        this.height = height; 
        this.gapHeight = height*0.2;
        this.gapY = this.gapHeight + Math.random() * (height - 2*this.gapHeight); 
        this.topPartHeight = this.gapY - this.gapHeight / 2;
        this.bottomPartHeight = height - (this.gapY + this.gapHeight / 2);
        
        this.topPartHitbox = Hitbox.createRectangle(x - this.width/2, y - this.height/2 + this.topPartHeight/2, this.width, this.topPartHeight);
        this.bottomPartHitbox = Hitbox.createRectangle(x - this.width/2, y + this.height/2 - this.bottomPartHeight/2, this.width, this.bottomPartHeight);
    }
    move(x, y) {
        this.topPartHitbox.x += x;
        this.topPartHitbox.y += y;
        this.bottomPartHitbox.x += x;
        this.bottomPartHitbox.y += y;
    }
    isCollidingWith(hitbox) {
        return this.topPartHitbox.isCollidingWith(hitbox) || this.bottomPartHitbox.isCollidingWith(hitbox);
    }
    draw(context) {
        context.fillStyle = "lightblue";
        context.fillRect(
            this.topPartHitbox.x - this.topPartHitbox.width/2,
            this.topPartHitbox.y - this.topPartHitbox.height/2,
            this.topPartHitbox.width,
            this.topPartHitbox.height
        );
        context.fillRect(
            this.bottomPartHitbox.x - this.bottomPartHitbox.width/2,
            this.bottomPartHitbox.y - this.bottomPartHitbox.height/2,
            this.bottomPartHitbox.width,
            this.bottomPartHitbox.height
        );
    }
}

let canvas = document.getElementById("hero");
let context = canvas.getContext("2d");
let birdHitbox = Hitbox.createCircle(100, 400, 20)
let hasJumped = false;
let velocity = {x: 10, y: 0};
window.setInterval(updateGame, 10);
let dotHitbox = Hitbox.createRectangle(-1, -1, 0, 0);
let isEasterEggActive = false;
let isEasterEggStarted = false;
let starPosition = {x: 100, y: 400};
let obstacles = [];
let currenTick = 0;
let obstacleSpawnedTick = 0;
const obstacleSpawningCooldown = 100;
let vh = 0;
let vw = 0;

function updateGame() {
    currenTick++;
    context.clearRect(0, 0, canvas.width, canvas.height); 
    
    const ratio = Math.ceil(window.devicePixelRatio);
    canvas.width = parseFloat(window.getComputedStyle(canvas, null).width) * ratio;
    canvas.height = parseFloat(window.getComputedStyle(canvas, null).height) * ratio;
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);

    vw = canvas.width / ratio / 100;
    vh = canvas.height / ratio / 100;
    
    let navHeight = parseFloat(window.getComputedStyle(document.getElementById("nav"), null).height);
    const ceilingHeight = navHeight + 4*vh;
    starPosition.x = 10*vh;
    starPosition.y = (canvas.height - ceilingHeight) / ratio / 2;

    const fontSize = 10*vw;
    context.font = `bold 10vw TimesNewRoman`;
    if (isEasterEggActive) {
        context.fillStyle = "#add8e644";
    } else {
        context.fillStyle = "lightblue"; // #add8e6
    }

    let text = context.measureText("Ivars Že");
    let text2 = context.measureText(".");
    let text3 = context.measureText("i");
    
    const textPaddingLeft = 5*vw;
    const textPaddingTop = 20*vh
    context.fillText("Ivars Žeibe", textPaddingLeft, fontSize + textPaddingTop);
    context.fillStyle = "#81c1d6";
    context.save();
    context.rect(dotHitbox.x - dotHitbox.width/2, dotHitbox.y - dotHitbox.height/2, dotHitbox.width, dotHitbox.height);
    context.clip();
    context.fillText("i", textPaddingLeft + text.width, fontSize + textPaddingTop);
    context.restore();

    if (isEasterEggActive || isEasterEggStarted) {        
        // clears dot
        context.clearRect(dotHitbox.x - dotHitbox.width/2, dotHitbox.y - dotHitbox.height/2, dotHitbox.width, dotHitbox.height);
    }

    dotHitbox.width = text2.width * 0.8;
    dotHitbox.height = text2.width * 0.9;
    dotHitbox.x = textPaddingLeft + text.width + (text3.width - text2.width)/2 + text2.width * 0.12 + dotHitbox.width / 2;
    dotHitbox.y = textPaddingTop - 8 * vw + text2.width * 4 + text2.width * 0.3 + dotHitbox.height / 2;
    birdHitbox.radius = dotHitbox.width/2;
    // Transparent overlay
    // context.fillStyle = "#00000044"
    // context.fillRect(dotHitbox.x - dotHitbox.width/2, dotHitbox.y - dotHitbox.height/2, dotHitbox.width, dotHitbox.height);

    if (isEasterEggStarted) {
        let c = Math.sqrt(Math.pow(starPosition.x - birdHitbox.x, 2) + Math.pow(starPosition.y - birdHitbox.y, 2));
        let speed = 0.5 * Math.sqrt(vw*vw + vh*vh);
        birdHitbox.x += (starPosition.x - birdHitbox.x) / c * speed;
        birdHitbox.y += (starPosition.y - birdHitbox.y) / c * speed;
        if (Math.abs(starPosition.x - birdHitbox.x) + Math.abs(starPosition.x - birdHitbox.x) < speed*2) {
            isEasterEggStarted = false;
            isEasterEggActive = true;
        }
        
        // draw dot
        context.fillStyle = "lightblue";
        context.beginPath();
        context.arc(birdHitbox.x, birdHitbox.y, birdHitbox.radius, 0, 2 *Math.PI);
        context.fill();
    }

    if (isEasterEggActive) {
        // draw ceiling
        drawCeiling(canvas.width / ratio, ceilingHeight)

        birdHitbox.y += velocity.y * 0.1;
        velocity.y += 0.15*vh;
        // draw dot
        context.fillStyle = "lightblue";
        context.beginPath();
        context.arc(birdHitbox.x, birdHitbox.y, birdHitbox.radius, 0, 2 *Math.PI);
        context.fill();

        hasJumped = false;

        if (currenTick - obstacleSpawnedTick > obstacleSpawningCooldown) {
            obstacles.push(new Obstacle(canvas.width / ratio - 100, (canvas.height / ratio - 10*vh) / 2 + ceilingHeight, 4*vw, canvas.height / ratio - 10*vh)); // maybe 10vh
            obstacleSpawnedTick = currenTick;
        }
        obstacles.forEach(o => {
            o.move(-0.4*vw, 0);
            o.draw(context);
        });
        if (birdHitbox.y - birdHitbox.radius < ceilingHeight || birdHitbox.y + birdHitbox.radius > canvas.height / ratio) {
            resetFlappyBird();
        } else {
            obstacles.some(o => {
                if (o.isCollidingWith(birdHitbox)) {
                    resetFlappyBird();
                    return true;
                }
                return false;
            })
        }
        
    }
}
function drawCeiling(width, height) {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
}
document.addEventListener("keydown", (e) => {
    if (e.key == " " && e.target == document.body) {
        e.preventDefault();
        jump();
    }
    else if (e.key == "r" && e.target == document.body) {
        e.preventDefault();
        resetFlappyBird();
    }
});
function resetFlappyBird() {
    birdHitbox.x = starPosition.x;
    birdHitbox.y = starPosition.y;
    velocity.y = 0;
    velocity.x = 10;
    obstacles = [];
}
document.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    if (!isEasterEggStarted && !isEasterEggActive && dotHitbox.isCollidingWithPoint(e.clientX - rect.left, e.clientY - rect.top)) {
        // && isPointInRectangleFromTopLeft(e.clientX - rect.left, e.clientY - rect.top, dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h)) {
        birdHitbox.x = dotHitbox.x;
        birdHitbox.y = dotHitbox.y;
        isEasterEggStarted = true;
    }
});
canvas.addEventListener("mousedown", jump)
function jump() {
    if (isEasterEggActive && !hasJumped) {
        velocity.y = -6*vh;
        hasJumped = true;
    }
}