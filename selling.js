document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu";

    const form = document.getElementById("add-product-form");
    const nameInput = document.getElementById("name");
    const categoryInput = document.getElementById("category");
    const priceInput = document.getElementById("price");
    const imageInput = document.getElementById("upload");
    const previewImage = document.getElementById("image-preview");

    let imageBase64 = "";

    // Image upload preview
    imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageBase64 = e.target.result;
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Submit form
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = nameInput.value;
        const category = categoryInput.value;
        const price = parseFloat(priceInput.value);


        if (!category || isNaN(price) || price <= 0 || !imageBase64) {
            alert("Please fill in all fields correctly!");
            return;
        }

        const productData = {
            name, 
            category,
            price,
            image: imageBase64,
        };

        fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY,
                "Cache-Control": "no-cache",
            },
            body: JSON.stringify(productData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to save data.");
                return response.json();
            })
            .then(() => {
                alert("Product successfully added!");
                form.reset();
                previewImage.style.display = "none";
                imageBase64 = "";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while saving the product.");
            });
    });
});