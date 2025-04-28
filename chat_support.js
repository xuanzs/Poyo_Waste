import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

/// Replace with actual admin UID////
const adminUID = "58Te3orBLffmbcnxLfkFRsIUJY13";

const chatListEl = document.getElementById("chatList");
const chatMessages = document.getElementById("chatMessages");
const chatHeader = document.getElementById("chatHeader");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

let selectedChatId = null;
let selectedUserUID = null;
let unsubscribeMessages = null;

//// Load all chats involving this admin///
async function loadChatList() {
  const q = query(collection(db, "chats"), where("participants", "array-contains", adminUID));
  const snapshot = await getDocs(q);
  chatListEl.innerHTML = "";

  for (const docSnap of snapshot.docs) {
    const chat = docSnap.data();
    const chatId = docSnap.id;
    const otherUID = chat.participants.find(uid => uid !== adminUID);
    const userDoc = await getDoc(doc(db, "users", otherUID));
    const displayName = userDoc.exists() ? userDoc.data().fullname || userDoc.data().username || otherUID : otherUID;

    const li = document.createElement("li");
    li.textContent = displayName;
    li.onclick = () => selectChat(chatId, displayName, otherUID);
    chatListEl.appendChild(li);
  }
}

///// Display messages for selected chat////
function selectChat(chatId, displayName, userUID) {
  selectedChatId = chatId;
  selectedUserUID = userUID;
  chatHeader.innerHTML = `Chat with <b>${displayName}</b>`;
  chatMessages.innerHTML = "";

  if (unsubscribeMessages) unsubscribeMessages();

  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, where("chatId", "==", chatId), orderBy("timestamp"));

  unsubscribeMessages = onSnapshot(q, snapshot => {
    chatMessages.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const isAdmin = msg.sender === adminUID;
      const messageType = isAdmin ? "from-admin" : "from-user";

      const time = msg.timestamp?.toDate().toLocaleString('en-GB', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: 'short', year: 'numeric'
      }) || "";

      const div = document.createElement("div");
      div.className = `chat-message ${messageType}`;
      div.innerHTML = `
        <div class="msg-bubble">
          <p>${msg.text}</p>
          <div class="msg-meta">
            <small>${isAdmin ? 'Admin' : 'User'} · ${time}</small>
          </div>
        </div>
      `;
      chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

///// Typing indicator /////
chatInput.addEventListener("input", () => {
  if (selectedDisplayName) {
    chatHeader.innerHTML = `Chat with <b>${selectedDisplayName}</b> <span style="font-size: 0.8rem; font-weight: normal;">typing...</span>`;
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      chatHeader.innerHTML = `Chat with <b>${selectedDisplayName}</b>`;
    }, 1500);
  }
});

// Send message
sendBtn.onclick = sendMessage;

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent newline
    sendMessage();
  }
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !selectedChatId) return;

  await addDoc(collection(db, "messages"), {
    chatId: selectedChatId,
    sender: adminUID,
    text,
    timestamp: serverTimestamp(),
    read: { [adminUID]: true }
  });

  chatInput.value = "";
}

loadChatList();