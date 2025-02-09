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


//loading info
document.addEventListener("DOMContentLoaded", function () {
    const itemContainer = document.getElementById("item-container");

    // Retrieve product details from sessionStorage
    const productData = sessionStorage.getItem("productDetails");

    if (!productData) {
        itemContainer.innerHTML = "<p>Product not found.</p>";
        return;
    }

    const product = JSON.parse(productData);
    //store the seller name for the use of chat later
    sessionStorage.setItem("seller",product.loginemail);

    // Create elements dynamically
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-detail");

    // Create image element
    const itemImage = document.createElement("img");
    itemImage.classList.add("product-image");  // Apply styling class for image
    itemImage.classList.add("hidden-img");    // Apply the hidden class initially
    itemImage.src = product.image;
    itemImage.alt = product.name || "Product Image";

    // Show the image after it's loaded
    itemImage.onload = () => {
        itemImage.classList.remove("hidden-img");  // Remove the hidden class after loading
    };


    // Create product info container
    const itemInfo = document.createElement("div");
    itemInfo.classList.add("product-info");

    // Product title
    const productTitle = document.createElement("div");
    productTitle.classList.add("product-title");
    productTitle.textContent = product.name || "Untitled Product";

    // Product price
    const productPrice = document.createElement("div");
    productPrice.classList.add("product-price");
    productPrice.textContent = `S$${product.price}`;

    // Product description
    const productDescription = document.createElement("p");
    productDescription.innerHTML = `<strong>Description:</strong> ${product.description}`;

    // Seller section with clickable avatar
    const sellerContainer = document.createElement("div");
    sellerContainer.classList.add("seller-info");

    // Placeholder avatar
    const sellerAvatar = document.createElement("img");
    sellerAvatar.src = "./images/avatar.png"; //put fixed avatar first
    sellerAvatar.alt = "Seller Avatar";
    sellerAvatar.classList.add("seller-avatar");
    //link to seller avatar also 
    sellerAvatar.addEventListener("click",function(){
        window.location.href = "profilepage.html"
    })
    //seller email
    const sellerName = document.createElement("a");
    sellerName.href = `profilepage.html`; // Link to seller profile also
    sellerName.textContent = product.loginemail;
    sellerName.classList.add("seller-name");
    
    sellerContainer.appendChild(sellerAvatar);
    sellerContainer.appendChild(sellerName);

    // Append elements to itemInfo
    itemInfo.appendChild(productTitle);
    itemInfo.appendChild(productPrice);
    itemInfo.appendChild(productDescription);
    itemInfo.appendChild(sellerContainer);

    // Add to Cart button
    if(useremail = sessionStorage.getItem("loginemail")){
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.onclick = function () {
        useremail = sessionStorage.getItem("loginemail")
        const data = {
            index: product.index,
            price:product.price,
            amount:1,
            loginemail:useremail,
            status: 0, //0 means still pending, 1 means finished
            name:product.name
        };
        addToCart(data);
        };
        itemInfo.appendChild(addToCartButton);
    }
    

    
    

    // Append elements to itemDiv
    itemDiv.appendChild(itemImage);
    itemDiv.appendChild(itemInfo);

    // Append everything to the container
    itemContainer.appendChild(itemDiv);
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

//chatbox
function checkLoginBeforePopup() {
    // Simulate checking if the user is logged in
    const useremail = sessionStorage.getItem("loginemail");
    if (useremail) {
        showChatbox();
    } else {
        alert("Please log in to chat with the seller.");
    }
}

function showChatbox() {
    document.getElementById("chatbox").style.display = "flex";
}
function closeChatbox() {
    document.getElementById("chatbox").style.display = "none";
}



    
    
    



