<template>
  <div>
    <pre>
      <code>Openn the Project in a Text editor && Open the console :)</code>
    </pre>
    <Login v-if="!isLoggedIn" />
    
    <button v-if="isLoggedIn" @click="getStudentInfo">getStudentInfo</button>
    <button v-if="isLoggedIn" @click="createProgram">createProgram</button>
    <button v-if="isLoggedIn" @click="getProgramInfo(0)">getProgramInfo</button>
    <button v-if="program_id" @click="createFocusItem">createFocusItem</button>
    <button v-if="student_id && focusitem_id && program_id" @click="createAnalyticItem">createAnalyticItem</button>

  </div>
</template>

<script>
import axios from 'axios';
import Login from '@/components/Login'

export default {
  name: 'home',
  data() {
    return {
      apiHost: 'http://localhost:3000',
      student_id: '',
      focusitem_id: '',
      program_id: '',
    }
  },
  components: {
    Login
  },
  computed : {
    isLoggedIn() { return this.$store.getters.isLoggedIn }
  },
  methods: {
    async getStudentInfo() {
      try {
        const response = await axios({
          url: `${this.apiHost}/api/session/studentinfo`,
        })
        const student = response.data.student;
        console.log('STUDENT: ', student);
        this.student_id = student._id;
      } catch (error) { console.error(error); }
    },

    async createProgram() {
      try {
        const response = await axios({
          method: 'POST',
          url: `${this.apiHost}/api/program`,
          data: {
            "name": "BrainyEd App 9000",
            "description": "Spacehips and other fun things",
            "type": "mobile game" // can only be either "mobile game" or "website"
          },
        });
        const newProgram = response.data.program;
        console.log('NEW PROGRAM: ', newProgram);
        this.program_id = newProgram._id;
      } catch (error) { console.error(error); }
    },
    
    
    async getProgramInfo(index) {
      try {
        const response = await axios({
          url: `${this.apiHost}/api/programs`,
        });
        const programs = response.data.programs;
        console.log('PROGRAMS: ', programs);
        this.program_id = programs[index]._id;
      } catch (error) { console.error(error); }
    },
    
    async createFocusItem() {
      try {
        console.log(this.program_id);
        const response = await axios({
          method: 'POST',
          url: 'http://localhost:3000/api/focusitem',
          data: {
            "unit": "Zoo-Animals",
            "subunit": "Birds",
            "name": "question__parrot",
            "program": this.program_id,
          },
        });
        const newFocusItem = response.data.focusitem;
        console.log('NEW FOCUS ITEM: ', newFocusItem);
        this.focusitem_id = newFocusItem._id
      } catch (error) { console.error(error); }
    },

    async createAnalyticItem() {
      try {
        const response = await axios({
          method: 'POST',
          url: 'http://localhost:3000/api/analytics/application',
          data: {
            "student": this.student_id,
            "program": this.program_id,
            "focus_item": this.focusitem_id,
            "correct_on": 2, 
            "time_spent": 30,
          }
        });
        const newAnalyticItem = response.data.analytic;
        console.log('NEW Analytic ITEM: ', newAnalyticItem);
      } catch (error) { console.error(error); }
    },
  }
}
</script>
