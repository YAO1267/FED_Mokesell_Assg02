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
