// Import Firebase dependencies (MUST be at the top)
import { getFirestore, collection, addDoc, serverTimestamp,query, where, orderBy, onSnapshot  } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbD_hLlsL7k-wuCPgQcU_wGcp5fSZuOVI",
  authDomain: "chat-a88ab.firebaseapp.com",
  projectId: "chat-a88ab",
  storageBucket: "chat-a88ab.firebasestorage.app",
  messagingSenderId: "112506015423",
  appId: "1:112506015423:web:66965466cf4cf23cb0000a",
  measurementId: "G-PT9NR31NRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
// Reference to Firestore collection
const messagesCollectionRef = collection(db, "chatmsg");

// display and store msg from buyer side
export async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const useremail = sessionStorage.getItem("loginemail");
    const seller = sessionStorage.getItem("seller");

    if (messageText === "") return; // Don't send empty messages

    // const chatBody = document.getElementById("chatBody");

    // // Create a new message div
    // const messageDiv = document.createElement("div");
    // messageDiv.textContent = messageText;
    // messageDiv.style.padding = "5px";
    // messageDiv.style.margin = "5px 0";
    // messageDiv.style.background = "#007bff";
    // messageDiv.style.color = "white";
    // messageDiv.style.borderRadius = "5px";
    // messageDiv.style.textAlign = "right";

    // // Append message to chat body
    // chatBody.appendChild(messageDiv);

    // Clear input
    messageInput.value = "";

    // // Scroll to the latest message
    // chatBody.scrollTop = chatBody.scrollHeight;

    // Store the message in Firestore using addDoc
    try {
        await addDoc(messagesCollectionRef, {
            buyer: useremail,
            seller: seller,
            message: messageText,
            timestamp: serverTimestamp(),
            from: 'buyer'  
        });
        console.log("Message successfully sent to Firestore!");
    } catch (error) {
        console.error("Error sending message to Firestore: ", error);
    }
}


// Function to listen to real-time chat updates for a specific seller
export async function listenForNewMessages(sellerEmail) {
    console.log('sellerEmail: ' + sellerEmail)
    // Create the query
    const messagesCollectionRef = collection(db, "chatmsg");
    const q = query(
        messagesCollectionRef,
        where("seller", "==", sellerEmail),  // Filter by seller email
        orderBy("timestamp")  // Order messages by timestamp
    );

    let checkBuyerList = {};
    // {'buyer':[{'from':'', 'msg': ''}]}  
    // {'buyer':['msg']}
    const useremail = sessionStorage.getItem("loginemail");
    onSnapshot(q,(querySnapshot) => {
        let messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = ""; // Clear the previous messages
        
        querySnapshot.forEach((doc) => {
            let messageData = doc.data();
            if(messageData.buyer in checkBuyerList){
                checkBuyerList[messageData.buyer].push({'from': messageData.from, 'msg': messageData.message});
                //
            }else{
                    let chatItem = document.createElement("div");
                    chatItem.classList.add("chat-item");
                    chatItem.textContent = messageData.buyer;
                    chatList.appendChild(chatItem);
                    const key = messageData.buyer;
                    checkBuyerList[key] = [];
                    checkBuyerList[key].push({'from': messageData.from, 'msg': messageData.message});
                    //
                    chatItem.onclick = function() { openChat(key, checkBuyerList[key]); };
            }
            
            let elements = document.getElementsByName(messageData.buyer);
            if(elements.length != 0){
                let chatBody = document.getElementById("messages");
                // let mesg = document.getElementById("messages").innerHTML += messageData.message + "<br/>";
                const messageDiv3 = document.createElement("div");
                const messageDiv2 = document.createElement("div");
                messageDiv3.style.display ="flex";
                
                messageDiv2.textContent = messageData.message;
                messageDiv2.style.padding = "5px";
                messageDiv2.style.margin = "5px 0";
                messageDiv2.style.background = "#007bff";
                messageDiv2.style.color = "white";
                messageDiv2.style.borderRadius = "5px";
                messageDiv2.style.width = "fit-content";
                // Append message to chat body
                if(messageData.from == "buyer"){
                    messageDiv3.appendChild(messageDiv2)
                    chatBody.appendChild(messageDiv3);   
                }else{
                    messageDiv3.style.setProperty("justify-content", "flex-end");
                    messageDiv3.appendChild(messageDiv2)
                    chatBody.appendChild(messageDiv3);   
                }
            }
        });
        
    }, (error) => {
        console.error("Error listening for new messages: ", error);
    });
}

let buyeremail; 
function openChat(buyer, userMsg) {
    document.getElementById("chatTitle").textContent = buyer;
    buyeremail = buyer;
    let chatBody = document.getElementById("messages");
    userMsg.forEach(mesg =>{
            const messageDiv3 = document.createElement("div");
            const messageDiv2 = document.createElement("div");
            messageDiv3.style.display ="flex";
            
            messageDiv2.textContent = mesg.msg;
            messageDiv2.style.padding = "5px";
            messageDiv2.style.margin = "5px 0";
            messageDiv2.style.background = "#007bff";
            messageDiv2.style.color = "white";
            messageDiv2.style.borderRadius = "5px";
            messageDiv2.style.width = "fit-content";

            // Append message to chat body
            if(mesg.from == "buyer"){
                messageDiv3.appendChild(messageDiv2)
                chatBody.appendChild(messageDiv3);   
            }else{
                messageDiv3.style.setProperty("justify-content", "flex-end");
                messageDiv3.appendChild(messageDiv2)
                chatBody.appendChild(messageDiv3);   
            }
        // document.getElementById("messages").innerHTML += mesg + "<br>";
    });
    document.getElementById("chatBox").setAttribute("name", buyer);
    document.getElementsByName(buyer)[0].style.display = "flex";
}


// store and display from seller side
export async function sendMessage2() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const useremail = sessionStorage.getItem("loginemail");
   

    if (messageText === "") return; // Don't send empty messages
    
    // const messages = document.getElementById("messages");

    // // Create a new message div
    // const messageDiv = document.createElement("div");
    // messageDiv.textContent = messageText;
    // messageDiv.style.padding = "5px";
    // messageDiv.style.margin = "5px 0";
    // messageDiv.style.background = "#007bff";
    // messageDiv.style.color = "white";
    // messageDiv.style.borderRadius = "5px";
    // messageDiv.style.textAlign = "right";

    // // Append message to chat body
    // messages.appendChild(messageDiv);
    
    // Clear input
    messageInput.value = "";

    // // Scroll to the latest message
    // messages.scrollTop = messages.scrollHeight;

    // Store the message in Firestore using addDoc
    try {
        await addDoc(messagesCollectionRef, {
            buyer: buyeremail,
            seller: useremail,
            message: messageText,
            timestamp: serverTimestamp(),
            from: 'seller'
        }); 
        console.log("Message successfully sent to Firestore!");
    } catch (error) {
        console.error("Error sending message to Firestore: ", error);
    }
}


// Function to listen to real-time chat updates for buyer
export async function listenForNewMessages2(email) {
    // console.log('email:' + email)
    // Create the query
    const messagesCollectionRef = collection(db, "chatmsg");
    const q = query(
        messagesCollectionRef,
        where("seller", "==", email),  // Filter by seller email
        orderBy("timestamp")  // Order messages by timestamp
    );
    
    onSnapshot(q,(querySnapshot) => {
        let messagesDiv = document.getElementById("chatBody");
        messagesDiv.innerHTML = ""; // Clear the previous messages
        
        querySnapshot.forEach((doc) => {
            let messageData = doc.data();
            const messageDiv3 = document.createElement("div");
            const messageDiv2 = document.createElement("div");
            messageDiv3.style.display ="flex";
            
            messageDiv2.textContent = messageData.message;
            messageDiv2.style.padding = "5px";
            messageDiv2.style.margin = "5px 0";
            messageDiv2.style.background = "#007bff";
            messageDiv2.style.color = "white";
            messageDiv2.style.borderRadius = "5px";
            messageDiv2.style.width = "fit-content";

            // Append message to chat body
            if(messageData.from == "seller"){
                messageDiv3.appendChild(messageDiv2)
                chatBody.appendChild(messageDiv3);   
            }else{
                messageDiv3.style.setProperty("justify-content", "flex-end");
                messageDiv3.appendChild(messageDiv2)
                chatBody.appendChild(messageDiv3);   
            }
            
            // Scroll to the latest message
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }, (error) => {
        console.error("Error listening for new messages: ", error);
    });
}

