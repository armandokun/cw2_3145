// Current user's email
let userEmail = () => {
    fetch('http://localhost:3000/collections/users/status/true')
        .then(res => res.json())
        .then(value => {
            providerView.currentEmail = (value.email).toLowerCase();
            providerApp.email = (value.email).toLowerCase()
        })
        .catch(err => {
            return false
        });
};
// current email
userEmail();

// Add Course
let providerApp = new Vue({
    el: '#provider-add',
    data: {
        topic: '',
        location: '',
        price: 0,
        about: '',
        email: '',
        isEditing: false
    },
    methods: {
        addClass: function () {

            const courseDetails = {
                topic: this.topic,
                location: this.location,
                price: this.price,
                about: this.about,
                email: this.email,
                rating: [],
                isEditing: this.isEditing
            };

            fetch(`http://localhost:3000/collections/courses`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(courseDetails)
            })
                .then(res => res.json())
                .then(results => {
                    console.log(results);
                    alert("Course has been added!")
                })
                .catch(err => console.log(err));
        }
    }
});

let providerView = new Vue({
    el: '#providerView',
    data: {
        currentEmail: "",
        courses: []
    },
    methods: {
        // fetch and move to courses array
        filterCoursesByEmail: function () {
            fetch(`http://localhost:3000/collections/courses/${this.currentEmail}`)
                .then(res => res.json())
                .then(results => this.courses = results);
        },
        removeCourse: (course) => {

            fetch(`http://localhost:3000/collections/courses/${course._id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(results => {
                    console.log(results);
                    document.getElementById(course._id).remove()
                })
                .catch(err => console.log(err))
        },
        editCourse: function (course) {
            course.isEditing = true;
        },
        saveCourse: function (course) {
            fetch(`http://localhost:3000/collections/courses/put/${course._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(course)
            })
                .then(res => res.json())
                .then(results => console.log(results))
                .catch(err => console.log(err));

            course.isEditing = false;
        }
    }
});
