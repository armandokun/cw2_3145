// Fetch all courses
fetch("http://localhost:3000/collections/courses")
    .then(response => {
        return response.json();
    })
    .then(response => {
        // Define data in searchApp Vue Instance
        searchApp.coursesFromArray = response;
    })
    .catch(error => {
        console.log("Error: ", error);
    });

let searchApp = new Vue({
    el: '#searchFilter',
    data: {
        term: '',
        userTopics: [],
        userPrices: [],
        coursesFromArray: [],
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
                let searchCourse = course.topic.includes(this.term);
                // filter condition
                let filterCourse = this.userTopics.length === 0 ||
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

// main part where the courses are displayed
let resultsFromFilter = new Vue({
    el: '#results',
    data: {
        results: searchApp.results,
        currentEmail: '',
        selectedRating: ''
    },
    mounted() {
        fetch('http://localhost:3000/collections/users/status/true')
            .then(res => res.json())
            .then(value => {
                resultsFromFilter.currentEmail = (value.email).toLowerCase();
            })
            .catch(err => console.log('No one has signed in' + err));
    },
    methods: {
        rate: (courseId, user, rating) => {
            fetch(`http://localhost:3000/collections/courses/update/${courseId}-${user}-${rating}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => res.json())
                .then(value => {
                    console.log(value)
                })
                .catch(err => console.log(err))
        },
        resetRating: (courseId) => {
            fetch(`http://localhost:3000/collections/courses/rating/${courseId}`, {
                method: 'PUT'
            })
                .then(res => res.json())
                .then(value => console.log(value))
                .catch(err => console.log(err))
        }
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



