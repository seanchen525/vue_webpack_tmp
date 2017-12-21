<template>
  <div class="header-bar clearfix">
      <nav class="navbar navbar-dark navbar-fixed-top bg-primary">
        <div class="container-fluid">
          <div class="navbar-header">
            <router-link class="navbar-brand" to="/">
              <img alt="brand" src="../../assets/logo.png" width="20" height="20" />
            </router-link>
          </div>
          <div class="collapse navbar-collapse">
            <form class="navbar-form navbar-left">
              <div class="form-group">
                <input type="text" class="form-control" placeholder="Search" />
              </div>
              <button type="submit" class="btn btn-success">Search</button>
            </form>
            <ul class="nav navbar-nav navbar-right">
              <li><router-link to="/profile">Home</router-link></li>
              <li><router-link to="/login">Login</router-link></li>
              <li><router-link to="/signup">SignUp</router-link></li>
            </ul>
          </div>
        </div>
      </nav>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar'
}
</script>