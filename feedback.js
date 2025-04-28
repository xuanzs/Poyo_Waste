import { db } from './firebase.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const feedbackBody = document.getElementById("feedbackBody");

async function loadFeedback() {
  try {
    const snapshot = await getDocs(collection(db, "staff_feedback"));
    feedbackBody.innerHTML = "";

    if (snapshot.empty) {
      feedbackBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No feedback found.</td></tr>`;
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const submittedAt = data.submittedAt?.seconds
        ? new Date(data.submittedAt.seconds * 1000).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : "-";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.feedbackId || doc.id}</td>
        <td>${data.staffName || "—"}</td>
        <td>${data.role || "—"}</td>
        <td>${data.feedbackType || "—"}</td>
        <td class="comments-column">${data.comments || "—"}</td>
        <td>${submittedAt}</td>
      `;

      feedbackBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading feedback:", error);
    feedbackBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: red;">Error loading feedback</td></tr>`;
  }
}

loadFeedback();