document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu"; // Menu collection endpoint
    const cartContainer = document.getElementById("cart-container");
    let cartItems = []; // Array to store cart items

    // Fetch menu data from the API
    fetch(BASE_URL, {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache",
        },
    })
    .then((response) => response.json())
    .then((items) => {
        cartItems = items; // Store fetched items in the array

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }
    }


