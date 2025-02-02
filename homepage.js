//check if the user has logged in 
window.onload = checkLoginStatus;

//nav bar
function toggleMenu() {
    let menu = document.getElementById("offCanvasMenu");
    let overlay = document.getElementById("overlay");

    menu.classList.toggle("show");
    overlay.classList.toggle("show");
}
// Close menu when clicking outside or on the overlay
window.onclick = function(event) {
    let menu = document.getElementById("offCanvasMenu");
    let overlay = document.getElementById("overlay");
    let hamburger = document.querySelector(".hamburger");
    let othersLink = document.querySelector(".nav-links a:last-child"); // "Others" Link

    if (!menu.contains(event.target) && !hamburger.contains(event.target) && !othersLink.contains(event.target)) {
        menu.classList.remove("show");
        overlay.classList.remove("show");
    }
};


// Close menu when clicking outside
window.onclick = function(event) {
    let menu = document.getElementById("offCanvasMenu");
    let hamburger = document.querySelector(".hamburger");
    let othersLink = document.querySelector(".nav-links a:last-child"); // "Others" Link

    if (!menu.contains(event.target) && !hamburger.contains(event.target) && !othersLink.contains(event.target)) {
        menu.classList.remove("show");
    }
};

function checkLoginStatus(){
    const useremail = JSON.parse(sessionStorage.getItem("loginemail")) 
    if (useremail) {
        // If email exists, user is logged in
        document.getElementById('myAccountLink').style.display = 'inline';
        document.getElementById('loginLink').style.display = 'none';
        openPopup()
    } else {
        // If no email, user is not logged in
        document.getElementById('myAccountLink').style.display = 'none';
        document.getElementById('loginLink').style.display = 'inline';
    }
}


function openPopup() {
    if (!sessionStorage.getItem("popupShown")) {
        document.getElementById("popup").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        
        // Set flag in localStorage to prevent future popups
        sessionStorage.setItem("popupShown", "true");
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
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

let currentIndex = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const caption = document.getElementById('caption');
  
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    }
  
    slides.forEach((slide) => {
      slide.classList.remove('active'); // Hide all slides
    });
  
    slides[currentIndex].classList.add('active'); // Show current slide
    caption.textContent = `${currentIndex + 1} / ${slides.length}`; // Update slide number
  }
  

  function changeSlide(direction) {
    currentIndex += direction;
    showSlide(currentIndex);
  }

  // Initial call to display the first slide
  showSlide(currentIndex);

  // Automatically change slides every 3 seconds
  function startSlideshow() {
    slideInterval = setInterval(() => {
      currentIndex++;
      showSlide(currentIndex);
    }, 1500);
  }

  // Pause the slideshow
  function pauseSlideshow() {
    clearInterval(slideInterval);
  }

  // Resume the slideshow
  function resumeSlideshow() {
    startSlideshow();
  }

  // Start the slideshow when the page loads
  startSlideshow();


const prizes = [
    'Get 20% off with MIN $20',
    'Get $5 off with MIN $35',
    'Free shipping fee',
    'Get $50 with MIN $500',
    'Thank you for participating',
    'Get $10 with MIN TWO items',
    'Get 10% off with no MIN Spend',
    'Get 15% off with $100',
    'Thank you for participating'
];

const gridContainer = document.getElementById('gridContainer');
const resultElement = document.getElementById('result');
const drawButton = document.getElementById('drawButton');
const modal = document.getElementById('myModal');
const modalText = document.getElementById('modalText');
const closeBtn = document.getElementsByClassName('close')[0];

// Generate grid items and display prize names
prizes.forEach((prize, index) => {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.textContent = prize;  

    
    gridContainer.appendChild(gridItem);
});

// Click button to start the lottery
drawButton.addEventListener('click', () => {
    // Clear previous highlight state
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.remove('highlight'));

    
    resultElement.textContent = "Drawing in progress...";
    resultElement.classList.remove('highlight');

    // Highlight each grid cell in sequence until the winning one
    let delay = 0;
    const duration = 100; 
    const totalDuration = 2000; 

    // Randomly select a winning grid cell first
    const randomIndex = Math.floor(Math.random() * prizes.length);
    let stopAt = randomIndex; 
    let highLighting = true; 

    // Simulate sequential highlighting of each grid cell
    for (let i = 0; i < gridItems.length; i++) {
        if (!highLighting) break; 

        setTimeout(() => {
    
            if (i > 0) {
                gridItems[i - 1].classList.remove('highlight');
            }

            
            gridItems[i].classList.add('highlight');
        }, delay);
        delay += duration; 

        // When the lottery ends, determine the winning grid cell
        if (i === stopAt) {

            setTimeout(() => {
                highLighting = false; 
            }, delay);
        }
    }

    // After a delay, stop at the winning grid cell
    setTimeout(() => {
        const gridItems = document.querySelectorAll('.grid-item');
        
        gridItems.forEach(item => item.classList.remove('highlight'));

       
        const winningGridItem = gridItems[stopAt];
        winningGridItem.classList.add('highlight');

        // Display the winning result
        const randomPrize = prizes[stopAt];
        modalText.textContent = `The prize you won is: ${randomPrize}`;
        modal.style.display = "block";  
    }, totalDuration); 
});

// Click the close button to close the popup
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Clicking outside the popup also closes it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
