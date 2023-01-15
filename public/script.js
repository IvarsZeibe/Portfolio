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

// Shows and hides navigation menu and scroll to top button
var previousScrollPosition = window.pageYOffset;
window.onscroll = () => {
    var currentScrollPos = window.pageYOffset;

    let nav = document.getElementById("nav");
    nav.classList.remove("open");

    let scrollToTopButton = document.getElementById('scrollToTopButton');

    let isNearPageTop = currentScrollPos <= parseFloat(window.getComputedStyle(nav, null).height);

    if (previousScrollPosition > currentScrollPos) {
        nav.style.top = "0";
        if (isNearPageTop) {
            scrollToTopButton.style.visibility = 'hidden';
        }
    } else if (!isNearPageTop) {
        nav.style.top = `-${nav.offsetHeight - 5}px`;
        scrollToTopButton.style.visibility = 'visible';
    }
    previousScrollPosition = currentScrollPos;
}

// sends form data
let form = document.getElementById('messageForm');
form.onsubmit = async (e) => {
    e.preventDefault();
    fetch(window.location.href, {
        method: 'POST',
        body: new FormData(form)
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                alert("Error, form not sent");
                throw new Error(text);
            })
        } else {
            return response.text().then(text => alert(text))
        }
    })
}

// Flappy bird easter egg game
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
    constructor(x, y, width, height, minGapY = 0, maxGapY = 1) {
        this.x = x;
        this.width = width;
        this.height = height; 
        this.gapHeight = height*0.2;
        this.gapY = this.gapHeight + Math.min(Math.max(Math.random(), minGapY), maxGapY) * (height - 2*this.gapHeight); 
        this.topPartHeight = this.gapY - this.gapHeight / 2;
        this.bottomPartHeight = height - (this.gapY + this.gapHeight / 2);
        
        this.topPartHitbox = Hitbox.createRectangle(x - this.width/2, y - this.height/2 + this.topPartHeight/2, this.width, this.topPartHeight);
        this.bottomPartHitbox = Hitbox.createRectangle(x - this.width/2, y + this.height/2 - this.bottomPartHeight/2, this.width, this.bottomPartHeight);
    }
    move(x, y) {
        this.x += x;
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
const bird = {
    hitbox: Hitbox.createCircle(100, 400, 20),
    velocity: {x: 10, y: 0},
    hasJumped: true,
    jump: function() {
        if (game.isActive && !this.hasJumped) {
            this.velocity.y = -6*screen.vh;
            this.hasJumped = true;
        }
    }
}

const screen = {
    canvas: document.getElementById("hero"),
    vh: 0,
    vw: 0,
    ceilingHeight: 0,
    width: 0,
    height: 0,
    ratio: 1,
    dotHitbox: Hitbox.createRectangle(-1, -1, 0, 0),
    update: function() {
        let context = this.canvas.getContext("2d");
        
        // set canvas size
        ratio = Math.ceil(window.devicePixelRatio);
        this.canvas.width = parseFloat(window.getComputedStyle(this.canvas, null).width) * ratio;
        this.canvas.height = parseFloat(window.getComputedStyle(this.canvas, null).height) * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        
        this.width = this.canvas.width / ratio;
        this.height = this.canvas.height / ratio;
        this.vw = this.width / 100;
        this.vh = this.height / 100;
        
        let navHeight =  parseFloat(window.getComputedStyle(document.getElementById("nav"), null).height);
        this.ceilingHeight = navHeight;
        
        
        const textPaddingLeft = 5*this.vw;
        const textPaddingTop = 20*this.vh;
    
        context.font = `bold 10vw TimesNewRomanBold`;
        context.fillStyle = this.isActive ? "#add8e644" : "lightblue"; // lightblue == #add8e6
        let text = context.measureText("Ivars Že");
        let text2 = context.measureText(".");
        let text3 = context.measureText("i");
        
        this.dotHitbox.width = text2.width * 0.8;
        this.dotHitbox.height = text2.width * 0.9;
        this.dotHitbox.x = textPaddingLeft + text.width + (text3.width - text2.width)/2 + text2.width * 0.12 + this.dotHitbox.width / 2;
        this.dotHitbox.y = textPaddingTop - 8 * this.vw + text2.width * 4 + text2.width * 0.3 + this.dotHitbox.height / 2;
    
        bird.hitbox.radius = this.dotHitbox.width/2;
        game.startPosition.x = 10*this.vh;
        game.startPosition.y = (this.height - this.ceilingHeight) / 2;
        
    }
};
const game = {
    isActive: false,
    isIntroActive: false,
    currenTick: 0,
    lastResetTick: 0,
    obstacles: [],
    obstacleSpawnedTick: 0,
    obstacleSpawningCooldown: 100,
    score: 0,
    highestScore: 0,
    startPosition: {x: 0, y: 0},
    reset: function() {
        bird.hitbox.x = this.startPosition.x;
        bird.hitbox.y = this.startPosition.y;
        bird.velocity.y = 0;
        bird.velocity.x = 10;
        this.obstacles = [];
        this.score = 0;
        this.lastResetTick = this.currenTick;
        this.obstacleSpawnedTick = this.lastResetTick;
    },
    redraw: function() {
        let context = screen.canvas.getContext("2d");
        // clear canvas
        context.clearRect(0, 0, screen.width, screen.height); 
        
        const fontHeight = 10*screen.vw;
        context.font = `bold 10vw TimesNewRomanBold`;
        context.fillStyle = this.isActive ? "#add8e644" : "lightblue"; // lightblue == #add8e6

        const textPaddingLeft = 5*screen.vw;
        const textPaddingTop = 20*screen.vh;

        let text = context.measureText("Ivars Že");  
        
        // draw title
        context.fillText("Ivars Žeibe", textPaddingLeft, fontHeight + textPaddingTop);
        context.fillStyle = "#81c1d6";
        
        // draws dot only if font is loaded
        if (document.fonts.check(context.font)) {
            context.save();
            context.rect(screen.dotHitbox.x - screen.dotHitbox.width/2, screen.dotHitbox.y - screen.dotHitbox.height/2, screen.dotHitbox.width, screen.dotHitbox.height);
            context.clip();
            context.fillText("i", textPaddingLeft + text.width, fontHeight + textPaddingTop);
            context.restore();
        }

        if (this.isActive) {        
            // clears dot above i letter
            context.clearRect(screen.dotHitbox.x - screen.dotHitbox.width/2, screen.dotHitbox.y - screen.dotHitbox.height/2, screen.dotHitbox.width, screen.dotHitbox.height);

            // write score
            context.font = `bold 8${screen.vh < screen.vw ? "vh" : "vw"} TimesNewRomanBold`;
            context.fillText(`Score: ${this.score}|${this.highestScore}`, textPaddingLeft, screen.height - 15*screen.vh);
            
            // draw bird
            context.fillStyle = "lightblue";
            context.beginPath();
            context.arc(bird.hitbox.x, bird.hitbox.y, bird.hitbox.radius, 0, 2*Math.PI);
            context.closePath();
            context.fill();
            
            // draw ceiling
            context.fillStyle = "#000000";
            context.fillRect(0, 0, screen.width, screen.ceilingHeight);

            // draw obstacles
            this.obstacles.forEach(o => o.draw(context));
        }
    },
    update: function() {
        this.redraw();
        if (this.isIntroActive) {
            let distanceFromStartToBird = Math.sqrt(Math.pow(this.startPosition.x - bird.hitbox.x, 2) + Math.pow(this.startPosition.y - bird.hitbox.y, 2));
            let speed = 0.5 * Math.sqrt(screen.vw*screen.vw + screen.vh*screen.vh);
            bird.hitbox.x += (this.startPosition.x - bird.hitbox.x) / distanceFromStartToBird * speed;
            bird.hitbox.y += (this.startPosition.y - bird.hitbox.y) / distanceFromStartToBird * speed;
            if (Math.abs(this.startPosition.x - bird.hitbox.x) + Math.abs(this.startPosition.x - bird.hitbox.x) < speed*2) {
                this.isIntroActive = false;
            }
        } else if (this.isActive) {
            this.currenTick++;    
            bird.hitbox.y += bird.velocity.y * 0.1;
            bird.velocity.y += 0.15*screen.vh;
            bird.hasJumped = false;
            const obstacleMovementSpeed = -0.4*screen.vw;
    
            let obstacleWidth = 4*screen.vw;
            if (this.currenTick - this.obstacleSpawnedTick > this.obstacleSpawningCooldown) {
                let obstacle = new Obstacle(
                    screen.width + obstacleWidth/2,
                    (screen.height - 10*screen.vh) / 2 + screen.ceilingHeight,
                    obstacleWidth,
                    screen.height - 10*screen.vh,
                    0, 0.9);
                this.obstacles.push(obstacle); 
                this.obstacleSpawnedTick = this.currenTick;
            }
            let startingOffset = (screen.width + obstacleWidth - bird.hitbox.x) / Math.abs(obstacleMovementSpeed);
            this.score = Math.max(0, Math.floor((this.currenTick - this.lastResetTick - startingOffset) / this.obstacleSpawningCooldown));

            if (this.score > this.highestScore) {
                this.highestScore = this.score;
            }

            this.obstacles.forEach(o => {
                o.move(obstacleMovementSpeed, 0);
            });
            this.obstacles = this.obstacles.filter(o => o.x >= -o.width / 2);
            if (bird.hitbox.y - bird.hitbox.radius < screen.ceilingHeight || bird.hitbox.y + bird.hitbox.radius > screen.height) {
                this.reset();
            } else {
                this.obstacles.some(o => {
                    if (o.isCollidingWith(bird.hitbox)) {
                        this.reset();
                        return true;
                    }
                    return false;
                })
            }
            
        }
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key == " " && e.target == document.body) {
        e.preventDefault();
        bird.jump();
    }
    else if (e.key == "r" && e.target == document.body) {
        e.preventDefault();
        game.reset();
    }
});
document.addEventListener("click", (e) => {
    let rect = screen.canvas.getBoundingClientRect();
    if (!game.isActive && screen.dotHitbox.isCollidingWithPoint(e.clientX - rect.left, e.clientY - rect.top)) {
        bird.hitbox.x = screen.dotHitbox.x;
        bird.hitbox.y = screen.dotHitbox.y;
        game.isActive = true;
        game.isIntroActive = true;
        console.log(game.isIntroActive);
        window.setInterval(() => game.update(), 10);
    }
});
screen.canvas.addEventListener("mousedown", () => {
    bird.jump(); // needs to be wrapped in a function because otherwise the function doesn't belong to bird
});
addEventListener("resize", () => {
    screen.update();
    game.redraw();
});
document.fonts.ready.then(() => {
    screen.update();
    game.redraw();
});