import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
  		token: '',
	},
	mutations: {
	  	login(state, token){
		    state.token = token
	  	},
	  	logout(state){
	    	state.token = ''
	  	},
	},
	actions: {
	  	login({commit}, user){
	        return new Promise((resolve, reject) => {
	            axios({
					url: 'http://localhost:3000/api/session/student',
					data: user,
					method: 'post',
				})
	            .then(resp => {
	                const token = resp.data.token
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
					commit('login', token);
	                resolve(resp)
	            })
	            .catch(err => {
					console.log(err)
	                reject(err)
	            })
	        })
	    },
	  	logout({commit}){
		    return new Promise((resolve, reject) => {
				delete axios.defaults.headers.common['Authorization']
				commit('logout', '');
		      	resolve()
		    })
	  	}
	},
	getters : {
	  isLoggedIn: state => !!state.token,
	}
})
