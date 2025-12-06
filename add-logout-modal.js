// Script to add logout modal to index.html
const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "index.html");
let content = fs.readFileSync(indexPath, "utf8");

// Add CSS in head (after og:type meta tag)
if (!content.includes("logout-modal.css")) {
  content = content.replace(
    '<meta property="og:type" content="">',
    '<meta property="og:type" content="">\n        <!-- Logout Modal CSS -->\n        <link rel="stylesheet" href="assets/css/logout-modal.css" />'
  );
  console.log("✓ Added logout modal CSS");
}

// Add JS after auth.js
if (!content.includes("logout-modal.js")) {
  content = content.replace(
    '<script src="assets/js/auth.js"></script>',
    '<script src="assets/js/auth.js"></script>\n        <!-- Logout Modal Script -->\n        <script src="assets/js/logout-modal.js"></script>'
  );
  console.log("✓ Added logout modal JS");
}

fs.writeFileSync(indexPath, content, "utf8");
console.log("✓ index.html updated successfully!");
