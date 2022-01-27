import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import RegisterUser from "../views/Register.vue";
import Setting from "../views/Settings.vue";
import AddCashView from "../views/AddCashView.vue";
import Dashboard from "../views/Dashboard.vue";
import AdminPortal from "../views/Admin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: RegisterUser
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/settings",
    name: "setting",
    component: Setting,
    meta: { requiresAuth: true }
  },
  {
    path: "/addCash",
    name: "Addcashview",
    component: AddCashView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPortal,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("user");
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next("/");
  }
  next();
});

export default router;
