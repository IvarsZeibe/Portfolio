console.log("hello")

function scrollInto(id) {
    document.getElementById(id).scrollIntoView(true);
}

let el = document.getElementsByTagName("h1")[0];

function startDoomsday() {
    el.style.fontSize = "500px";
    window.scrollTo(0, 0);
    let x = window.setInterval(changeColor, 50);
    let y = window.setInterval(rotate, 0);
}


function changeColor() {
    switch(el.style.color) {
        case "red":
            el.style.color = "blue";
            break;
        case "blue":
            el.style.color = "yellow";
            break;
        case "yellow":
            el.style.color = "green";
            break;
        default:
            el.style.color = "red";
            break;
    }
    
    switch(el.style.color) {
        case "red":
            el.style.backgroundColor = "green";
            break;
        default:
            el.style.backgroundColor = "red";
            break;
    }
    
    switch(document.body.style.backgroundColor) {
        case "yellow":
            document.body.style.backgroundColor = "black";
            break;
        default:
            document.body.style.backgroundColor = "yellow";
            break;
    }
    
}
let rotation = 0;
function rotate() {
    el.style.transform = `rotate(-${rotation}deg)`;
    rotation++;
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
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}


function openNavigation() {
    let nav = document.getElementById("nav");
    nav.style.top = "0";
    if (nav.className === "nav") {
        nav.className += " responsive";
    } else {
        nav.className = "nav";
    }
}

/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    let nav = document.getElementById("nav");
    if (prevScrollpos > currentScrollPos) {
        nav.style.top = "0";
    } else {
        nav.style.top = `-${document.getElementById("nav").offsetHeight - 5}px`;
        nav.className = "nav";
    }
    prevScrollpos = currentScrollPos;
}
function hideNavigation() {    
    nav.style.top = `-${document.getElementById("nav").offsetHeight - 5}px`;
    nav.className = "nav";
}
