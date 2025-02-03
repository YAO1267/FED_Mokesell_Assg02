document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu";
    const shoesContainer = document.getElementById("shoes-container");
    let allShoes = [];

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
        allShoes = products.filter(
            (product) => product.category && product.category.toLowerCase() === "shoes"
        );
        displayProducts(allShoes);
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
        shoesContainer.innerHTML = "<p>Failed to load shoes. Please try again later.</p>";
    });

    // Function to display products in the container
    function displayProducts(products) {
        shoesContainer.innerHTML = ""; // Clear previous products

        if (products.length === 0) {
            shoesContainer.innerHTML = "<p>No shoes available.</p>";
            return;
        }

        products.forEach((product) => {
            const shoesItem = document.createElement("div");
            shoesItem.classList.add("shoes-item");

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

            shoesItem.appendChild(productImage);
            shoesItem.appendChild(productTitle);
            shoesItem.appendChild(productPrice);
            shoesItem.appendChild(addToCartButton);

            shoesContainer.appendChild(shoesItem);
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
        let filteredShoes = allShoes;

        // price range
        const priceRange = document.querySelector('input[name="price"]:checked')?.value;
        if (priceRange) {
            filteredShoes = filterByPrice(filteredShoes, priceRange);
        }

        // alphabetical/price sort order
        const sortOrder = document.querySelector('input[name="alphabet"]:checked')?.value ||
                          document.querySelector('input[name="price-sort"]:checked')?.value;
        if (sortOrder) {
            const sortByPrice = sortOrder === "Low-High" || sortOrder === "High-Low";
            filteredShoes = sortProducts(filteredShoes, sortOrder, sortByPrice);
        }

        // Replace the current shoes with the filtered ones
        displayProducts(filteredShoes);
    });
});
