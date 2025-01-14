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


  const signup = async (email, password) => {
    const password = hashPassword(password); // Use bcrypt or another library.
    const response = await fetch('https://database-9cfc.restdb.io/rest/contactdetail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': '677f336bc7a864b3d4c78324',
        },
        body: JSON.stringify({ username: email, password: password }),
    });
    if (response.ok) {
        console.log('Signup successful');
        // window.alert('sign up successfully')
    } else {
        console.error('Error signing up:', response.statusText);
    }
};










  
// var users = new Map();
// users.set('Adam', '123456')
// users.set('Bob', '123456')

function loginOrSignup(evt, name) {
    // Check if the action is Login
    if (name == 'Login') {
        name = document.getElementById('login_name').value
        psw = document.getElementById('login_psw').value

        if (users.get(name) == psw) {
            window.alert('login success')
            window.location.href = "index.html?username=" + name
        } else {
            window.alert('login failed')
        }
    }

    if (name == 'Signup') {
        name = document.getElementById('signup_name').value
        psw = document.getElementById('signup_psw').value
        signup(name,psw)
       
       
        // adds the new username-password
        // if (name != '' && psw != '') {
        //     users.set(name, psw)
        //     window.alert('singn success')
        //     window.location.href = "index.html?username=" + name
        // } else {
        //     window.alert('please input username and password')
        // }
    }
}