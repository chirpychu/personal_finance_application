import authHeader from "./auth-header";

class UserService {
  getPublicContent() {
    return this.$http.get("/test/all");
  }

  getUserBoard() {
    return this.$http.get("/test/user", { headers: authHeader() });
  }

  getAdminBoard() {
    return this.$http.get("/test/admin", { headers: authHeader() });
  }
}

export default new UserService();
