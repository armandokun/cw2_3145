// User connection
let userForm = new Vue({
    el: "#userForm",
    data: {
        // User type option will be selected by default to prevent not selecting anything
        userType: "user",
        email: "",
        password: "",
        on: Boolean
    },
    methods: {
        logIn: function (e) {
            e.preventDefault();

            fetch(`http://localhost:3000/collections/users/${this.email}/${this.password}`,
                {method: 'PUT'})
                .then(res => res.json())
                .then(val => {
                    console.log(val);
                    if (val.value === null) {
                        alert('The email or password is incorrect')
                    } else {
                        window.location.href = "index.html"
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert('The email or password is incorrect')
                })
        },
        signUp: function (e) {
            e.preventDefault();
            const form = {
                "email": this.email,
                "password": this.password,
                "userType": this.userType,
                "on": false
            };

            // email validation
            fetch(`http://localhost:3000/collections/users/register/${form.email}`)
                .then(res => res.json())
                .then(() => {
                    // inform the user
                    alert('This email is already registered');
                })
                .catch((err) => {
                    console.log(err);

                    // creates an account if the received response is empty
                    fetch('http://localhost:3000/collections/users/',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(form)
                        })
                        .then(res => {
                            if (res.ok) {

                                alert('You have created an account!');

                                // Redirects to log in page
                                window.location.href = "#popup2";

                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
        },
    }
});

//Header Component
Vue.component("page-header", {
    data: () => {
        return {
            email: "",
            userType: ""
        }
    },
    methods: {
        logOut: function () {
            fetch(`http://localhost:3000/collections/users/logout/${this.email}`, {
                method: 'PUT'
            })
                .then(res => {
                    console.log(res.json());
                })
                .then(() => {
                    window.location.href = "index.html";
                });
        },
        addActivity: function () {
            window.location.href = "provider.html"
        }
    },
    mounted() {
        fetch('http://localhost:3000/collections/users/status/true')
            .then(res => res.json())
            .then(value => {
                this.email = (value.email).toLowerCase();
                this.userType = (value.userType).toLowerCase();
            })
            .catch(err => {
                return false
            });
    },
    template: `
    <div class="page-header-template">
    <a href="/index.html"><img src="./img/header-logo.png" alt='Logo in the Header' id="headerLogo"></a>
    <div id='button-left-alignment'>
    <div v-if="email != ''">
    <p>email: </p><p id="userEmail">{{ email }}</p>
    <div v-if="userType === 'provider'">
    <button @click="addActivity">Add Class or Activity</button>
    </div>
    <button @click="logOut">Log Out</button>
    </div>
    <div v-else>
    <a class="button" href="#popup2">Log In</a>
    <a class="button" href="#popup1">Sign Up</a>
    </div>
    </div>
    </div>
    `,
});

//Header Instance for page-header element
let headerApp = new Vue({
    el: "#header-template",
});
