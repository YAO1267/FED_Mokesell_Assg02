//check if the user has logged in 
window.onload = function () {
    checkLoginStatus();

    // Show popup once after login, but not on refresh
    const useremail = JSON.parse(sessionStorage.getItem("loginemail"));
    if (useremail && !sessionStorage.getItem("popupShown")) {
        openPopup(); // Show the popup only once
        sessionStorage.setItem("popupShown", "true");
    }
};

//check login status and show myaccount/login
function checkLoginStatus(){
    const useremail = JSON.parse(sessionStorage.getItem("loginemail")) 
    console.log("User email from sessionStorage:", useremail);

    const myAccountLinks = document.getElementsByClassName('myAccountLink');
    const loginLinks = document.getElementsByClassName('loginLink');
    const logoutLinks =document.getElementsByClassName('logoutLink')

    if (useremail) {
        // If email exists, user is logged in
        // Loop through each element and change its display style
        Array.from(myAccountLinks).forEach(link => link.style.display = 'inline');
        Array.from(logoutLinks).forEach(link => link.style.display = 'inline');
        Array.from(loginLinks).forEach(link => link.style.display = 'none');
    } else {
        // If no email, user is not logged in
        Array.from(myAccountLinks).forEach(link => link.style.display = 'none');
        Array.from(logoutLinks).forEach(link => link.style.display = 'none');
        Array.from(loginLinks).forEach(link => link.style.display = 'inline');
    }
}

//nav bar
function toggleMenu() {
    let menu = document.getElementById("offCanvasMenu");
    let overlay = document.getElementById("overlay");

    menu.classList.toggle("show");
    overlay.classList.toggle("show");
}

//popup
// Function to check login before opening popup (Used by floating widget)
function checkLoginBeforePopup() {
    const useremail = JSON.parse(sessionStorage.getItem("loginemail"));

    if (useremail) {
        openPopup(); // User is logged in, show popup
    } else {
        alert("Please log in to play the grid lottery!");
        window.location.href = "login.html"; // Redirect to login page
    }
}
function openPopup() {
    {
        document.getElementById("popup").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    }
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}




//slideshow
let currentIndex = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');

  
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    }
  
    slides.forEach((slide) => {
      slide.classList.remove('active'); // Hide all slides
    });
  
    slides[currentIndex].classList.add('active'); // Show current slide
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


//grid lottery
const prizes = [
    'Get 20% off with MIN $20',         //0
    'Get $5 off with MIN $35',          //1
    'Free shipping fee',                //2
    'Get $50 with MIN $500',            //3
    'Thank you for participating',      //4
    'Get $10 with MIN TWO items',       //5
    'Get 10% off with no MIN Spend',    //6
    'Get 15% off with $100',            //7
    'Thank you for participating'       //8
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
        if (stopAt != 4 && stopAt != 8) {
            addVoucher(stopAt, 0);
            modalText.textContent = `The prize you won is: ${randomPrize}`;
        } else {
            modalText.textContent = `Sorry, you didn't win this time.`;
        }
        
        modal.style.display = "block";
        
    }, totalDuration); 

    // 0 = avaliable, 1 = applied 
    const API_KEY = "677f336bc7a864b3d4c78324"; 
    const DATABASE_URL = "https://database-9cfc.restdb.io/rest/promo"; 
    

    async function countUserVouchers(loginemail) {
    const url = `${DATABASE_URL}?q=${encodeURIComponent('{"loginemail":"' + loginemail + '"}')}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const count = await response.json();
        console.log(count);  
        return count;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
}
    async function addVoucher(promo, status) {
    // Retrieve the user email from sessionStorage
    const useremail = JSON.parse(sessionStorage.getItem("loginemail"));

    if (!useremail) {
        console.error("User is not logged in.");
        return;
    }

    const currentCount = await countUserVouchers(useremail);

    if (currentCount === null) {
        console.error("Could not verify voucher count.");
        return;
    }

    if (currentCount.length >= 2) {
        console.log("User already has 2 vouchers. Cannot add more.");
        window.alert("You already have 2 vouchers. Cannot add more.")
        return;
    }

    const newVoucher = {
        loginemail: useremail,
        promo: promo,
        status: status
    };

    try {
        const response = await fetch(DATABASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY
            },
            body: JSON.stringify(newVoucher)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Voucher added successfully!");
    } catch (error) {
        console.error("Failed to add voucher:", error);
    }
}    
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

function selectCategory(category) {
    sessionStorage.setItem("selectedCategory", category); // Store category in session
    window.location.href = "itemByCategory.html"; // Redirect to category page
}

//direct to other pages with the login email
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
    else if(page_name == "Logout"){
        useremail =JSON.parse(sessionStorage.getItem("loginemail"))  
        sessionStorage.removeItem("loginemail");
        window.alert('logout successfully!')
        window.location.href = "index.html"
    }
}