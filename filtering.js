document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu";
    const clothesContainer = document.getElementById("clothes-container");
    let allClothes = [];

 
    fetch(BASE_URL, {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache",
        },
    })
    .then((response) => response.json())
    .then((products) => {

        // Filter products by category
        allClothes = products.filter(
            (product) => product.category && product.category.toLowerCase() === "clothes"
        );
        displayProducts(allClothes);
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
        clothesContainer.innerHTML = "<p>Failed to load clothes. Please try again later.</p>";
    });

    // Function to display products in the container
    function displayProducts(products) {
        clothesContainer.innerHTML = ""; // Clear previous products

        if (products.length === 0) {
            clothesContainer.innerHTML = "<p>No clothes available.</p>";
            return;
        }

        products.forEach((product) => {
            const clothesItem = document.createElement("div");
            clothesItem.classList.add("clothes-item");

            const productImage = document.createElement("img");
            productImage.src = product.image || "placeholder.jpg"; 
            productImage.alt = product.name || "Product Image";

            const productTitle = document.createElement("div");
            productTitle.classList.add("product-title");
            productTitle.textContent = product.name || "Untitled Product";

            const productPrice = document.createElement("div");
            productPrice.classList.add("product-price");
            productPrice.textContent = `S$${product.price}`;

            const addToCartButton = document.createElement("button");
            addToCartButton.textContent = "Add to Cart";
            addToCartButton.onclick = function () {
                addToCart(product.name, product.price);
            };

            clothesItem.appendChild(productImage);
            clothesItem.appendChild(productTitle);
            clothesItem.appendChild(productPrice);
            clothesItem.appendChild(addToCartButton);

            clothesContainer.appendChild(clothesItem);
        });
    }

    // Filter by price range
    function filterByPrice(products, priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        return products.filter(product => {
            return product.price >= minPrice && product.price <= maxPrice;
        });
    }

    // Sort alphabetically (A-Z or Z-A) or by price (low to high or high to low)
    function sortProducts(products, sortOrder, byPrice = false) {
        return products.sort((a, b) => {
            if (byPrice) {
                if (sortOrder === "Low-High") {
                    return a.price - b.price;
                } else if (sortOrder === "High-Low") {
                    return b.price - a.price;
                }
            } else {
                // Alphabetical sort
                if (sortOrder === "A-Z") {
                    return a.name.localeCompare(b.name);
                } else if (sortOrder === "Z-A") {
                    return b.name.localeCompare(a.name);
                }
            }
            return 0;
        });
    }

    
    document.getElementById("apply-filters").addEventListener("click", () => {
        let filteredClothes = allClothes;

        // price range
        const priceRange = document.querySelector('input[name="price"]:checked')?.value;
        if (priceRange) {
            filteredClothes = filterByPrice(filteredClothes, priceRange);
        }

        // alphabetical/price sort order
        const sortOrder = document.querySelector('input[name="alphabet"]:checked')?.value ||
                          document.querySelector('input[name="price-sort"]:checked')?.value;
        if (sortOrder) {
            const sortByPrice = sortOrder === "Low-High" || sortOrder === "High-Low";
            filteredClothes = sortProducts(filteredClothes, sortOrder, sortByPrice);
        }

        // Replace the current clothes with the filtered ones
        displayProducts(filteredClothes);
    });

    
});
