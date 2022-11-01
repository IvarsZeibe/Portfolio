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
canvas.width = 800;
canvas.height = 600;
// flappyBirdContainer.style.width = "800px";
// flappyBirdContainer.style.height = "600px";
let context = canvas.getContext("2d");
// context.moveTo(0, 0);
// context.lineTo(10, 100);
// context.stroke();
let birdPos = {x: 100, y: 400};
let hasJumped = false;
let velocity = {x: 10, y: 0};
window.setInterval(updateGame, 10);
let dotHitbox = {x: -1, y: -1, w: 0, h: 0};
let isEasterEggActive = false;
function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height); 

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    canvas.width = parseFloat(window.getComputedStyle(canvas, null).width);
    canvas.height = parseFloat(window.getComputedStyle(canvas, null).height);

    let vw = canvas.width / 100;
    let vh = canvas.height / 100;
    
    context.font = `bold 10vw TimesNewRoman`;
    context.fillStyle = "lightblue";
    context.fillText("Ivars Žeibe", 5 * vw, 10 * vw + 20 * vh);

    let text = context.measureText("Ivars Že");
    let text2 = context.measureText(".");
    dotHitbox.x = 5 * vw + text.width;
    dotHitbox.y = 20 * vh - 8 * vw + text2.width * 4;
    dotHitbox.w = text2.width;
    dotHitbox.h = text2.width;
    if (isEasterEggActive) {
        context.clearRect(5 * vw + text.width, 20 * vh - 8 * vw + text2.width * 4, text2.width, text2.width * 1);
    }

    birdPos.x += velocity.x * 0.1;
    birdPos.y += velocity.y * 0.1;
    velocity.y += 1;
    if (velocity.y > 40) {
        velocity.y = 40;
    }
    // birdPos.x += 1;
    // birdPos.y += 0.6;
    //context.moveTo(birdPos.x, birdPos.y);
    context.beginPath();
    context.arc(birdPos.x - 25, birdPos.y - 25, 50, 0, 2 *Math.PI);
    context.stroke();
    hasJumped = false;
}
drawObstalce(context, createObstacle());
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
        birdPos.x = 100;
        birdPos.y = 400;
        velocity.y = 0;
        velocity.x = 10;
    }
})


function createObstacle() {
    // x, gapY, gapHeight
    return {
        x: canvas.width - 100,
        gapY: 200 + Math.random() * 200,
        //gapHeight: 200 + Math.random() * 200, //200-400
        gapHeight: 200,
        width: 50
    };
}

function drawObstalce(ctx, obstacle) {
    let topRectHeight = obstacle.gapY - obstacle.gapHeight / 2;
    let bottomRectHeight = canvas.height - (obstacle.gapY + obstacle.gapHeight / 2);
    ctx.fillRect(obstacle.x - obstacle.width / 2, 0, obstacle.width, topRectHeight);
    ctx.fillRect(obstacle.x - obstacle.width / 2, canvas.height - bottomRectHeight, obstacle.width, bottomRectHeight);
    console.log(obstacle.x - obstacle.width / 2, 0, obstacle.width, topRectHeight)
    console.log(obstacle.x - obstacle.width / 2, canvas.height - bottomRectHeight, obstacle.width, bottomRectHeight)
    console.log(obstacle.gapY, obstacle.gapHeight, canvas.height)
}

document.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    if (isPointInRectangleFromTopLeft(e.clientX - rect.left, e.clientY - rect.top, dotHitbox.x, dotHitbox.y, dotHitbox.w, dotHitbox.h)) {
        console.log("true");
        isEasterEggActive = true;
    }
});


function isPointInRectangleFromTopLeft(x, y, x1, y1, w1, h1) {
    return isPointInRectangle(x, y, x1 + w1/2, y1 + h1/2, w1, h1);
}
function isPointInRectangle(x, y, x1, y1, w1, h1) {
    return (x >= x1 - w1 / 2 && x <= x1 + w1 / 2) && (y >= y1 - h1 / 2 && y <= y1 + h1 / 2);
}