// Current user's email
let userEmail = () => {
    fetch('http://localhost:3000/collections/users/status/true')
        .then(res => res.json())
        .then(value => {
            providerView.currentEmail = (value.email).toLowerCase()
        })
        .catch(err => {
            return false
        });
};
// current email
userEmail();

// Add Course
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
            currentEmail: "",
            courses: [],
            isEditing: providerApp.isEditing
        },
        methods: {
            // fetch and move to courses array
            filterCoursesByEmail: async function () {
                await fetch(`http://localhost:3000/collections/courses/${this.currentEmail}`)
                    .then(res => res.json())
                    .then(results => this.courses = results);
            },
            removeActivity: (index) => {
            },
            editActivity: function (index) {

            },
            save: function (index) {
            }
        }
    })
;
