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
        signup(name,psw)
    
    }
}


const signup = async (email, password) => {
    // const hashPassword = hashPassword(password)  ; // Use bcrypt or another library.
    const response = await fetch('https://database-9cfc.restdb.io/rest/contactdetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '677f336bc7a864b3d4c78324',
        },
        body: JSON.stringify({ loginemail: email, password: password }),
    });
    if (response.ok) {
        console.log('Signup successfully');
        window.alert('Sign up successfully')
    } else {
        console.error('Error signing up:', response.statusText);
        window.alert('Sing up successfully')
    }
};

const login = async (email, password) => {
    const query = JSON.stringify({ loginemail: email, password: Number(password) }); // Convert password to number
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
      
        if (password === user.password.toString()) {
            console.log('Login successfully');
            window.alert('Login successfully')
        } else {
            console.error('Invalid username or password');
            window.alert('Invalid username or password')
        }
    } else {
        console.error('Invalid username or password');
        window.alert('Invalid username or password')
    }
};
