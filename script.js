function startDoomsday() {
    let el = document.getElementsByTagName("h1")[0];

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


let canvas = document.getElementById("flappyBird");
let context = canvas.getContext("2d");
let birdPos = {x: 100, y: 400};
let hasJumped = false;
let velocity = {x: 10, y: 0};
window.setInterval(updateGame, 10);
let dotHitbox = {x: -1, y: -1, w: 0, h: 0};
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
    
    canvas.width = parseFloat(window.getComputedStyle(canvas, null).width);
    canvas.height = parseFloat(window.getComputedStyle(canvas, null).height);

    vw = canvas.width / 100;
    vh = canvas.height / 100;
    
    context.font = `bold 10vw TimesNewRoman`;
    context.fillStyle = "lightblue";
    context.fillText("Ivars Žeibe.", 5 * vw, 10 * vw + 20 * vh);

    let text = context.measureText("Ivars Že");
    let text2 = context.measureText(".");
    let text3 = context.measureText("i");
    dotHitbox.w = text2.width * 0.8;
    dotHitbox.h = text2.width * 0.9;
    dotHitbox.x = 5 * vw + text.width + (text3.width - text2.width)/2 + text2.width * 0.12;
    dotHitbox.y = 20 * vh - 8 * vw + text2.width * 4 + text2.width * 0.3;
    // Transparent overlay
    // context.fillStyle = "#00000044"
    // context.fillRect(dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h);

    if (isEasterEggStarted) {
        let c = Math.sqrt(Math.pow(starPosition.x - birdPos.x, 2) + Math.pow(starPosition.y - birdPos.y, 2));
        let speed = 5;
        birdPos.x += (starPosition.x - birdPos.x) / c * speed;
        birdPos.y += (starPosition.y - birdPos.y) / c * speed;
        if (Math.abs(starPosition.x - birdPos.x) + Math.abs(starPosition.x - birdPos.x) < speed*2) {
            isEasterEggStarted = false;
            isEasterEggActive = true;
        }
        
        context.clearRect(dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h);
        // draw dot
        context.beginPath();
        context.arc(birdPos.x, birdPos.y, dotHitbox.w/2, 0, 2 *Math.PI);
        context.stroke();
    }

    if (isEasterEggActive) {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, 10 * vh);

        // clears dot
        context.clearRect(dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h);

        birdPos.y += velocity.y * 0.1;
        velocity.y += 1;
        // draw dot
        context.beginPath();
        context.arc(birdPos.x, birdPos.y, 20, 0, 2 *Math.PI);
        context.stroke();
        hasJumped = false;
        if (currenTick - obstacleSpawnedTick > obstacleSpawningCooldown) {
            obstacles.push(createObstacle(canvas.width - 100, (canvas.height - 10*vh) / 2 + 10*vh, 20, canvas.height - 10*vh)); // maybe 10vh
            obstacleSpawnedTick = currenTick;
        }
        obstacles.forEach(o => {
            o.x -= 5;
            drawObstalce(context, o);
        });
        obstacles.some(o => {
            let topRectHeight = o.gapY - o.gapHeight / 2;
            let bottomRectHeight = o.height - (o.gapY + o.gapHeight / 2);
            // overlay
            // context.fillStyle = "#00000044"
            // drawRect(context, o.x, o.y - o.height/2 + topRectHeight/2, o.width, topRectHeight);
            // drawRect(context, o.x, o.y + o.height/2 - bottomRectHeight/2, o.width, bottomRectHeight);

            if (isCollidingCircleRecteangle(birdPos.x, birdPos.y, 20, o.x, o.y - o.height/2 + topRectHeight/2, o.width, topRectHeight) ||
            isCollidingCircleRecteangle(birdPos.x, birdPos.y, 20, o.x, o.y + o.height/2 - bottomRectHeight/2, o.width, bottomRectHeight)) {
                resetFlappyBird();
                return true;
            }
            return false;
        })
        
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key == " " && e.target == document.body) {
        e.preventDefault();
        if (!hasJumped) {
            velocity.y = -40;
            hasJumped = true;
        }
    }
})
document.addEventListener("keydown", (e) => {
    if (e.key == "r" && e.target == document.body) {
        e.preventDefault();
        resetFlappyBird();
    }
})
function resetFlappyBird() {
    birdPos.x = 100;
    birdPos.y = 400;
    velocity.y = 0;
    velocity.x = 10;
}


function createObstacle(x, y, w, h) {
    // x, gapY, gapHeight
    let _gapHeight = h * 0.2;
    return {
        x: x,
        y: y,
        gapY: _gapHeight + Math.random() * (h - 2 *_gapHeight),
        //gapHeight: 200 + Math.random() * 200, //200-400
        gapHeight: _gapHeight,
        width: w,
        height: h
    };
}

function drawObstalce(ctx, obstacle) {
    let topRectHeight = obstacle.gapY - obstacle.gapHeight / 2;
    let bottomRectHeight = obstacle.height - (obstacle.gapY + obstacle.gapHeight / 2);
    ctx.strokeRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, topRectHeight);
    ctx.strokeRect(obstacle.x - obstacle.width / 2, obstacle.y + obstacle.height / 2 - bottomRectHeight, obstacle.width, bottomRectHeight);
}


document.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    if (!isEasterEggStarted && !isEasterEggActive && isPointInRectangleFromTopLeft(e.clientX - rect.left, e.clientY - rect.top, dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h)) {
        birdPos.x = dotHitbox.x + dotHitbox.w/2 ;
        birdPos.y = dotHitbox.y + dotHitbox.h/2;
        isEasterEggStarted = true;
    }
});


function isPointInRectangleFromTopLeft(x, y, x1, y1, w1, h1) {
    return isPointInRectangle(x, y, x1 + w1/2, y1 + h1/2, w1, h1);
}
function isPointInRectangle(x, y, x1, y1, w1, h1) {
    return (x >= x1 - w1 / 2 && x <= x1 + w1 / 2) && (y >= y1 - h1 / 2 && y <= y1 + h1 / 2);
}
function startEasterEgg() {
    let x = 0;
    birdPos.x = dotHitbox.x + dotHitbox.w/2;
    birdPos.y = dotHitbox.y + dotHitbox.h/2;
    window.setTimeout(() => {
        x++;
        let c = Math.sqrt((starPosition.x - birdPos.x)^2 + (starPosition.y - birdPos.y)^2);
        let speed = 10;
        birdPos.x += birdPos.x / c * speed;
        birdPos.y += birdPos.y / c * speed;
    }, 10)
}
function isCollidingCircleRecteangle(x1, y1, r, x2, y2, w, h) {
    return x1 + r/2 > x2 - w/2 && x1 - r/2 < x2 + w/2 && y1 + r/2 > y2 - h/2 && y1 - r/2 < y2 + h/2;
}
function drawRect(context, x, y ,w ,h) {
    context.fillRect(x - w/2, y - h/2, w, h);
}