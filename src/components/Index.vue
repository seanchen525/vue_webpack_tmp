<template>
    <div class="index-container">
        <h2>This is index page</h2>
        <app-footer></app-footer>
    </div>
</template>


<script>
import FooterBar from '@/components/partials/FooterBar'

export default {
  name: 'Index',
  components: {
    'app-footer': FooterBar
  }
}
</script>

<style lang="scss">
  @import "../sass/_foot"
</style>