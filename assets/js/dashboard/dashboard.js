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

// Logout functionality is now handled by logout-modal.js
// The modal provides a confirmation dialog before logging out
