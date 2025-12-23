<template>
  <!-- Login & Register Section -->
  <section class="auth-section">
    <div class="container">
      <div class="auth-wrapper">
        <!-- Form Container -->
        <div class="form-container">
          <div class="form-toggle">
            <button
              class="toggle-btn"
              :class="{ active: currentForm === 'login' }"
              @click="
                currentForm = 'login';
                statusMsg = '';
              "
            >
              Login
            </button>
            <button
              class="toggle-btn"
              :class="{ active: currentForm === 'register' }"
              @click="
                currentForm = 'register';
                statusMsg = '';
              "
            >
              Register
            </button>
          </div>

          <!-- Messages -->
          <div
            v-if="statusMsg"
            :class="[
              statusType === 'error' ? 'error-message' : 'success-message',
              'show',
            ]"
            style="margin-bottom: 15px"
          >
            {{ statusMsg }}
          </div>

          <!-- Login Form -->
          <div
            class="form-content"
            :class="{ active: currentForm === 'login' }"
            v-show="currentForm === 'login'"
          >
            <h2>Welcome <span>Back!</span></h2>
            <p class="form-description">Please login to your account</p>
            <form @submit.prevent="handleLogin">
              <div class="input-group">
                <i class="fa-solid fa-envelope"></i>
                <input
                  v-model="loginData.email"
                  type="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-lock"></i>
                <input
                  v-model="loginData.password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div class="form-options">
                <label class="remember-me">
                  <input v-model="loginData.remember" type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  class="forgot-password"
                  @click.prevent="
                    currentForm = 'forgot';
                    statusMsg = '';
                  "
                  >Forgot Password?</a
                >
              </div>
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Logging in..." : "Login" }}
              </button>
              <div class="form-footer">
                <p>
                  Don't have an account?
                  <a
                    href="#"
                    @click.prevent="
                      currentForm = 'register';
                      statusMsg = '';
                    "
                    >Register here</a
                  >
                </p>
              </div>
            </form>
          </div>

          <!-- Register Form -->
          <div
            class="form-content"
            :class="{ active: currentForm === 'register' }"
            v-show="currentForm === 'register'"
          >
            <h2>Create <span>Account</span></h2>
            <p class="form-description">Join us today and get started</p>
            <form @submit.prevent="handleRegister">
              <div class="input-group">
                <i class="fa-solid fa-user"></i>
                <input
                  v-model="registerData.name"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-envelope"></i>
                <input
                  v-model="registerData.email"
                  type="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-lock"></i>
                <input
                  v-model="registerData.password"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-lock"></i>
                <input
                  v-model="registerData.confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <div class="form-options">
                <label class="remember-me">
                  <input
                    v-model="registerData.agree"
                    type="checkbox"
                    required
                  />
                  <span>I agree to the <a href="#">Terms & Conditions</a></span>
                </label>
              </div>
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Registering..." : "Register" }}
              </button>
              <div class="form-footer">
                <p>
                  Already have an account?
                  <a
                    href="#"
                    @click.prevent="
                      currentForm = 'login';
                      statusMsg = '';
                    "
                    >Login here</a
                  >
                </p>
              </div>
            </form>
          </div>

          <!-- Forgot Password Form -->
          <div
            class="form-content"
            :class="{ active: currentForm === 'forgot' }"
            v-show="currentForm === 'forgot'"
          >
            <h2>Reset <span>Password</span></h2>
            <p class="form-description">Enter your email to receive OTP</p>

            <!-- Step 1: Email Input -->
            <form
              class="forgot-step"
              :class="{ active: forgotStep === 1 }"
              v-show="forgotStep === 1"
              @submit.prevent="sendOTP"
            >
              <div class="input-group">
                <i class="fa-solid fa-envelope"></i>
                <input
                  v-model="forgotData.email"
                  type="email"
                  placeholder="Email Address"
                  required
                />
              </div>
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Sending..." : "Send OTP" }}
              </button>
              <div class="form-footer">
                <p>
                  Remember your password?
                  <a
                    href="#"
                    @click.prevent="
                      currentForm = 'login';
                      statusMsg = '';
                    "
                    >Login here</a
                  >
                </p>
              </div>
            </form>

            <!-- Step 2: OTP and New Password -->
            <form
              class="forgot-step"
              :class="{ active: forgotStep === 2 }"
              v-show="forgotStep === 2"
              @submit.prevent="resetPassword"
            >
              <div class="input-group">
                <i class="fa-solid fa-key"></i>
                <input
                  v-model="forgotData.code"
                  type="text"
                  placeholder="Enter OTP Code"
                  required
                  maxlength="6"
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-lock"></i>
                <input
                  v-model="forgotData.newPassword"
                  type="password"
                  placeholder="New Password"
                  required
                  minlength="6"
                />
              </div>
              <div class="input-group">
                <i class="fa-solid fa-lock"></i>
                <input
                  v-model="forgotData.confirmNewPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  minlength="6"
                />
              </div>
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Resetting..." : "Reset Password" }}
              </button>
              <div class="form-footer">
                <p>
                  <a
                    href="#"
                    @click.prevent="
                      forgotStep = 1;
                      statusMsg = '';
                    "
                    >Back to email</a
                  >
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuth } from "../composables/useAuth";
import "/src/assets/js/all.js/all.js";

const router = useRouter();
const { setUser } = useAuth();

const currentForm = ref("login"); // 'login', 'register', 'forgot'
const forgotStep = ref(1); // 1: Email, 2: OTP/Reset
const loading = ref(false);
const statusMsg = ref("");
const statusType = ref("error");

const loginData = reactive({
  email: "",
  password: "",
  remember: false,
});

const registerData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

const forgotData = reactive({
  email: "",
  code: "",
  newPassword: "",
  confirmNewPassword: "",
  token: null,
});

const handleLogin = async () => {
  loading.value = true;
  statusMsg.value = "";
  try {
    const data = await api("/users/login", {
      method: "POST",
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    setUser(
      {
        id: data.id,
        name: data.username,
        email: loginData.email,
        image: data.image,
        role: data.role,
      },
      data.token
    );

    statusMsg.value = "Login successful! Redirecting...";
    statusType.value = "success";

    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error) {
    statusMsg.value = error.message;
    statusType.value = "error";
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (registerData.password !== registerData.confirmPassword) {
    statusMsg.value = "Passwords do not match";
    statusType.value = "error";
    return;
  }

  loading.value = true;
  statusMsg.value = "";
  try {
    await api("/users/register", {
      method: "POST",
      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      }),
    });

    statusMsg.value = "Registration successful! Please login.";
    statusType.value = "success";

    setTimeout(() => {
      currentForm.value = "login";
      loginData.email = registerData.email;
      statusMsg.value = "";
    }, 2000);
  } catch (error) {
    statusMsg.value = error.message;
    statusType.value = "error";
  } finally {
    loading.value = false;
  }
};

const sendOTP = async () => {
  loading.value = true;
  statusMsg.value = "";
  try {
    const data = await api("/users/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: forgotData.email }),
    });

    forgotData.token = data.token;
    statusMsg.value = "OTP sent to your email!";
    statusType.value = "success";

    setTimeout(() => {
      forgotStep.value = 2;
      statusMsg.value = "";
    }, 2000);
  } catch (error) {
    statusMsg.value = error.message;
    statusType.value = "error";
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  if (forgotData.newPassword !== forgotData.confirmNewPassword) {
    statusMsg.value = "Passwords do not match";
    statusType.value = "error";
    return;
  }

  loading.value = true;
  statusMsg.value = "";
  try {
    await api("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: forgotData.token,
        code: forgotData.code,
        newPassword: forgotData.newPassword,
      }),
    });

    statusMsg.value = "Password reset successful!";
    statusType.value = "success";

    setTimeout(() => {
      currentForm.value = "login";
      loginData.email = forgotData.email;
      forgotStep.value = 1;
      statusMsg.value = "";
    }, 2000);
  } catch (error) {
    statusMsg.value = error.message;
    statusType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "/src/assets/css/all.css/all.css";
@import "/src/assets/css/login/login.css";

/* Ensure visibility when 'active' class is present (as used in existing CSS) */
.form-content.active {
  display: block;
}
.forgot-step.active {
  display: block;
}

.error-message,
.success-message {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
}

.error-message {
  background-color: #fce4e4;
  color: #cc0033;
  border: 1px solid #fcc2c2;
}

.success-message {
  background-color: #e4fce4;
  color: #008000;
  border: 1px solid #c2fcc2;
}
</style>
