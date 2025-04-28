const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const sideBars = document.querySelectorAll(".sidebar a");

//show sidebar
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('show');
})

// close sidebar
closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('show');
})

// change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
})

// clicked
sideBars.forEach(sideBar => {
    sideBar.addEventListener('click', function() {
        // Remove the active class from all sidebar links
        sideBars.forEach(sideBar => sideBar.classList.remove('active'));

        // Add the active class to the clicked link
        this.classList.add('active');
    })
})




// === ADD USER (Front-end only for now) ===
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;

    if (!username || !email) {
        alert("Please fill in all fields.");
        return;
    }

    const tbody = document.querySelector("tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${username}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td class="success">Active</td>
        <td>
            <button class="success">Approve</button>
            <button class="danger">Remove</button>
        </td>
    `;
    tbody.appendChild(row);

    document.getElementById("addUserForm").reset();
});

// === SEARCH FILTER ===
document.getElementById("searchInput").addEventListener("keyup", function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});

