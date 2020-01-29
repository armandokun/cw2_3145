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
if (!localStorage.getItem("courses")) {
    localStorage.setItem("courses", JSON.stringify(courses))
} else {
    courses = JSON.parse(localStorage.getItem("courses"))
}
//Header Component
Vue.component("page-header", {
    template: `
    <div class="page-header-template">
    <a href="/index.html"><img src="./img/header-logo.png" alt='Logo in the Header' id="headerLogo"></a>
    <div id='button-left-alignment'>
    <div v-if=!isOn>
    <a class="button" href="#popup2">Log In</a>
    <a class="button" href="#popup1">Sign Up</a>
    </div>
    <div v-else>
    <p>email: </p><p id="userEmail">{{ userInfo.email }}</p>
    <div v-if="userInfo.type === 'provider' && pathUrl == '/index.html'">
    <button @click="addActivity">Add Class or Activity</button>
    </div>
    <button @click="logOut">Log Out</button>
    </div>
    </div>
    </div>
    `,
    methods: {
        logOut: function () {
            users = JSON.parse(localStorage.getItem("users"));
            if (users) {
                if (
                    users.some(function (user) {
                        return user.on === true;
                    })
                ) {
                    //takes an index of the user of users array and changes the state value to logged in
                    var index = users.findIndex(obj => obj.on === true);
                    users[index].on = false;
                    localStorage.setItem("users", JSON.stringify(users));
                    window.location.href = "/index.html";

                }
            }
        },
        addActivity: function () {
            if (this.userInfo.type === "provider") window.location.href = "/provider.html";
        }
    },
    computed: {
        isOn: function () {
            users = JSON.parse(localStorage.getItem("users"));
            if (users) {
                if (users.some(function (user) {
                    return user.on === true
                })) {
                    return true;
                }
            } else
                return false;
        },
        userInfo: function () {
            users = JSON.parse(localStorage.getItem("users"));
            var index = users.findIndex(obj => obj.on === true);
            return users[index];
        },
        pathUrl: function () {
            return window.location.pathname;
        }
    }
});

//Header Instance for page-header element
let headerApp = new Vue({
    el: "#header-template"
});

let searchApp = new Vue({
    el: '#searchFilter',
    data: {
        term: '',
        userTopics: [],
        userPrices: [],
        coursesFromArray: courses,
        selected: 'A - Z'
    },
    methods: {
        reset: function () {
            this.userTopics = [];
            this.userPrices = [];
            this.selected = 'A - Z';
            this.term = '';

            resultsFromFilter.results = this.results;
        }
    },
    computed: {
        topics: function () {
            // update option list
            return [...new Set(this.results.map(x => x.topic))]
        },
        prices: function () {
            return [...new Set(this.results.map(x => x.price))]
        },
        results: function () {
            return this.coursesFromArray.filter(course => {
                // search condition
                var searchCourse = course.topic.includes(this.term);
                // filter condition
                var filterCourse = this.userTopics.length === 0 ||
                    this.userTopics.includes(course.topic) ||
                    this.userPrices.length === 0 ||
                    this.userPrices.includes(course.price);
                // combine the result
                return searchCourse && filterCourse;
            })
        },

        //sorts through the search and filter that are above
        sortedArray: function () {
            //ascending order
            function asc(a, b) {
                if (a.topic < b.topic)
                    return -1;
                if (a.topic > b.topic)
                    return 1;
                return 0;
            }

            let ascOrder = resultsFromFilter.results.sort(asc);

            // low-high price order
            function lhp(c, d) {
                if (c.price < d.price)
                    return -1;
                if (c.price > d.price)
                    return 1;
                return 0;
            }

            switch (this.selected) {
                case 'Z - A':
                    return ascOrder.reverse();
                case 'Low - High':
                    return this.results.sort(lhp);
                case 'High - Low':
                    return this.results.sort(lhp).reverse();
                default:
                    return ascOrder;
            }
        }
    }
});

let resultsFromFilter = new Vue({
    el: '#results',
    data: {
        results: searchApp.results
    }
});

// Refreshes resultsFromFilter after sorting initiated
searchApp.$watch('sortedArray', (val) => {
    resultsFromFilter.results = val;
});

// Refreshes resultsFromFilter after filter and search are initiated
searchApp.$watch('results', (val) => {
    resultsFromFilter.results = val;
});


//lab12 info
const displayCourses = new Vue({
    el: "#displayCourses",
    data: {
        courses: []
    }
});

const displayUser = new Vue({
    el: "#displayUser",
    data: {
        user: ''
    }
});

fetch("http://localhost:3000/collections/users/", {method: 'GET'})
    .then(response => {
        return response.json();
    })
    .then(response => {
        // Define data in displayCourses Vue Instance
        displayUser.user = response;
    })
    .catch(error => {
        console.log("Error: ", error);
    });

// const fetchPromiseUser = fetch("http://localhost:3000/users/", {mode: 'no-cors'});
//
// fetchPromiseUser
//     .then(response => {
//         return response.json();
//     })
//     .then(response => {
//         // Define data in displayUser Vue Instance
//         displayUser.user = response;
//     })
//     .catch(error => {
//         console.log("Error: ", error);
//     });


