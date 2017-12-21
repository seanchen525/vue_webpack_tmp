<template>
  <div class="login-container">
      <h2>Login Page</h2>
      <form>
          <input type="text" class="login-username" placeholder="Please enter username!" />
          <input type="password" class="login-password" placeholder="Please enter password!" />
          <button class="btn btn-success login-submit-btn">Login</button>
          <router-link to="/signup">Sign Up</router-link>
      </form>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>