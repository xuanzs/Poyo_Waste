import { db } from './firebase.js';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Make these available to the window object
window.editUser = editUser;
window.removeUser = removeUser;
window.closeModal = closeModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const usersRef = collection(db, "users");
  const userList = document.getElementById("userList");
  const modal = document.getElementById("userModal");
  const userForm = document.getElementById("userForm");
  const addUserBtn = document.getElementById("addUserBtn");
  const exportCsvBtn = document.getElementById("exportCsvBtn");
  const searchInput = document.getElementById("searchInput");

  // Only run user management code if on user management page
  if (userList && modal && userForm) {
    loadUsers();

    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", exportToCsv);
    }

    if (searchInput) {
      searchInput.addEventListener("keyup", filterUsers);
    }
  }

  // Add user button exists on both pages
  if (addUserBtn) {
    addUserBtn.addEventListener("click", openAddUserModal);
  }

  if (userForm) {
    userForm.addEventListener("submit", handleFormSubmit)
  }
});

////// Core Functions //////

async function loadUsers() {
  const userList = document.getElementById("userList");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const emptyState = document.getElementById("emptyState");
  const usersRef = collection(db, "users");

  if (!userList) return;

  userList.innerHTML = "";
  if (loadingSpinner) loadingSpinner.style.display = "block";
  if (emptyState) emptyState.style.display = "none";

  const snapshot = await getDocs(usersRef);
  if (loadingSpinner) loadingSpinner.style.display = "none";

  if (snapshot.empty) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <strong>${user.fullname}</strong><br/>
        <small>${user.email}</small><br/>
        <small style="font-size: 0.8rem; color: gray;">Phone: ${user.phone_number || '-'}</small>
      </td>
      <td><span class="badge ${badgeColor(user.role)}">${user.role}</span></td>
      <td class="${user.status === 'Active' ? 'success' : 'danger'}">${user.status}</td>
      <td>${(user.permissions || []).join(", ")}</td>
      <td>
        <div class="table-actions">
          <button class="icon-btn edit-btn" title="Edit" onclick="editUser('${docSnap.id}')">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn remove-btn" title="Remove" onclick="removeUser('${docSnap.id}')">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    `;
    userList.appendChild(row);
  });
}

async function exportToCsv() {
  const btn = document.getElementById("exportCsvBtn");
  if (!btn) return;

  btn.innerText = "Exporting...";
  btn.disabled = true;

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  let csv = "Full Name,Email,Phone Number,Role,Status,Permissions\n";

  snapshot.forEach(docSnap => {
    const u = docSnap.data();
    csv += `${u.fullname},${u.email},${u.phone_number || ''},${u.role},${u.status},"${(u.permissions || []).join(';')}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "user_list.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  btn.innerText = "Export";
  btn.disabled = false;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const usersRef = collection(db, "users");
  
  const id = document.getElementById("userId").value;
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const phone_number = document.getElementById("phone_number").value;
  const role = document.getElementById("role").value;
  const permissions = Array.from(document.querySelectorAll(".checkbox-group input:checked")).map(cb => cb.value);

  const payload = { fullname, email, phone_number, role, permissions, status: "Pending" };

  if (id) {
    await updateDoc(doc(db, "users", id), payload);
  } else {
    await addDoc(usersRef, payload);
  }

  closeModal();
  loadUsers();
}

async function editUser(id) {
  const usersRef = collection(db, "users");
  const modal = document.getElementById("userModal");
  const snapshot = await getDocs(usersRef);
  
  snapshot.forEach((docSnap) => {
    if (docSnap.id === id) {
      const user = docSnap.data();
      document.getElementById("userId").value = id;
      document.getElementById("fullname").value = user.fullname;
      document.getElementById("email").value = user.email;
      document.getElementById("phone_number").value = user.phone_number || "";
      document.getElementById("role").value = user.role;

      document.querySelectorAll(".checkbox-group input").forEach(cb => {
        cb.checked = user.permissions?.includes(cb.value);
      });

      document.getElementById("modalTitle").innerText = "Edit User";
      if (modal) modal.style.display = "block";
    }
  });
}

async function removeUser(id) {
  await deleteDoc(doc(db, "users", id));
  loadUsers();
}

function openAddUserModal() {
  document.getElementById("modalTitle").innerText = "Add User";
  document.getElementById("userModal").style.display = "block";
  document.getElementById("userForm").reset();
  document.getElementById("userId").value = "";
}

function closeModal() {
  const modal = document.getElementById("userModal");
  if (modal) modal.style.display = "none";
  const form = document.getElementById("userForm");
  if (form) form.reset();
  document.getElementById("userId").value = "";
}

function filterUsers() {
  const filter = this.value.toLowerCase();
  const userList = document.getElementById("userList");
  if (!userList) return;
  
  const rows = userList.querySelectorAll("tr");
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
}

function badgeColor(role) {
  switch (role) {
    case 'Product Manager': return 'badge-blue';
    case 'Operations Manager': return 'badge-orange';
    case 'Warehouse Associate': return 'badge-purple';
    case 'Manager': return 'badge-teal';
    case 'HR Specialist': return 'badge-pink';
    case 'Marketing Manager': return 'badge-yellow';
    case 'Collector': return 'badge-cyan';
    case 'Staff': return 'badge-gray';
    case 'Admin': return 'badge-red';
    case 'Other': return 'badge-dark';
    default: return 'badge-default';
  }
}