document.addEventListener("DOMContentLoaded", function () {
    const APIKEY = "677f336bc7a864b3d4c78324";
    const BASE_URL = "https://database-9cfc.restdb.io/rest/menu";

    const form = document.getElementById("add-product-form");
    const nameInput = document.getElementById("name");
    const categoryInput = document.getElementById("category");
    const priceInput = document.getElementById("price");
    const imageInput = document.getElementById("upload");
    const previewImage = document.getElementById("image-preview");
    const descriptionInput = document.getElementById("comment");
    // const useremail = "yao@gmail.com" for testing
    const useremail =JSON.parse(sessionStorage.getItem("loginemail")) 

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
        const description = descriptionInput ? descriptionInput.value.trim() : "";


        if (!category || isNaN(price) || price <= 0 || !imageBase64) {
            alert("Please fill in all fields correctly!");
            return;
        }

        const productData = {
            name:name, 
            category:category,
            price:price,
            image: imageBase64,
            description: description,
            loginemail:useremail,
        };
        console.log(productData); // Check the content before sending

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
                if (!response.ok) throw new Error(`Failed to save data: ${response.statusText}`);
                return response.json();
            })
            .then(() => {
                alert("Product successfully added!");
        
                form.reset();
                previewImage.src = "";
                previewImage.style.display = "none";
                imageBase64 = "";
            })
            .catch((error) => {
                console.error("Error:", error);
        
                // If error is due to a failed response, try to read the JSON error message from the response
                if (error.response) {
                    error.response.json().then((response) => {
                        console.log("API Error Response:", response);
                    });
                } else {
                    console.log("Error without response:", error);
                }
        
                alert("An error occurred while saving the product.");
            });
        

        
    });
});