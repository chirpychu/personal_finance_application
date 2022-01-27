class AuthService {
  login(user) {
    return this.$http
      .post("/login", {
        user_email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data) {
          localStorage.setItem("usertoken", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("usertoken");
  }

  register(user) {
    return this.$http.post("/register", {
      user_name: user.username,
      first_name: user.firstname,
      last_name: user.lastname,
      user_email: user.emailaddress,
      password: user.password
    });
  }
}

export default new AuthService();
