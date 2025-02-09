//check if the user has logged in 
window.onload = checkLoginStatus();

//nav bar
function toggleMenu() {
    let menu = document.getElementById("offCanvasMenu");
    let overlay = document.getElementById("overlay");

    menu.classList.toggle("show");
    overlay.classList.toggle("show");
}
//check login status and show myaccount/login
function checkLoginStatus(){
    const useremail = sessionStorage.getItem("loginemail")
    console.log(useremail);
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


const userEmail = sessionStorage.getItem("loginemail");
const APIKEY = "677f336bc7a864b3d4c78324";
const BASE_URL = "https://database-9cfc.restdb.io/rest/contactdetail";
        let userData = {}; // Store user data

        if (!userEmail) {
            alert("User not logged in! Redirecting to login page...");
            window.location.href = "login.html";
        }

        var userId = ''; //to store the userid for update
        async function fetchUserProfile() {
            try {
                const query = encodeURIComponent(JSON.stringify({ loginemail: userEmail }));
                const response = await fetch(`${BASE_URL}?q=${query}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache",
                    },
                });

                const data = await response.json();
                if (data.length > 0) {
                    userData = data[0]; // Store user data
                    userId = data[0]._id; // Extract the user ID
                    document.getElementById("firstName").value = userData.firstname || "";
                    document.getElementById("lastName").value = userData.lastname || "";
                    document.getElementById("email").value = userData.loginemail || "";
                    document.getElementById("oldPassword").value = userData.password || "";

                    if (userData.profilepage) {
                        document.getElementById("profileImage").src = `https://database-9cfc.restdb.io/media/${userData.profilepage}`;
                    }
                } else {
                    document.getElementById("profileImage").src = "./images/avatar.png"
                    // alert("User profile not found!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

let url = '';
        function previewImage(event) {
            const reader = new FileReader();
            reader.onload = function (e) {
                url = e.target.result;
                document.getElementById("profileImage").src = url;
                // saveChanges(imageUrl)
            };
            reader.readAsDataURL(event.target.files[0]);
        }
async function saveChanges() {
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const profilePic = document.getElementById("profileImage").src;
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    try{
        var updatedUserData = {
        password: newPassword || userData.password,
        profilepage: url || userData.profilepage
    }
    
    updateUserProfile(updatedUserData,userId)    

    }catch (error) {
        console.error("Error updating profile:", error);
    }
}   

async function updateUserProfile(updatedUserData,userId) {
    try {

        // let url = 'https://database-9cfc.restdb.io/rest/contactdetail/' + userId;
        const response = await fetch(`https://database-9cfc.restdb.io/rest/contactdetail/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "677f336bc7a864b3d4c78324",
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(updatedUserData),
        });

        const updatedData = await response.json();
        window.alert('Updated successfully')
        console.log("Updated successfully:", updatedData);
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

         
            



        

        function logout() {
            sessionStorage.clear();
            alert("Logged out successfully!");
            window.location.href = "login.html";
        }

        window.onload = fetchUserProfile;
        function enableEdit() {
            // Disable the Edit button
            document.getElementById("editBtn").style.display = "none";
            
            // Enable the Save Changes button
            document.getElementById("saveBtn").style.display = "inline-block";
            
            
            // Enable the profile image change button
            document.getElementById("editImageBtn").disabled = false;
            
            // Show new password section
            document.getElementById("newPassSection").style.display = "block";
            
            // Set fields to editable
            document.getElementById("firstName").removeAttribute("readonly");
            document.getElementById("lastName").removeAttribute("readonly");
            document.getElementById("email").removeAttribute("readonly");
            document.getElementById("oldPassword").removeAttribute("readonly");
            document.getElementById("newPassword").required = true;
            document.getElementById("confirmPassword").required = true;
}
