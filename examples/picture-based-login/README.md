# Brainy Kids Authentication and API Examples

> A simple example of authentication to Brainy Kids API using a [Vue](https://vuejs.org/) app with [Axios](https://github.com/axios/axios) for requests

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

```

## API
Full list of API Endpoints can be seen at the wiki 
[https://github.com/BrainyEducation/Brainy-Kids/wiki](https://github.com/BrainyEducation/Brainy-Kids/wiki)

## Walkthrough
This example is Intended to be running alongside a local instance of Brainy Kids DAP. Brainy Kids Defaults to http://localhost:3000 but can be changed as needed.


1. Setup a local version of Brainy Kids (https://github.com/BrainyEducation/Brainy-Kids)
2. Create a Teacher account 
    1. Visit http://localhost:3000/register > create a Teacher account 
        - A Teacher account has a 3digit id number – this will be 001 for the initial teacher account on localhost
    2. Sign in and visit http://localhost:3000/students > create a new student
        - A Student also has a 3digit id number, you choose this when creating a student e. 123
3. Login as a Student With the combination of the Teacher Id and student Id e.g 001123 with the previous example
4. Check the Network/Console for confirmation requests are correctly authenticated
5. Test API endpoints with code examples – found in `Home.vue` 

## Authentication
– Send a POST request with the student ID number to `/api/session/student`
– On 200 – set the returned token as an `Authorization` header for further requests `axios.defaults.headers.common['Authorization'] = Bearer ${token}`


