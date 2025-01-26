let allProducts = []; // Store fetched data here

fetch(BASE_URL, {
    method: "GET",
    headers: {
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache",
    },
})
    .then((response) => response.json())
    .then((products) => {
        allProducts = products; // Store all products
        console.log("Fetched products:", allProducts);
        loadProductsByCategory(""); 
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });
    function displayProducts(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear existing products
    
        if (products.length === 0) {
            container.innerHTML = "<p>No products available.</p>";
            return;
        }
    
        products.forEach((product) => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
    
            productItem.innerHTML = `
                <img src="${product.image || "placeholder.jpg"}" alt="${product.name || "Product"}">
                <div class="product-title">${product.name || "Untitled Product"}</div>
                <div class="product-price">S$${product.price}</div>
            `;
    
            container.appendChild(productItem);
        });
    }
    