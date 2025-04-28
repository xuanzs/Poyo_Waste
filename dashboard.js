const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const sideBars = document.querySelectorAll(".sidebar a");

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
        themeToggler.querySelector('span:nth-child(2)').classList.add('active');
    }
});

// Show sidebar
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('show');
});

// Close sidebar
closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('show');
});

// Change theme
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    // Toggle active state of theme icons
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

    // Save theme preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-theme-variables');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Set active sidebar link
sideBars.forEach(sideBar => {
    sideBar.addEventListener('click', function() {
        sideBars.forEach(sideBar => sideBar.classList.remove('active'));
        this.classList.add('active');
    });
});