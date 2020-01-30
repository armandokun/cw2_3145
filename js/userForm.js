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
        logIn: function (e) {
            e.preventDefault();

            const logInForm = {
                "email": this.email,
                "password": this.password,
                "on": this.on,
                "userType": this.userType
            };

            fetch(`http://localhost:3000/collections/users/${logInForm.email}/${logInForm.password}`)
                .then(res => {
                    return res.json()
                })
                .then(() => {

                    // logged in!
                    logInForm.on = true;

                    fetch(`http://localhost:3000/collections/users/${logInForm.email}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(logInForm)
                    })
                        .then(res => {
                            return res.json()
                        })
                        .then(() => {
                            window.location.href = "index.html";
                        });
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
        }
    }
});
