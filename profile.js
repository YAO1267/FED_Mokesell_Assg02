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

                    document.getElementById("firstName").value = userData.firstname || "";
                    document.getElementById("lastName").value = userData.lastname || "";
                    document.getElementById("email").value = userData.loginemail || "";
                    document.getElementById("oldPassword").value = userData.password || "";

                    if (userData.profilePic) {
                        document.getElementById("profileImage").src = userData.profilePic;
                    }
                } else {
                    alert("User profile not found!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        function enableEdit() {
            document.getElementById("editBtn").disabled = true;
            document.getElementById("saveBtn").disabled = false;
            document.getElementById("editImageBtn").disabled = false;
            document.getElementById("newPassSection").style.display = "block";

            document.getElementById("newPassword").required = true;
            document.getElementById("confirmPassword").required = true;
        }

        async function saveChanges() {
            const newPassword = document.getElementById("newPassword").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();
            const profilePic = document.getElementById("profileImage").src;

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const updatedUserData = {
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    loginemail: userData.loginemail,
                    type: userData.type,
                    password: newPassword || userData.password,
                    profilePic: profilePic || userData.profilePic,
                };

                const updateResponse = await fetch(`${BASE_URL}/${userData._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                        "Cache-Control": "no-cache",
                    },
                    body: JSON.stringify(updatedUserData),
                });

                if (updateResponse.ok) {
                    alert("Profile updated successfully!");
                    location.reload();
                } else {
                    console.error("Failed to update profile:", await updateResponse.text());
                    alert("Failed to update profile. Check console for details.");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }

        function previewImage(event) {
            const reader = new FileReader();
            reader.onload = function () {
                document.getElementById("profileImage").src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
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