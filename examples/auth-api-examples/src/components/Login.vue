<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
	 <div>
     	<label>USER ID</label>
     	<input required v-model="id" type="text" placeholder="ID Number"/>
	 </div>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
	export default {
		data(){
			return {
				id : '',
            }
		},
		methods: {
		 	login() {
		   		this.$store.dispatch('login', { id: this.id })
		   		.then(() => this.$router.push('/'))
		   		.catch(err => console.log(err))
		   	}
		}
	}
</script>

<style scoped>

form {
	max-width: 400px;
	width: 100%;
	margin: 0 auto;
	padding: 3rem;
}
label, input {
	display: block;
	text-align: left;
	width: 100%;
	margin: 0.5rem;
}

</style>