<template>
  <div>
    <Login v-if="!isLoggedIn" />
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  name: 'home',
  components: {
    Login
  },
  computed : {
    isLoggedIn() { return this.$store.getters.isLoggedIn }
  },
}
</script>
