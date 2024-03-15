import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Summary from "../views/Summary.vue";
import Review from "../views/Review.vue";
import ReviewDetail from "../components/ReviewDetail.vue";
import login from "../views/Login.vue";
import AddReview from "../components/AddReview.vue";
import EditReview from "../components/EditReview.vue";
import AddSummary from "../components/AddSummary.vue";
import SummaryDetail from "../components/SummaryDetail.vue";
import EditSummary from "../components/EditSummary.vue";
import Report from "../views/Report.vue";
import Mycategory from "../components/Mycategory.vue";
import nopageComponent from '../views/NoPage.vue'
import nopermissionComponent from '../views/NoPermission.vue'
import Myhidden from '../components/Myhidden.vue';
import MyhiddenStaff from '../components/MyhiddenStaff.vue';

const history = createWebHistory("/sy2/");

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/summary",
    name: "Summary",
    component: Summary,
    meta: { requiresAuth: true },
  },
  {
    path: "/review",
    name: "Review",
    component: Review,
    meta: { requiresAuth: true },
  },
  {
    path: "/course-review/:courseid",
    name: "ReviewDetail",
    component: ReviewDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    name: "login",
    component: login,
    meta: { requiresAuth: false },
  },
  {
    path: "/add-review",
    name: "AddReview",
    component: AddReview,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-review/:reviewid",
    name: "EditReview",
    component: EditReview,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-summary",
    name: "AddSummary",
    component: AddSummary,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit-summary/:summaryid",
    name: "EditSummary",
    component: EditSummary,
    meta: { requiresAuth: true },
  },
  {
    path: "/course-summary/:courseid",
    name: "SummaryDetail",
    component: SummaryDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-category",
    name: "Mycategory",
    component: Mycategory,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-hidden",
    name: "Myhidden",
    component: Myhidden,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-hidden-staff",
    name: "MyhiddenStaff",
    component: MyhiddenStaff,
    meta: { requiresAuth: true },
  },
  {
    path: "/:catchAll(.*)",
    name: "catchAll",
    component: nopageComponent 
  },
  {
    path: "/no-permission",
    name: "nopermission",
    component: nopermissionComponent 
  }
];

const router = createRouter({ history, routes });

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const userRole = localStorage.getItem("role");

  if (to.path === "/" && isAuthenticated) {
    next({ name: from.name || "Home" });
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "login" });
    } else {
      if (
        (userRole === "staff_group" && restrictedRoutesForAdmin.includes(to.name)) ||
        (userRole === "st_group" && restrictedRoutesForStudent.includes(to.name))
      ) {
        next({ name: "nopermission" });
      } else {
        next();
      }
    }

  } else if (to.path !== "/" && !isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
});

const restrictedRoutesForAdmin = [
  "Mycategory",
  "AddReview",
  "AddSummary",
  "EditReview",
  "EditSummary"
];
const restrictedRoutesForStudent = ["Report"];

export default router;
