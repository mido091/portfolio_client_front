import { ref, computed } from "vue";

const user = ref(JSON.parse(localStorage.getItem("user")));
const token = ref(localStorage.getItem("token"));

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/ddqlt5oqu/image/upload/v1764967019/default_pi1ur8.webp";
const API_BASE = "https://portfolio-client-server.vercel.app"; // Base URL without /api

const resolveAvatarUrl = (path) => {
  if (!path) return DEFAULT_AVATAR;
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

const extractUserIdFromToken = (tokenValue) => {
  if (!tokenValue) return null;
  try {
    const base64Url = tokenValue.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || payload.userId || null;
  } catch (err) {
    console.error("[useAuth] Failed to decode token:", err);
    return null;
  }
};

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(
    () => user.value?.role === "admin" || user.value?.role === "owner"
  );
  const isOwner = computed(() => user.value?.role === "owner");

  // Initialize image and ID if missing but token is present
  if (token.value && (!user.value || !user.value.id || !user.value.image)) {
    const extractedId = extractUserIdFromToken(token.value);
    if (extractedId) {
      if (!user.value) user.value = { id: extractedId };
      else user.value.id = extractedId;
    }

    if (user.value && !user.value.image) {
      user.value.image = localStorage.getItem("userImage") || DEFAULT_AVATAR;
    }
  }

  const setUser = (userData, userToken) => {
    if (userData) {
      // Ensure we don't overwrite ID with undefined if token has it
      if (!userData.id) {
        userData.id = extractUserIdFromToken(userToken);
      }

      // Resolve image URL
      userData.image = resolveAvatarUrl(userData.image);
      localStorage.setItem("userImage", userData.image);
    }

    user.value = userData;
    token.value = userToken;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    // After setting user, trigger a refresh to get full data (including image if missed)
    if (userData?.id) {
      refreshUser();
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userImage");
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    const currentToken = token.value || localStorage.getItem("token");
    const currentId = user.value?.id || extractUserIdFromToken(currentToken);

    if (!currentToken || !currentId) return;

    try {
      const response = await fetch(`${API_BASE}/api/users/${currentId}`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (!response.ok) throw new Error("Failed to refresh user");
      const data = await response.json();

      if (data.user) {
        const resolvedImage = resolveAvatarUrl(data.user.image);
        localStorage.setItem("userImage", resolvedImage);

        const updatedUser = {
          id: data.user.id,
          name: data.user.username || data.user.name,
          email: data.user.email,
          image: resolvedImage,
          role: data.user.role,
        };
        user.value = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("[useAuth] Auth Refresh Error:", err);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isOwner,
    setUser,
    refreshUser,
    logout,
  };
}
