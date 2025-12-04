const userCount = document.getElementsByClassName("user_count")[0];

// user count
fetch("https://portfolio-client-server.vercel.app/api/users", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // ارسال التوكن
  },
})
  .then((res) => res.json())
  .then((data) => {
    userCount.innerHTML = data.users.length;
  })
  .catch((err) => console.log(err));

// posts count
const postCount = document.getElementsByClassName("post_count")[0];
fetch("https://portfolio-client-server.vercel.app/api/plogs", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // ارسال التوكن
  },
})
  .then((res) => res.json())
  .then((data) => {
    postCount.innerHTML = data.plogs.length;
  })
  .catch((err) => console.log(err));

// Universal Logout Functionality
// Works on all dashboard pages
document.addEventListener("DOMContentLoaded", function () {
  const logoutElements = document.querySelectorAll(".log-out");

  logoutElements.forEach(function (logoutElement) {
    logoutElement.addEventListener("click", function (e) {
      e.preventDefault();

      // Clear all login-related data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("username");

      // Redirect to home page
      window.location.href = "index.html";
    });
  });
});
