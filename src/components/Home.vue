<template>
    <div class="home-container">
        <h2>This is home page</h2>
        <app-footer></app-footer>
    </div>
</template>


<script>
import FooterBar from '@/components/partials/FooterBar'

export default {
  name: 'Home',
  components: {
      'app-footer': FooterBar
  }
}
</script>

<style lang="scss">
  @import "../sass/_foot"
</style>