//check if the user has logged in 
window.onload = checkLoginStatus();


//check login status and show myaccount/login
function checkLoginStatus(){
    const useremail = sessionStorage.getItem("loginemail");
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

function selectCategory(category) {
    sessionStorage.setItem("selectedCategory", category); // Store category in session
    window.location.href = "itemByCategory.html"; // Redirect to category page
}

//direct to other pages with the login email
function click_my_account(page_name) {
    if (page_name == 'MokeSell') {
        window.location.href = "index.html"
    }
    else if(page_name == 'Clothes'){ 
        selectCategory('clothes');
    }
    else if(page_name == "Shoes"){
        selectCategory('shoes');
    } 
    else if(page_name == "Home-decor"){
        selectCategory('home-decor');
    } 
    else if(page_name == "shopping"){
        window.location.href = "cart.html"
    }
    else if(page_name == "Login"){
        window.location.href = "login.html"
    }
    else if(page_name == "my_account"){
        window.location.href = "profilepage.html"
     }
    else if(page_name == "Logout"){
        sessionStorage.removeItem("loginemail");
        window.alert('logout successfully!')
        window.location.href = "index.html"
    }
    else if(page_name == "my_message"){
        window.location.href = "sellerChatMsg.html"
    }
}

// lottie
setTimeout(() => {
    const lottieAnimation = document.getElementById("lottie-animation");
    if (lottieAnimation) {
        lottieAnimation.stop(); // Stops the animation
        document.getElementById("loading-container").style.display = "none"; // Hides the animation container
    }
}, 6000); // duration


//display item by category
document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu";
    const itemContainer = document.getElementById("item-container"); 
    
    fetch(BASE_URL, {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache",
        },
    })
    .then(response => response.json())
    .then(products => {
        //retrive the category from local storage
        const selectedCategory = sessionStorage.getItem("selectedCategory");
        const collectionNameContainer = document.getElementById("nameCollection");
        collectionNameContainer.innerText = selectedCategory + " Collection";
        const filteredItems = products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

        itemContainer.innerHTML = ""; // Clear previous items

        if (filteredItems.length === 0) {
            itemContainer.innerHTML = "<p>No items available.</p>";
            return;
        }

        filteredItems.forEach(product => {
            // filter the products that the current user is selling 
            useremail =sessionStorage.getItem("loginemail");
            if(product.loginemail === useremail){
                return;
            }

            const item = document.createElement("div");
            item.classList.add("cate-item");

            // Create a clickable link
            const itemLink = document.createElement("a");
            itemLink.href = "item.html";  // Redirect to product detail page

            // Store product details in sessionStorage when clicked
            itemLink.onclick = function () {
                sessionStorage.setItem("productDetails", JSON.stringify(product));
            };

            // Create image element
            const itemImage = document.createElement("img");
            itemImage.src = product.image;
            itemImage.alt = product.name || "Product Image";
            itemImage.classList.add("hidden-img"); // Initially hidden

            itemImage.onload = () => {
                itemImage.classList.remove("hidden-img"); // Show after loaded
            };

            // Append image to the link
            itemLink.appendChild(itemImage);

            // Product title
            const productTitle = document.createElement("div");
            productTitle.classList.add("product-title");
            productTitle.textContent = product.name || "Untitled Product";

            // Product price
            const productPrice = document.createElement("div");
            productPrice.classList.add("product-price");
            productPrice.textContent = `S$${product.price}`;

            // Append elements to Item
            item.appendChild(itemLink);
            item.appendChild(productTitle);
            item.appendChild(productPrice);
            
            // Append Item to container
            itemContainer.appendChild(item);

            // Add to cart button,if user didnt login dont show the button
            if(useremail = sessionStorage.getItem("loginemail")){
                const addToCartButton = document.createElement("button");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.onclick = function () {
                    const data = {
                        index: product.index,
                        price:product.price,
                        amount:1,
                        loginemail:useremail,
                        status: 0, //0 means still pending, 1 means finished
                        name:product.name,
                    }
                    addToCart(data);
                };
                item.appendChild(addToCartButton);
            }
        });
    })
    .catch(error => {
        console.error("Error fetching products:", error);
        itemContainer.innerHTML = "<p>Failed to load items. Please try again later.</p>";
    });
});




//add-to-cart
const apiUrl = 'https://database-9cfc.restdb.io/rest/cart';
const apiKey = '677f336bc7a864b3d4c78324';

// Function to send data to restdb.io
async function addToCart(data) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey
            },
            body: JSON.stringify(data) // Convert data object to JSON string
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Data saved:', result);
            window.alert('Add to your cart successfully!')
        } else {
            console.log('Error saving data:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}