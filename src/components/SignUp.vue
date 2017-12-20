<template>
  <div class="signup-container">
      <h2>SignUp Page</h2>
      <form>
          <input type="text" class="signup-username" placeholder="Please enter username!" />
          <input type="password" class="signup-password" placeholder="Please enter password!" />
          <button class="btn btn-success signup-submit-btn">Sign Up</button>
          <router-link to="/login">Login</router-link>
      </form>
  </div>
</template>

<script>
export default {
  name: 'SignUp'
}
</script>