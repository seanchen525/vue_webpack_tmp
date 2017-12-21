<template>
  <div id="app">
    <app-header></app-header>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import HeaderBar from '@/components/partials/HeaderBar'

export default {
  name: 'App',
  components: {
    'app-header': HeaderBar
  }
}
</script>

<style lang="scss">
  @import "sass/main"
</style>
