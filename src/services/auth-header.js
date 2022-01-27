export default function authHeader() {
  let user = JSON.parse(localStorage.getItem("usertoken"));

  if (user) {
    return { "x-access-token": user };
  } else {
    return {};
  }
}
