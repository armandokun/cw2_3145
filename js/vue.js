
//array for training
var courses = [
  { topic: "math", location: "hendon", price: 100 },
  { topic: "math", location: "colindale", price: 80 },
  { topic: "math", location: "brent cross", price: 90 },
  { topic: "math", location: "golders green", price: 120 },
  { topic: "english", location: "hendon", price: 110 },
  { topic: "english", location: "colindale", price: 90 },
  { topic: "english", location: "brent cross", price: 90 },
  { topic: "english", location: "golders green", price: 130 },
  { topic: "piano", location: "hendon", price: 120 },
  { topic: "piano", location: "golders green", price: 140 },
  { topic: "sports club", location: "golders green", price: 200 }
];

//creates localStorage version of the courses array
if (!localStorage.getItem("courses")) { localStorage.setItem("courses", JSON.stringify(courses)) } else {
  courses = JSON.parse(localStorage.getItem("courses"))
};

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
          return;
        }
      }
    },
    addActivity: function () {
      if (this.userInfo.type === "provider") window.location.href = "/provider.html";
    }
  },
  computed: {
    isOn: function () {
      users = JSON.parse(localStorage.getItem("users"))
      if (users) {
        if (users.some(function (user) { return user.on === true })) { return true; }
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
var headerApp = new Vue({
  el: "#header-template"
});

//Filter Instance
var filterApp = new Vue({
  el: "#filter",
  data: {
    courses: courses,
    selectedTopic: [],
    selectedPrice: []
  },
  computed: {
    topics: function () {
      return courses.filter(course => {

        // Search condition
        let searchTerm = course.topic.includes(courseApp.search);

        // Filter condition
      let filteredCourse = this.selectedTopic.length == 0 ||
      this.selectedTopic.includes(course.location);

      return searchTerm && filteredCourse;
      })
    },
    prices: function () {
      return [...new Set(this.courses.map(x => x.price))];
    }
  }
});

//Course Instance
var courseApp = new Vue({
  el: "#course-loop",
  data: {
    courses: courses,
    search: '',
    selected: 'A - Z'
  },
  methods: {
    reset: function () {
      filterApp.selectedTopic = [];
      filterApp.selectedPrice = [];
      this.search = '';
      this.selected = 'A - Z'
    }
  },
  computed: {
    //filters when clicked on the filter
    filteredCourses: function () {
      var topics = filterApp.selectedTopic,
        prices = filterApp.selectedPrice.map(Number);
      return this.courses.filter(function (course) {
        var topicMatch = false,
          priceMatch = false;
        if (topics.length > 0) {
          if (topics.includes(course.topic)) {
            topicMatch = true;
          }
        } else {
          topicMatch = true;
        }
        if (prices.length > 0) {
          if (prices.includes(course.price)) {
            priceMatch = true;
          }
        } else {
          priceMatch = true;
        }
        return topicMatch && priceMatch;
      });
    },
    //filters when searching for a topic
    filteredList: function () {
      return this.filteredCourses.filter(course => {
        return course.topic.toLowerCase().includes(this.search.toLowerCase())
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

      ascOrder = this.filteredList.sort(asc);

      // low-high price order
      function lhp(c, d) {
        if (c.price < d.price)
          return -1;
        if (c.price > d.price)
          return 1;
        return 0;
      }

      switch (this.selected) {
        case 'Z - A': return ascOrder.reverse();
        case 'Low - High': return this.filteredList.sort(lhp);
        case 'High - Low': return this.filteredList.sort(lhp).reverse();
        default: return ascOrder;
      }
    }
  }
});