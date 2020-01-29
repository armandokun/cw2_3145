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
            // check if the email already exists
            let users = [];
            let existingEmail = this.email;
            let existingPassword = this.password;
            if (localStorage.getItem("users")) {
                // 'users' is an array of objects
                users = JSON.parse(localStorage.getItem("users"));
            }
            if (users) {
                if (
                    users.some(function (user) {
                        return user.email === existingEmail && user.password === existingPassword;
                    })
                ) {
                    //takes an index of the user of users array and changes the state value to logged in
                    var index = users.findIndex(obj => obj.email === existingEmail && obj.password === existingPassword);
                    users[index].on = true;
                    localStorage.setItem("users", JSON.stringify(users));

                } else
                    alert("The email or password is incorrect");
            }
        },
        signUp: function () {
            // check if the email already exists
            let newEmail = this.email;
            let users = [];

            fetch(`http://localhost:3000/collections/users/${newEmail}`, {method: 'GET'})
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    // Define data in searchApp Vue Instance
                    if (response.email === this.email) alert('This email is already registered');
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        }
    }
});
