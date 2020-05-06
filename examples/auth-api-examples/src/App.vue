<template>
  <div id="app">
    <div id="nav">
      <span>Brainy Kids | </span>
      <router-link to="/">Home</router-link>
      <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
    </div>
    <router-view/>
  </div>
</template>
<script>
  export default {
    computed : {
      isLoggedIn() { return this.$store.getters.isLoggedIn }
    },
    methods: {
      logout: () => {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      },
    },
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  cursor: pointer;
}

#nav a:hover {
  text-decoration: underline;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
