// Import Firebase dependencies (MUST be at the top)
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
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

// itemChat.js
export async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();
    const useremail = JSON.parse(sessionStorage.getItem("loginemail"));

    if (messageText === "") return; // Don't send empty messages

    const chatBody = document.getElementById("chatBody");

    // Create a new message div
    const messageDiv = document.createElement("div");
    messageDiv.textContent = messageText;
    messageDiv.style.padding = "5px";
    messageDiv.style.margin = "5px 0";
    messageDiv.style.background = "#007bff";
    messageDiv.style.color = "white";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.textAlign = "right";

    // Append message to chat body
    chatBody.appendChild(messageDiv);

    // Clear input
    messageInput.value = "";

    // Scroll to the latest message
    chatBody.scrollTop = chatBody.scrollHeight;

    // Store the message in Firestore using addDoc
    try {
        await addDoc(messagesCollectionRef, {
            email: useremail,
            message: messageText,
            timestamp: serverTimestamp()  
        });
        console.log("Message successfully sent to Firestore!");
    } catch (error) {
        console.error("Error sending message to Firestore: ", error);
    }
}

