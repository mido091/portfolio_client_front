import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Global Settings System - Initialize theme and CSS variables
import "@/composables/useSiteSettings";

// FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Solid icons
import {
  faUserSecret,
  faComments,
  faMagnifyingGlass,
  faUtensils,
  faPenFancy,
  faChartColumn,
  faCode,
  faArrowUp,
  faHouse,
  faUsers,
  faTable,
  faChartPie,
  faPen,
  faStar,
  faGear,
  faRightFromBracket,
  faUserPlus,
  faSave,
  faEdit,
  faTrash,
  faEye,
  faTimes,
  faSpinner,
  faUserGroup,
  faUsersSlash,
  faSun,
  faMoon,
  faChevronDown,
  faChartLine,
  faUser,
  faBriefcase,
  faGears,
  faFolderOpen,
  faPenNib,
  faUserTie,
  faEnvelope,
  faPalette,
  faChartSimple,
  faPlus,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import {
  faHtml5,
  faCss3,
  faJs,
  faReact,
  faFacebookF,
  faSquareInstagram,
  faSquareTwitter,
  faLinkedin,
  faGithub,
  faBehance,
  faTiktok,
  faYoutube,
  faInstagram,
  faTwitter,
  faWhatsapp,
  faTelegram,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

const app = createApp(App);

// إضافة الأيقونات للمكتبة
library.add(
  faUserSecret,
  faComments,
  faMagnifyingGlass,
  faUtensils,
  faHtml5,
  faCss3,
  faJs,
  faReact,
  faPenFancy,
  faChartColumn,
  faFacebookF,
  faSquareInstagram,
  faSquareTwitter,
  faLinkedin,
  faGithub,
  faBehance,
  faTiktok,
  faYoutube,
  faInstagram,
  faTwitter,
  faWhatsapp,
  faTelegram,
  faGoogle,
  faCode,
  faArrowUp,
  faHouse,
  faUsers,
  faTable,
  faChartPie,
  faPen,
  faStar,
  faGear,
  faRightFromBracket,
  faUserPlus,
  faSave,
  faEdit,
  faTrash,
  faEye,
  faTimes,
  faSpinner,
  faUserGroup,
  faUsersSlash,
  faSun,
  faMoon,
  faChevronDown,
  faChartLine,
  faUser,
  faBriefcase,
  faGears,
  faFolderOpen,
  faPenNib,
  faUserTie,
  faEnvelope,
  faPalette,
  faChartSimple,
  faPlus,
  faUpRightFromSquare
);

// تسجيل المكون Globally
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.mount("#app");
