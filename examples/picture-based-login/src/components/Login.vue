<template>
 <div>
   	<div class="picture-login">
		<h1>Student Sign in</h1>
		<div class="picture-login__password">
			<template v-for="(number, index) in pass">
				<div v-if="number === 0" class="picture-login__placeholder" :key="index"></div>
				<img
					v-else
					:src="require(`@/assets/${number}.png`)"
					:key="number"
					@click="imgReplace(index)"
				>
			</template>
			<template v-for="(number, index) in placeholder">
				<div class="picture-login__placeholder" :key="index"></div>
			</template>
		</div>
		<div class="picture-login__numbers">
			<img v-for="(img, index) in images" :key="img" :src="img" @click="imgSelected(index)">
		</div>
		<a class="btn" @click="login">Login</a>
	 </div>
     
 </div>
</template>

<script>
	import Vue from 'vue';
	export default {
		data(){
			return {
				id : '',
				placeholder: [0,0,0,0,0],
				pass: [],
				letters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','u','r','s','t','v','w','x','y','z'],
				images : ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','u','r','s','t','v','w','x','y','z'].map( x => require(`@/assets/${x}.png`) ),
            }
		},
		watch: {
			pass(val) {
				this.id = val.join('');
			},
		},
		methods: {
			imgSelected(index){
				if(this.pass.length <5){
					this.pass.push( this.letters[index]);
					this.placeholder.pop()
				} else {
					Vue.set(this.pass, this.pass.indexOf(0), this.letters[index]);
				}
			},
			
			imgReplace(index){
				Vue.set(this.pass, index, 0)
			},

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

.picture-login {
	padding: 2rem;
	background: #95E1E7;
	max-width: 50rem;
	margin: 0 auto;
	border-radius: 0.5rem;
}

.picture-login h1 {
	margin-bottom: 2rem;
}

.picture-login__password {
	margin-bottom: 2rem;;
}

.picture-login__password img,
.picture-login__placeholder {
	height: 4rem;
	width: 4rem;
	border-radius: 8px;
	margin: 0.5rem;
	cursor: pointer;
	border: transparent 3px solid;
	display: inline-block;
}
.picture-login__placeholder {
	border: #797979 2px dotted;
}

.picture-login__numbers {
    flex-direction: column;
    display: flex;
    max-height: 300px;
    flex-wrap: wrap;
	overflow: scroll;
}

.picture-login__numbers img {
	height: 8rem;
	width: 8rem;
	border-radius: 8px;
	margin: 0.5rem;
	cursor: pointer;
	border: transparent 3px solid;
}

.picture-login_numbers img:hover {
	border: dotted 3px #444;
}
.btn {
	background: #4CAF50;
	color: #fff;
	border-radius: 8px;
	padding: 0.5rem 1rem;
	margin-top: 2rem;
	display: inline-block;
	font-weight: 700;
	cursor: pointer;
}

</style>