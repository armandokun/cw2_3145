// User connection
var userForm = new Vue({
    el: "#userForm",
    data: {

        // User option will be selected by default to prevent not selecting anything
        userType: "user",
        email: "",
        password: "",
        on: Boolean
    },
    methods: {
        logIn: function () {
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
            fetch(`http://localhost:3000/collections/users/${form.email}`)
                .then(res => {
                    return res.json();
                })
                .then(() => {
                    // inform the user
                    alert('This email is already registered');
                })
                .catch((err) => {
                    console.log(err);

                    // creates an account
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
        }
    }
});
