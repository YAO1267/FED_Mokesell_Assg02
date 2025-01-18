//check if the user has logged in 
window.onload = checkLoginStatus;

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

function checkLoginStatus(){
    const useremail = JSON.parse(sessionStorage.getItem("loginemail")) 
    if (useremail) {
        // If email exists, user is logged in
        document.getElementById('myAccountLink').style.display = 'inline';
        document.getElementById('loginLink').style.display = 'none';
    } else {
        // If no email, user is not logged in
        document.getElementById('myAccountLink').style.display = 'none';
        document.getElementById('loginLink').style.display = 'inline';
    }
}



function click_my_account(evt, page_name) {
    if (page_name == 'MokeSell') {
        useremail =JSON.parse(sessionStorage.getItem("loginemail"))  
        window.location.href = "index.html"
    }
    else if(page_name == 'Clothes'){
        useremail =JSON.parse(sessionStorage.getItem("loginemail"))  
        window.location.href = "#"
    }
    else if(page_name == "Shoes"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail")) 
        window.location.href = "#"
    } 
    else if(page_name == "Home-decor"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail")) 
        window.location.href = "#"
    } 
    else if(page_name == "shopping"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail")) 
        window.location.href = "#"
    }
    else if(page_name == "Login"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail"))  
        window.location.href = "login.html"
    }
    else if(page_name == "my_account"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail"))  
        window.location.href = "#"
     }
}


let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

document.getElementById("spinButton").addEventListener("click", function () {
    let wheel = document.getElementById("wheel");

    // Generate a random rotation angle (multiples of 360)
    let randomDegree = Math.floor(Math.random() * 3600) + 3600; // At least 10 full spins

    // Apply rotation
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    // Calculate the prize after spin
    setTimeout(() => {
        let finalDegree = randomDegree % 360; // Get final position
        let prize = getPrize(finalDegree);
        document.getElementById("result").innerText = "You won: " + prize;
    }, 4000); // Wait for animation to finish
});

function getPrize(degree) {
    // Assume 6 prizes, divide 360 degrees into 6 parts (60 degrees each)
    if (degree >= 0 && degree < 60) return "10% Off Coupon";
    if (degree >= 60 && degree < 120) return "Free Shipping";
    if (degree >= 120 && degree < 180) return "20% Off Coupon";
    if (degree >= 180 && degree < 240) return "Buy 1 Get 1 Free";
    if (degree >= 240 && degree < 300) return "No Prize 😢";
    if (degree >= 300 && degree < 360) return "50% Off Coupon";
}
