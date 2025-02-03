//nav bar
function toggleMenu() {
    let menu = document.getElementById("offCanvasMenu");
    let overlay = document.getElementById("overlay");

    menu.classList.toggle("show");
    overlay.classList.toggle("show");
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
}

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
            const item = document.createElement("div");
            item.classList.add("cate-item");

            // Create image element
            const itemImage = document.createElement("img");
            itemImage.src = product.image;
            itemImage.alt = product.name || "Product Image";
            itemImage.classList.add("hidden-img"); // Initially hidden

            itemImage.onload = () => {
                itemImage.classList.remove("hidden-img"); // Show after loaded
            };

            // Product title
            const productTitle = document.createElement("div");
            productTitle.classList.add("product-title");
            productTitle.textContent = product.name || "Untitled Product";

            // Product price
            const productPrice = document.createElement("div");
            productPrice.classList.add("product-price");
            productPrice.textContent = `S$${product.price}`;

            // Add to cart button
            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.onclick = function () {
                addToCart(product.name, product.price);
            };

            // Append elements to Item
            item.appendChild(itemImage);
            item.appendChild(productTitle);
            item.appendChild(productPrice);
            item.appendChild(addToCartButton);

            // Append Item to container
            itemContainer.appendChild(item);
        });
    })
    .catch(error => {
        console.error("Error fetching products:", error);
        itemContainer.innerHTML = "<p>Failed to load items. Please try again later.</p>";
    });
});