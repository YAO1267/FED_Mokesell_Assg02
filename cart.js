//check if the user has logged in 
window.onload = checkLoginStatus();

// Call fetchCartItems when the page loads
window.onload = function() {
    fetchCartItems();
};
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


// Retrieve the logged-in user's email
const userEmail = sessionStorage.getItem("loginemail");

if (!userEmail) {
    alert("You need to log in first!");
    window.location.href = "login.html"; // Redirect to login page
}

// API Key
const apiKey = "677f336bc7a864b3d4c78324";

// Initialize the cart total
let cartTotal = 0;
var totalPrice = 0;
let itemAdded = [];
// Fetch cart items for the logged-in user
async function fetchCartItems() {
    const url = `https://database-9cfc.restdb.io/rest/cart?q={"loginemail": "${userEmail}"}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });
        // var totalPrice = 0;
        const cartItems = await response.json();
        for (const cartItem of cartItems) {
            itemAdded.push = cartItem.index;
            // Get the table body
            const tableBody = document.querySelector("#cart-table");

            // Create a new row element
            const newRow = document.createElement("tr");

            // Create new cells for the row
            const cell1 = document.createElement("td");
            const cell2 = document.createElement("td");
            const cell3 = document.createElement("td");
            const cell4 = document.createElement("td");

           
            cell1.textContent = cartItem.name;
            cell2.textContent = cartItem.price;
            cell3.textContent = cartItem.amount;
            if(cartItem.status == 0){
                cell4.textContent = 'pending';
            }else{
                cell4.textContent = 'Competed';
            }

            newRow.appendChild(cell1);
            newRow.appendChild(cell2);
            newRow.appendChild(cell3);
            newRow.appendChild(cell4);

            tableBody.appendChild(newRow);

            totalPrice += Number(cartItem.price);
        }

        const paragraph = document.getElementById("totalPrice");
        paragraph.innerText = `Sub-Total: ${totalPrice}`;
        fetchCoupon();

    } catch (error) {
        console.error("Error fetching cart items:", error);
    }

}




//fetch the user coupon
async function fetchCoupon() {
    const url = `https://database-9cfc.restdb.io/rest/promo?q={"loginemail": "${userEmail}","status": 0}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey
            }
        });
        //0 means applicable 1 not 
        const userCoupons = [];
        const couponLists = await response.json();
        for (const coupon of couponLists) {
            if(coupon.promo == 0){
                if(totalPrice >= 20){
                    userCoupons.push({'title':'Get 20% off with MIN $20','status': 0});
                }else{
                    userCoupons.push({'title':'Get 20% off with MIN $20','status': 1});
                }
            }
            else if(coupon.promo == 1){
                if(totalPrice >= 35){
                    userCoupons.push({'title':'Get $5 off with MIN $35','status': 0});
                }else{
                    userCoupons.push({'title':'Get $5 off with MIN $35','status': 1});
                }
            }
            else if(coupon.promo == 2){
                userCoupons.push({'title':'Get $2 off with no MIN Spend','status': 0});
            }
            else if(coupon.promo == 3){
                if(totalPrice >= 500){
                    userCoupons.push({'title':'Get $50 with MIN $500','status': 0});
                }else{
                    userCoupons.push({'title':'Get $50 with MIN $500','status': 1});
                }
            }
            else if(coupon.promo == 5){
                userCoupons.push({'title':'Get $10 with no MIN Spend','status': 0});
            }
            else if(coupon.promo == 6){
                userCoupons.push({'title':'Get 10% off with no MIN Spend','status': 0});
            }
            else if(coupon.promo == 7){
                if(totalPrice >= 100){
                    userCoupons.push({'title':'Get 15% off with $100','status': 0});
                }else{
                    userCoupons.push({'title':'Get 15% off with $100','status': 1});
                }
            }
        }
        appandCoupon(userCoupons);


    } catch (error) {
        console.error("Error fetching cart items:", error);
    }
}

let couponUsed = '';
function appandCoupon(userCoupons){
  // Get DOM elements
  const inputCouponButton = document.getElementById("apply-coupon");
  const popup = document.getElementById("coupon-popup");
  const couponList = document.getElementById("coupon-list");
  const closePopupButton = document.getElementById("close-popup");
  const couponInput = document.querySelector('.coupon-section input[type="text"]');
  
  // Function to display the coupon list
  function showCouponPopup() {
    // Clear previous list
    couponList.innerHTML = "";
  
    // Generate and display coupons
    userCoupons.forEach(coupon => {
      const li = document.createElement("li");
      li.textContent = coupon.title;
      if(coupon.status == 1){
        li.style.background = '#d3d3d3';
        couponList.appendChild(li);
      }else{
        couponList.appendChild(li);
        // Add event listener for click on each coupon
        li.addEventListener("click", () => {
            couponInput.value = coupon.title;  // Set the selected coupon into the input field
            couponUsed = coupon.title;  
            popup.style.display = "none"; // Close the popup after selection
        });
      }      
    });
  
    // Show the popup
    popup.style.display = "block";
  }
  
  // Event listener for the "Apply Coupon" button
  inputCouponButton.addEventListener("click", showCouponPopup);
  
  // Event listener for closing the popup
  closePopupButton.addEventListener("click", () => {
    popup.style.display = "none"; // Hide the popup
  });
  
  // Close the popup if the user clicks anywhere outside the popup content
  window.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
}
//calculate the price after coupon is applied
function applyCoupon() {
    if(couponUsed == 'Get 20% off with MIN $20'){
        totalPrice *= 0.8;
        updatePromo(0);
    }else if(couponUsed == 'Get $5 off with MIN $35'){
        totalPrice -= 5;
        updatePromo(1);
    }else if(couponUsed == 'Get $2 off with no MIN Spend'){
        totalPrice -= 2;
        updatePromo(2);
    }else if(couponUsed == 'Get $50 with MIN $500'){
        totalPrice -= 50;
        updatePromo(3);
    }else if(couponUsed =='Get $10 with no MIN Spend'){
        totalPrice -= 10;
        updatePromo(5);
    }else if(couponUsed =='Get 10% off with no MIN Spend'){
        totalPrice *= 0.9
        updatePromo(6);
    }else if(couponUsed == 'Get 15% off with $100'){
        totalPrice *= 0.85;
        updatePromo(7);
    }
    const paragraph = document.getElementById("totalPrice");
    paragraph.innerText = `Sub-Total: ${totalPrice}`;
}


// filter user then update partical field
async function updatePromo(promo) {
    const url = `https://database-9cfc.restdb.io/rest/promo?q=${encodeURIComponent(
        JSON.stringify({ loginemail: userEmail, promo: promo })
    )}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "677f336bc7a864b3d4c78324",
            },
        });

        const data = await response.json();
        if (data.length > 0) {
            const recordId = data[0]._id; // Get the first matching record
            await patchData(recordId);
        } else {
            console.log("No matching record found.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function patchData(recordId) {
    try {
        const response = await fetch(`https://database-9cfc.restdb.io/rest/promo/${recordId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "677f336bc7a864b3d4c78324",
            },
            body: JSON.stringify({ status: 1 }),
        });

        const updatedData = await response.json();
        console.log("Updated successfully:", updatedData);
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

console.log(itemAdded); 
async function finishPayment() {
    const url = `https://database-9cfc.restdb.io/rest/cart?q=${encodeURIComponent(
        JSON.stringify({ loginemail: userEmail, index: { "$in": itemAdded } }) // Fix filter
    )}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "677f336bc7a864b3d4c78324",
            },
        });

        const data = await response.json();
        if (data.length > 0) {
            // Update all matching records
            data.forEach(async (record) => {
                await patchData2(record._id);
            });
        } else {
            console.log("No matching records found.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function patchData2(recordId) {
    console.log("Updating record ID:", recordId);
    try {
        const response = await fetch(`https://database-9cfc.restdb.io/rest/cart/${recordId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "677f336bc7a864b3d4c78324",
            },
            body: JSON.stringify({ status: Number(1) }), // Update status to 1
        });

        const updatedData = await response.json();
        console.log(`Updated record ${recordId} successfully:`, updatedData);
    } catch (error) {
        console.error(`Error updating record ${recordId}:`, error);
    }
}
