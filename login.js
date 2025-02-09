function clickTab(evt, name) {
    var i, tabContent, tabLinks;
    // Get all tab content elements
    tabContent = document.getElementsByClassName("tabContent");
    // Hide all tab content
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tabLinks");

    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
  }



function loginOrSignup(evt, name) {
    // Check if the action is Login
    if (name == 'Login') {
        name = document.getElementById('login_name').value
        psw = document.getElementById('login_psw').value
        login(name,psw)
    }

    if (name == 'Signup') {
        name = document.getElementById('signup_name').value
        psw = document.getElementById('signup_psw').value
        firstName = document.getElementById('firstName').value
        lastName = document.getElementById('lastName').value
        signup(name,psw,firstName,lastName)
    
    }
}


const signup = async (email, password,firstName,lastName) => {
        const response = await fetch('https://database-9cfc.restdb.io/rest/contactdetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '677f336bc7a864b3d4c78324',
        },
        // 0 means normal user and 1 means admin account
        body: JSON.stringify({ loginemail: email, password: password, type: 0, firstname: firstName, lastname: lastName }),  
    });
    if (response.ok) {
        console.log('Signup successfully');
        window.alert('Sign up successfully')
        sessionStorage.setItem("loginemail",email)
        sessionStorage.setItem("password",password)
        window.location.href = "index.html"
    } else {
        console.error('Error signing up:', response.statusText);
        window.alert('Errors')
    }
};

const login = async (email, password) => {
    const query = JSON.stringify({ loginemail: email, password: Number(password)}); // Convert password to number
    const queryURL = `https://database-9cfc.restdb.io/rest/contactdetail?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(queryURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '677f336bc7a864b3d4c78324',
        },
    });
    const users = await response.json();
    if (users.length > 0) {
        const user = users[0];
        // check if the user entert the right pw
        if (password === user.password.toString()) {
            console.log('Login successfully');
            window.alert('Login successfully')
            
            // check if the user is admin or normal user
            if (user.type === 1){
                // store the data using local storage
                sessionStorage.setItem("loginemail",email)
                sessionStorage.setItem("password",password)
                window.location.href = "admin.html" //go to the admin page
            } else{
                // store the data using local storage
                sessionStorage.setItem("loginemail",email)
                sessionStorage.setItem("password",password)
                sessionStorage.setItem("firstname",user.firstname)
                sessionStorage.setItem("password",user.lastname)
                window.location.href = "index.html"
            }
            
        } else {
            console.error('Invalid username or password');
            window.alert('Invalid username or password')
        }
    } else {
        console.error('Invalid username or password');
        window.alert('Invalid username or password')
    }
};
