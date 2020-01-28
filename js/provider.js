//array for training
var courses = [
    {topic: "math", location: "hendon", price: 100},
    {topic: "math", location: "colindale", price: 80},
    {topic: "math", location: "brent cross", price: 90},
    {topic: "math", location: "golders green", price: 120},
    {topic: "english", location: "hendon", price: 110},
    {topic: "english", location: "colindale", price: 90},
    {topic: "english", location: "brent cross", price: 90},
    {topic: "english", location: "golders green", price: 130},
    {topic: "piano", location: "hendon", price: 120},
    {topic: "piano", location: "golders green", price: 140},
    {topic: "sports club", location: "golders green", price: 200}
];

//creates localStorage version of the courses array
!localStorage.getItem("courses") ? localStorage.setItem("courses", JSON.stringify(courses)) :
    courses = JSON.parse(localStorage.getItem("courses"));

// Provider Preview Instance
var providerApp = new Vue({
    el: '#provider-add',
    data: {
        topic: '',
        location: '',
        price: Number,
        about: '',
        isEditing: false
    },
    methods: {
        addClass: function () {
            courses = "";
            if (localStorage.getItem("courses")) {
                courses = JSON.parse(localStorage.getItem("courses"));
            }
            if (courses) {
                courses.push({
                    topic: this.topic,
                    location: this.location,
                    price: this.price,
                    about: this.about,
                    user: document.getElementById("userEmail").innerText
                });
                localStorage.setItem("courses", JSON.stringify(courses));
            } else {
                courses = [{
                    topic: this.topic,
                    location: this.location,
                    price: this.price,
                    about: this.about,
                    user: document.getElementById("userEmail").innerText
                }];
                localStorage.setItem("courses", JSON.stringify(courses));
            }
        }
    }
});

var providerView = new Vue({
    el: '#providerView',
    data: {
        courses: courses,
        isEditing: providerApp.isEditing
    },
    computed: {
        filterCoursesByEmail: function () {
            return this.courses.map(this.checkUserInCourses);
        }
    },
    methods: {
        checkUserInCourses: function (course) {
            if (course.user === document.getElementById("userEmail").innerText) {
                return course;
            }
        },
        removeActivity: (index) => {
            let courseId = index.path[3].id;
            let courses = JSON.parse(localStorage.getItem("courses"));

            // removes a course from the list
            courses.splice(courseId, 1);

            // refreshes localstorage
            localStorage.setItem("courses", JSON.stringify(courses));

            // deletes div element of the course
            index.path[3].remove();

            console.log("ID: " + courseId +  " has been removed");

        },
        editActivity: function(index) {

            this.isEditing = true;

        },
        save: function(index) {
            this.isEditing = false;

            let courseId = index.path[3].id;
            let courses = JSON.parse(localStorage.getItem("courses"));

            console.log(JSON.stringify(courses));
        }
    }
});
