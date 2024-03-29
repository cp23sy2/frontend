<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};

const isActivePrefix = (prefix) => {
  return route.path.startsWith(prefix) && Object.keys(route.params).length > 0;
};

const dropdown = ref(false);
const reviews = ref([]);
const summaries = ref([]);

const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

function toggleDropdown() {
  dropdown.value = !dropdown.value;
}

const notifications = ref([]);
const counthidden = ref();
const showBadge = ref(false);
const showPopup = ref(false);
const newNotificationText = ref("");
const badgeCount = ref(0);

let readSummaryNotifications =
  JSON.parse(localStorage.getItem("readSummaryNotifications")) || {};
let readReviewNotifications =
  JSON.parse(localStorage.getItem("readReviewNotifications")) || {};
const emailNotifications = { summary: [], review: [] };

const handleNotificationClick = () => {
  showPopup.value = !showPopup.value;
  showBadge.value = false;
  badgeCount.value = 0; // Reset badge count when notifications are clicked

  notifications.value.forEach((notification) => {
    if (
      notification.type === "summary" &&
      !readSummaryNotifications[notification.id]
    ) {
      readSummaryNotifications[notification.id] = true;
    }
    if (
      notification.type === "review" &&
      !readReviewNotifications[notification.id]
    ) {
      readReviewNotifications[notification.id] = true;
    }
  });

  localStorage.setItem(
    "readSummaryNotifications",
    JSON.stringify(readSummaryNotifications)
  );
  localStorage.setItem(
    "readReviewNotifications",
    JSON.stringify(readReviewNotifications)
  );
  localStorage.setItem("notifications", JSON.stringify(notifications.value));
};

const processNotifications = (allNotifications) => {
  notifications.value = allNotifications;
  counthidden.value = allNotifications.length;

  updateBadgeState();
};

const updateBadgeState = () => {
  let hasNewSummaryNotification = false;
  let newSummaryNotificationCount = 0;
  let hasNewReviewNotification = false;
  let newReviewNotificationCount = 0;

  // Check new notifications from summary
  const newNotificationsSummary = emailNotifications.summary.filter(
    (notification) => !readSummaryNotifications[notification.id]
  );
  if (newNotificationsSummary.length > 0) {
    hasNewSummaryNotification = true;
    newSummaryNotificationCount += newNotificationsSummary.length;
  }

  // Check new notifications from review
  const newNotificationsReview = emailNotifications.review.filter(
    (notification) => !readReviewNotifications[notification.id]
  );
  if (newNotificationsReview.length > 0) {
    hasNewReviewNotification = true;
    newReviewNotificationCount += newNotificationsReview.length;
  }

  // Update badge state
  showBadge.value = hasNewSummaryNotification || hasNewReviewNotification;
  badgeCount.value = newSummaryNotificationCount + newReviewNotificationCount;
};

const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const [summaryResponse, reviewResponse] = await Promise.all([
      fetch(`${import.meta.env.VITE_BASE_URL}summary/hidden`, requestOptions),
      fetch(`${import.meta.env.VITE_BASE_URL}review/hidden`, requestOptions),
    ]);

    const [summaryData, reviewData] = await Promise.all([
      summaryResponse.json(),
      reviewResponse.json(),
    ]);

    // Separate notifications by type (summary or review)
    emailNotifications.summary = filterSummaryNotifications(summaryData);
    emailNotifications.review = filterReviewNotifications(reviewData);

    // Merge all notifications for processing
    const allNotifications = [
      ...emailNotifications.summary.map((notification) => ({
        ...notification,
        type: "summary",
      })),
      ...emailNotifications.review.map((notification) => ({
        ...notification,
        type: "review",
      })),
    ];

    // Process notifications and update badge state
    processNotifications(allNotifications);
  } catch (error) {
    console.error("An error occurred while fetching notifications:", error);
  }
};

const filterSummaryNotifications = (summaryData) => {
  return summaryData.filter((notification) => notification.title);
};

const filterReviewNotifications = (reviewData) => {
  return reviewData.filter((notification) => notification.gradesReceived);
};

onMounted(() => {
  getreportsummary();
  getreportreview();
  fetchNotifications();
});

const getreportsummary = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}summary/report`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // เช็คค่า hide และกรองข้อมูลตามเงื่อนไข
      summaries.value = data.filter((summary) => !summary.hide);
    } else if (response.status === 401) {
      signout();
    } else {
      console.error("Get Report Summary failed");
    }
  } catch (error) {
    console.error("Error fetching summary data");
  }
};

const getreportreview = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}review/report`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // reviews.value = data;
      reviews.value = data.filter((review) => !review.hide);
    } else if (response.status === 401) {
      signout();
    } else {
      console.error("Get Report Review failed");
    }
  } catch (error) {
    console.error("Error fetching review data");
  }
};

const signout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  localStorage.removeItem("token");

  Login();
};

const appRouter = useRouter();
const Login = () => appRouter.push({ name: "login" });

const Mycategory = () => {
  toggleDropdown();
  appRouter.push({ name: "Mycategory" });
};

const Myhidden = () => {
  toggleDropdown();
  appRouter.push({ name: "Myhidden" });
};

const Myhiddens = () => {
  // toggleDropdown();
  showPopup.value = !showPopup.value;
  appRouter.push({ name: "Myhidden" });
};

const MyhiddenStaff = () => {
  // toggleDropdown();
  showPopup.value = !showPopup.value;
  appRouter.push({ name: "MyhiddenStaff" });
};
</script>

<template>
  <section class="navbar">
    <div class="logo">
      <router-link
        :to="{ name: 'Home' }"
        style="text-decoration: none; color: inherit"
        ><img src="../assets/logo.jpg" style="width: 186px; height: 46px"
      /></router-link>
      <!-- <img src="../assets/logo.jpg" style="width: 186px; height: 46px" /> -->
    </div>

    <ul>
      <li :class="{ active: isActive('/home') }">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20.5"
          height="21.505"
          viewBox="0 0 20.5 21.505"
          :class="{ active_icon: isActive('/home') }"
        >
          <g
            id="Iconly_Light-Outline_Home"
            data-name="Iconly/Light-Outline/Home"
            transform="translate(-2 -1)"
          >
            <g id="Home" transform="translate(2 1)">
              <path
                id="Fill-1"
                d="M11.717,14.291A2.179,2.179,0,0,1,13.9,16.46v3.076a.472.472,0,0,0,.47.469h1.906A2.709,2.709,0,0,0,19,17.317V8.593a1.676,1.676,0,0,0-.667-1.309L11.74,2.026a2.416,2.416,0,0,0-3.011,0L2.181,7.282A1.675,1.675,0,0,0,1.5,8.61v8.707a2.709,2.709,0,0,0,2.723,2.688H6.147a.486.486,0,0,0,.491-.479.807.807,0,0,1,.019-.171v-2.9a2.182,2.182,0,0,1,2.169-2.169Zm4.56,7.214H14.353A1.968,1.968,0,0,1,12.4,19.536V16.46a.677.677,0,0,0-.684-.669H8.831a.677.677,0,0,0-.674.669v3.066a.726.726,0,0,1-.031.215,1.989,1.989,0,0,1-1.979,1.764H4.223A4.21,4.21,0,0,1,0,17.317V8.6A3.154,3.154,0,0,1,1.259,6.1L7.794.855a3.912,3.912,0,0,1,4.88,0L19.256,6.1A3.158,3.158,0,0,1,20.5,8.582v8.735a4.21,4.21,0,0,1-4.223,4.188Z"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>

        <span>
          <router-link
            :to="{ name: 'Home' }"
            style="text-decoration: none; color: inherit"
            >Home</router-link
          >
        </span>
      </li>

      <li
        :class="{
          active:
            isActive('/summary') ||
            isActive('/add-summary') ||
            isActivePrefix('/course-summary') ||
            isActivePrefix('/edit-summary'),
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20.697"
          height="20.669"
          viewBox="0 0 20.697 20.669"
          :class="{
            active_icon:
              isActive('/summary') ||
              isActive('/add-summary') ||
              isActivePrefix('/course-summary') ||
              isActivePrefix('/edit-summary'),
          }"
        >
          <g
            id="Iconly_Light-Outline_Folder"
            data-name="Iconly/Light-Outline/Folder"
            transform="translate(-2 -2)"
          >
            <g id="Folder" transform="translate(2 2)">
              <path
                id="Combined-Shape"
                d="M7.643,0a3.046,3.046,0,0,1,2.425,1.214l.911,1.212a1.548,1.548,0,0,0,1.228.614h2.829C18.9,3.04,20.7,5.019,20.7,9.268l-.028,4.967c0,3.968-2.467,6.434-6.437,6.434H6.45C2.472,20.669,0,18.2,0,14.232v-7.8C0,2.164,1.9,0,5.643,0Zm0,1.5h-2C2.739,1.5,1.5,2.976,1.5,6.433v7.8c0,3.184,1.758,4.937,4.95,4.937h7.782c3.184,0,4.937-1.753,4.937-4.937v0L19.2,9.264c0-3.4-1.166-4.724-4.161-4.724h-2.83A3.053,3.053,0,0,1,9.781,3.328L8.868,2.114A1.539,1.539,0,0,0,7.642,1.5Zm7.074,10.713a.75.75,0,0,1,0,1.5H5.981a.75.75,0,0,1,0-1.5Z"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>

        <span>
          <router-link
            :to="{ name: 'Summary' }"
            style="text-decoration: none; color: inherit"
            >Summary</router-link
          >
        </span>
      </li>

      <li
        :class="{
          active:
            isActive('/review') ||
            isActive('/add-review') ||
            isActivePrefix('/course-review') ||
            isActivePrefix('/edit-review'),
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18.165"
          height="19.91"
          viewBox="0 0 18.165 19.91"
          :class="{
            active_icon:
              isActive('/review') ||
              isActive('/add-review') ||
              isActivePrefix('/course-review') ||
              isActivePrefix('/edit-review'),
          }"
        >
          <g
            id="Iconly_Light-Outline_Document"
            data-name="Iconly/Light-Outline/Document"
            transform="translate(-3 -2)"
          >
            <g id="Document" transform="translate(3 2)">
              <path
                id="Combined-Shape"
                d="M12.909,0a5.024,5.024,0,0,1,5.256,5.357v9.2a4.974,4.974,0,0,1-5.215,5.354l-7.693,0A5.025,5.025,0,0,1,0,14.553v-9.2A4.972,4.972,0,0,1,5.215,0l7.693,0Zm0,1.5L5.22,1.5A3.494,3.494,0,0,0,1.5,5.357v9.2A3.5,3.5,0,0,0,5.256,18.41l7.689,0a3.5,3.5,0,0,0,3.72-3.854v-9.2A3.5,3.5,0,0,0,12.909,1.5Zm-.193,11.974a.75.75,0,0,1,0,1.5H5.5a.75.75,0,1,1,0-1.5Zm0-4.186a.75.75,0,1,1,0,1.5H5.5a.75.75,0,0,1,0-1.5ZM8.25,5.11a.75.75,0,0,1,0,1.5H5.5a.75.75,0,0,1,0-1.5Z"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>
        <span>
          <router-link
            :to="{ name: 'Review' }"
            style="text-decoration: none; color: inherit"
            >Review</router-link
          >
        </span>
      </li>

      <!-- report -->
      <li
        :class="{ active: isActive('/report') }"
        v-if="role === 'staff_group'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20.014"
          height="18.186"
          viewBox="0 0 20.014 18.186"
          :class="{ active_icon: isActive('/report') }"
        >
          <g
            id="Iconly_Light-Outline_Danger-Triangle"
            data-name="Iconly/Light-Outline/Danger-Triangle"
            transform="translate(-2 -3)"
          >
            <g id="Group-8" transform="translate(2 3)">
              <path
                id="Combined-Shape"
                d="M10.014,0a2.779,2.779,0,0,1,2.439,1.415l7.186,12.564a2.812,2.812,0,0,1-2.44,4.207H2.816A2.812,2.812,0,0,1,.375,13.979l7.2-12.566A2.777,2.777,0,0,1,10.013,0Zm0,1.5a1.3,1.3,0,0,0-1.138.659l-7.2,12.565a1.312,1.312,0,0,0,1.139,1.962H17.2a1.311,1.311,0,0,0,1.137-1.962L11.151,2.159A1.3,1.3,0,0,0,10.013,1.5Zm-.007,11a1,1,0,1,1-.01,0Zm0-5.935a.75.75,0,0,1,.75.75v3.1a.75.75,0,0,1-1.5,0v-3.1A.75.75,0,0,1,10,6.564Z"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>

        <span>
          <router-link
            :to="{ name: 'Report' }"
            style="text-decoration: none; color: inherit; display: flex"
            >Report
            <svg
              v-if="summaries.length > 0 || reviews.length > 0"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              style="margin: 0; margin-left: 10px;"
            >
              <g
                id="Iconly_Bold_Info-Circle"
                data-name="Iconly/Bold/Info-Circle"
                transform="translate(-2 -1.999)"
              >
                <g id="Info-Circle" transform="translate(2 1.999)">
                  <path
                    id="Path_199"
                    data-name="Path 199"
                    d="M10,0A10,10,0,1,1,0,10,10,10,0,0,1,10,0Zm0,12.931a.871.871,0,0,0-.87.87.875.875,0,1,0,.87-.87Zm0-7.6a.888.888,0,0,0-.88.88h0v4.42a.875.875,0,0,0,1.75,0h0V6.21A.88.88,0,0,0,10,5.33Z"
                    fill="#c61d1e"
                  />
                </g>
              </g>
            </svg></router-link>
        </span>
      </li>

      <!-- hidden -->
      <li
        :class="{ active: isActive('/my-hidden') }"
        v-if="role === 'staff_group'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20.014"
          height="18.186"
          viewBox="0 0 20.014 18.186"
          :class="{ active_icon: isActive('/my-hidden') }"
        >
          <g
            id="Iconly_Light-Outline_Hide"
            data-name="Iconly/Light-Outline/Hide"
            transform="translate(-2 -3)"
          >
            <g id="Hide" transform="translate(2 3)">
              <path
                id="Combined-Shape"
                d="M18.417.22a.75.75,0,0,1,0,1.061L2.643,17.054a.75.75,0,0,1-1.06-1.06l1.972-1.971A14.751,14.751,0,0,1,.062,8.934a.745.745,0,0,1,0-.593A14.415,14.415,0,0,1,4.22,2.683a9.117,9.117,0,0,1,11.048-.375L17.357.22A.749.749,0,0,1,18.417.22Zm-.37,4.821a16.144,16.144,0,0,1,1.891,3.3.742.742,0,0,1,0,.6c-2.1,4.857-5.811,7.756-9.938,7.756a8.771,8.771,0,0,1-2.769-.451.75.75,0,1,1,.474-1.424,7.245,7.245,0,0,0,2.3.375c3.428,0,6.561-2.442,8.43-6.553a14.5,14.5,0,0,0-1.581-2.694.75.75,0,1,1,1.2-.9Zm-12.9-1.18A12.736,12.736,0,0,0,1.571,8.639a13.022,13.022,0,0,0,3.047,4.322l2.138-2.138a3.87,3.87,0,0,1-.669-2.185,3.912,3.912,0,0,1,6.1-3.248l2-2A7.586,7.586,0,0,0,5.149,3.861Zm8.088,4.6a.75.75,0,0,1,.606.871A3.919,3.919,0,0,1,10.7,12.48a.778.778,0,0,1-.135.012A.75.75,0,0,1,10.434,11a2.409,2.409,0,0,0,1.932-1.937A.754.754,0,0,1,13.238,8.462ZM10,6.222A2.418,2.418,0,0,0,7.586,8.639,2.389,2.389,0,0,0,7.848,9.73l3.246-3.246A2.413,2.413,0,0,0,10,6.222Z"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>

        <span>
          <router-link
            :to="{ name: 'Myhidden' }"
            style="text-decoration: none; color: inherit"
            >Hidden</router-link
          >
        </span>
      </li>
    </ul>

    <!-- <div class="flex inline-center float-right">
      <span
        class="inline-flex items-center w-10 h-6 mt-4 justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
        >9</span
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="32.995"
        viewBox="0 0 30 32.995"
      >
        <g
          id="Icon_feather-bell"
          data-name="Icon feather-bell"
          transform="translate(-3 -1.5)"
        >
          <path
            id="Path_197"
            data-name="Path 197"
            d="M27,12A9,9,0,1,0,9,12C9,22.5,4.5,25.5,4.5,25.5h27S27,22.5,27,12"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
          <path
            id="Path_198"
            data-name="Path 198"
            d="M20.595,31.5a3,3,0,0,1-5.19,0"
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
          />
        </g>
      </svg>
    </div> -->

    <div class="dropdown">
      <div
        @click="handleNotificationClick"
        class="bell"
        v-if="role === 'st_group'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="32.995"
          viewBox="0 0 30 32.995"
          class="flex inline-center"
        >
          <g
            id="Icon_feather-bell"
            data-name="Icon feather-bell"
            transform="translate(-3 -1.5)"
          >
            <path
              id="Path_197"
              data-name="Path 197"
              d="M27,12A9,9,0,1,0,9,12C9,22.5,4.5,25.5,4.5,25.5h27S27,22.5,27,12"
              fill="none"
              stroke="#4A5568"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            />
            <path
              id="Path_198"
              data-name="Path 198"
              d="M20.595,31.5a3,3,0,0,1-5.19,0"
              fill="none"
              stroke="#4A5568"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            />
          </g>
        </svg>

        <span v-if="showBadge" class="badge" v-show="badgeCount > 0">{{
          badgeCount
        }}</span>
        <span v-if="showBadge" class="badge" v-show="badgeCount > 9">9+</span>
      </div>

      <img
        src="../assets/admin.png"
        id="profile"
        v-if="role === 'staff_group'"
      />

      <img
        src="../assets/student.png"
        id="profile"
        v-if="role === 'st_group'"
      />
      <div
        class="backdrop"
        @click="toggleDropdown"
        :class="{ 'active-backdrop': dropdown }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14.004"
          height="8.007"
          viewBox="0 0 14.004 8.007"
        >
          <g
            id="_15"
            data-name="15"
            transform="translate(19 -7.994) rotate(90)"
          >
            <path
              id="Path_1"
              data-name="Path 1"
              d="M9,19a1,1,0,0,1-.71-1.71L13.59,12,8.29,6.71A1,1,0,1,1,9.71,5.29l6,6a1,1,0,0,1,0,1.41l-6,6A1,1,0,0,1,9,19Z"
            />
          </g>
        </svg>
      </div>
    </div>
  </section>

  <div
    v-if="showPopup"
    class="notification-popup mt-2 pb-1 right-44 z-40 rounded-lg divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
  >
    <template v-if="notifications.length > 0">
      <p class="ml-4 mt-4 mb-6 text-gray-700 text-md font-medium">
        Notifications
      </p>
      <div class="line-noti-popup"></div>
      <a
        class="noti_block text-gray-700 text-sm font-light"
        v-for="(notification, index) in notifications"
        :key="index"
        @click="Myhiddens"
      >
        <!-- ตรวจสอบว่าประเภทของแจ้งเตือนเป็น 'summary' หรือไม่ -->
        <template v-if="notification.title && notification.hide">
          <span>
            โพสต์สรุปรายวิชา {{ notification.courseName }}
            {{ notification.courseFullName }}<br />
            วันที่
            {{
              moment(notification.fileCreatedOn)
                .locale("th")
                .format("DD MMMM YYYY เวลา HH:mm น.")
            }}
            <!-- {{
              moment(notification.fileCreatedOn).diff(moment(), "days") > -7
                ? moment(notification.fileCreatedOn).locale("th").fromNow()
                : moment(notification.fileCreatedOn)
                    .locale("th")
                    .format("DD MMMM YYYY")
            }} -->
            <br />ของคุณถูกซ่อน
          </span>
        </template>
        <!-- ตรวจสอบว่าประเภทของแจ้งเตือนเป็น 'review' หรือไม่ -->
        <template v-if="notification.gradesReceived && notification.hide">
          <span>
            โพสต์รีวิวรายวิชา {{ notification.courseName }}
            {{ notification.courseFullName }}<br />วันที่
            {{
              moment(notification.reviewCreatedOn)
                .locale("th")
                .format("DD MMMM YYYY เวลา HH:mm น.")
            }}
            <br />ของคุณถูกซ่อน
          </span>
        </template>
      </a>
    </template>
    <template v-else>
      <div class="flex justify-center items-center h-full">
        <span class="No-notifications"> No notifications </span>
      </div>
    </template>
  </div>

  <div
    class="absolute right-14 z-40 mt-2 rounded-lg divide-y divide-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    v-if="dropdown"
  >
    <div class="py-1" role="none">
      <a
        class="text-gray-700 block px-5 py-3 text-sm font-light flex items-center"
        ><svg
          style="margin-right: 13px; width: 18px"
          xmlns="http://www.w3.org/2000/svg"
          width="15.84"
          height="19.87"
          viewBox="0 0 15.84 19.87"
        >
          <g
            id="Iconly_Light-Outline_Profile"
            data-name="Iconly/Light-Outline/Profile"
            transform="translate(-4 -2)"
          >
            <g id="Profile" transform="translate(4 2)">
              <path
                id="Combined-Shape"
                d="M15.84,16.193c0,3.3-4.52,3.677-7.919,3.677H7.678C5.512,19.865,0,19.728,0,16.173c0-3.229,4.338-3.66,7.711-3.677h.453C10.33,12.5,15.84,12.638,15.84,16.193ZM7.921,14C3.66,14,1.5,14.728,1.5,16.173s2.16,2.2,6.421,2.2,6.419-.732,6.419-2.177S12.181,14,7.921,14Zm0-14a5.31,5.31,0,0,1,0,10.619H7.889A5.31,5.31,0,0,1,7.921,0Zm0,1.428a3.882,3.882,0,0,0-.029,7.764l.029.714V9.192a3.882,3.882,0,0,0,0-7.764Z"
                fill-rule="evenodd"
                fill="#4A5568"
              />
            </g>
          </g>
        </svg>
        {{ username }}

        <div class="role">
          {{
            role === "st_group"
              ? "Student"
              : role === "staff_group"
              ? "Admin"
              : ""
          }}
        </div>
      </a>
      <a
        class="text-gray-700 block px-6 py-3 text-sm font-light flex items-center"
        ><svg
          style="margin-right: 14px; margin-left: -5px; width: 18px"
          xmlns="http://www.w3.org/2000/svg"
          width="21.5"
          height="19.5"
          viewBox="0 0 21.5 19.5"
        >
          <g
            id="Iconly_Light-Outline_Message"
            data-name="Iconly/Light-Outline/Message"
            transform="translate(-1 -2)"
          >
            <g id="Message" transform="translate(1 1)">
              <path
                id="Combined-Shape"
                d="M15.659,1C18.989,1,21.5,3.717,21.5,7.32v6.868a6.541,6.541,0,0,1-1.837,4.692,5.529,5.529,0,0,1-3.988,1.62H5.822a5.524,5.524,0,0,1-3.985-1.62A6.541,6.541,0,0,1,0,14.188V7.32C0,3.717,2.511,1,5.841,1Zm0,1.5H5.841C3.326,2.5,1.5,4.527,1.5,7.32v6.868a5.053,5.053,0,0,0,1.4,3.629A4.05,4.05,0,0,0,5.825,19h9.834s.01,0,.016,0A4.049,4.049,0,0,0,18.6,17.817,5.049,5.049,0,0,0,20,14.188V7.32C20,4.527,18.174,2.5,15.659,2.5Zm1.576,4.629a.751.751,0,0,1-.109,1.055L12.682,11.8a3.042,3.042,0,0,1-3.8.006L4.4,8.186a.75.75,0,1,1,.941-1.168L9.82,10.63a1.544,1.544,0,0,0,1.923,0L16.179,7.02A.749.749,0,0,1,17.235,7.129Z"
                fill-rule="evenodd"
                fill="#4A5568"
              />
            </g>
          </g>
        </svg>
        {{ email }}</a
      >
      <a
        href="#"
        class="text-gray-700 block px-5 py-3 text-sm font-light flex items-center hover:bg-gray-100 dark hover:dark:bg-gray-200 rounded-lg"
        @click="Mycategory"
        v-if="role === 'st_group'"
      >
        <svg
          style="margin-right: 13px; width: 18px"
          xmlns="http://www.w3.org/2000/svg"
          width="20.473"
          height="19.501"
          viewBox="0 0 20.473 19.501"
          class="mr-2"
        >
          <g
            id="Iconly_Light-Outline_Heart"
            data-name="Iconly/Light-Outline/Heart"
            transform="translate(-2 -3)"
          >
            <g id="Heart" transform="translate(2 3)">
              <path
                id="Combined-Shape"
                d="M10.235,1.039A6.891,6.891,0,0,1,15.887.325c4.059,1.309,5.319,5.734,4.192,9.255-1.739,5.53-9.166,9.655-9.481,9.828a.748.748,0,0,1-.719,0C9.566,19.239,2.193,15.175.4,9.581a0,0,0,0,1,0,0C-.733,6.058.523,1.632,4.578.325A6.729,6.729,0,0,1,10.235,1.039Zm-5.2.714C1.757,2.811.933,6.34,1.824,9.123c1.4,4.362,6.941,7.889,8.413,8.762,1.477-.882,7.056-4.448,8.413-8.758.891-2.786.064-6.315-3.222-7.374a5.289,5.289,0,0,0-4.731.792.75.75,0,0,1-.91.006A5.234,5.234,0,0,0,5.038,1.753Zm9.43,1.986A3.525,3.525,0,0,1,16.9,6.814a.75.75,0,0,1-.687.808c-.021,0-.041,0-.062,0a.75.75,0,0,1-.747-.689,2.024,2.024,0,0,0-1.4-1.769.75.75,0,1,1,.46-1.428Z"
                fill-rule="evenodd"
                fill="#4A5568"
              />
            </g>
          </g>
        </svg>

        My Post</a
      >

      <a
        href="#"
        class="text-gray-700 block px-5 py-3 text-sm font-light flex items-center hover:bg-gray-100 dark hover:dark:bg-gray-200 rounded-lg"
        @click="Myhidden"
        v-if="role === 'st_group'"
      >
        <svg
          style="margin-right: 13px; width: 18px"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="17.273"
          viewBox="0 0 20 17.273"
        >
          <g
            id="Iconly_Light-Outline_Hide"
            data-name="Iconly/Light-Outline/Hide"
            transform="translate(-2 -3)"
          >
            <g id="Hide" transform="translate(2 3)">
              <path
                id="Combined-Shape"
                d="M18.417.22a.75.75,0,0,1,0,1.061L2.643,17.054a.75.75,0,0,1-1.06-1.06l1.972-1.971A14.751,14.751,0,0,1,.062,8.934a.745.745,0,0,1,0-.593A14.415,14.415,0,0,1,4.22,2.683a9.117,9.117,0,0,1,11.048-.375L17.357.22A.749.749,0,0,1,18.417.22Zm-.37,4.821a16.144,16.144,0,0,1,1.891,3.3.742.742,0,0,1,0,.6c-2.1,4.857-5.811,7.756-9.938,7.756a8.771,8.771,0,0,1-2.769-.451.75.75,0,1,1,.474-1.424,7.245,7.245,0,0,0,2.3.375c3.428,0,6.561-2.442,8.43-6.553a14.5,14.5,0,0,0-1.581-2.694.75.75,0,1,1,1.2-.9Zm-12.9-1.18A12.736,12.736,0,0,0,1.571,8.639a13.022,13.022,0,0,0,3.047,4.322l2.138-2.138a3.87,3.87,0,0,1-.669-2.185,3.912,3.912,0,0,1,6.1-3.248l2-2A7.586,7.586,0,0,0,5.149,3.861Zm8.088,4.6a.75.75,0,0,1,.606.871A3.919,3.919,0,0,1,10.7,12.48a.778.778,0,0,1-.135.012A.75.75,0,0,1,10.434,11a2.409,2.409,0,0,0,1.932-1.937A.754.754,0,0,1,13.238,8.462ZM10,6.222A2.418,2.418,0,0,0,7.586,8.639,2.389,2.389,0,0,0,7.848,9.73l3.246-3.246A2.413,2.413,0,0,0,10,6.222Z"
                fill-rule="evenodd"
                fill="#4A5568"
              />
            </g>
          </g>
        </svg>

        Hidden
      </a>
    </div>
    <div class="py-1" role="none">
      <a
        href="#"
        class="text-gray-700 block px-5 py-3 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200 rounded-lg"
        @click="signout()"
      >
        <svg
          style="margin-right: 11px; margin-left: 3px; width: 18px"
          xmlns="http://www.w3.org/2000/svg"
          width="20.537"
          height="20"
          viewBox="0 0 20.537 20"
        >
          <g
            id="Iconly_Light-Outline_Logout"
            data-name="Iconly/Light-Outline/Logout"
            transform="translate(-2 -2)"
          >
            <g id="Logout" transform="translate(2 2)">
              <path
                id="Combined-Shape"
                d="M9.308,0a4.441,4.441,0,0,1,4.436,4.436v.932a.75.75,0,0,1-1.5,0V4.436A2.939,2.939,0,0,0,9.308,1.5H4.433A2.937,2.937,0,0,0,1.5,4.436V15.565A2.937,2.937,0,0,0,4.433,18.5H9.319a2.929,2.929,0,0,0,2.925-2.924v-.943a.75.75,0,0,1,1.5,0v.943A4.43,4.43,0,0,1,9.319,20H4.433A4.439,4.439,0,0,1,0,15.565V4.436A4.44,4.44,0,0,1,4.433,0Zm8.08,6.554,2.928,2.915a.739.739,0,0,1,.071.081l-.071-.081a.736.736,0,0,1,.094.114c.012.018.024.038.034.057s.017.031.024.048.012.029.018.043.014.039.02.058.008.031.012.047.008.038.011.058,0,.026,0,.039a.669.669,0,0,1,0,.067l-.005.062,0,.04v.005L20.537,10a.751.751,0,0,1-.018.164c0,.016-.008.031-.012.047s-.012.04-.02.059-.012.029-.018.043-.015.032-.024.048-.022.038-.035.057l-.023.032a.786.786,0,0,1-.078.088l-2.921,2.909a.75.75,0,1,1-1.058-1.062l1.64-1.635H7.746a.75.75,0,0,1,0-1.5H17.972L16.33,7.616a.75.75,0,1,1,1.058-1.062Z"
                fill-rule="evenodd"
                fill="#4A5568"
              />
            </g>
          </g>
        </svg>
        Sign out</a
      >
    </div>
  </div>

  <!-- <div class="overlay " @click="toggleDropdown" v-if="dropdown"></div> -->
  <div
    class="overlay fixed inset-0 bg-black bg-opacity-20 z-30"
    @click="toggleDropdown"
    v-if="dropdown"
  ></div>
  <!-- backdrop-blur-sm -->
  <div
    class="overlay fixed inset-0 bg-black bg-opacity-20 z-30"
    @click="handleNotificationClick"
    v-if="showPopup"
  ></div>
</template>

<style scoped>
.navbar {
  display: flex;
  /* border: 1px solid red; */
  /* width: 1366px; */
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 3px 10px #457aef0d;
  border-radius: 0px 0px 30px 30px;
  opacity: 1;
}

.logo {
  /* border: 1px solid red; */
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown {
  /* border: 1px solid red; */
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.backdrop {
  /* background-color: red; */
  width: 50px;
  height: 50px;
  margin-left: -18px;
  cursor: pointer;
}

.backdrop svg {
  justify-content: center;
  align-items: center;
  fill: #4675c0;
  margin-top: 15px;
  margin-left: 15px;
}

.backdrop:hover svg {
  fill: #b8bfd6;
}

#profile {
  width: 50px;
  height: 50px;
  margin-right: 20px;
  margin-left: 70px;
}

svg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 10px;
  fill: #b8bfd6;
  margin-top: 2px;
  /* border: 1px solid red; */
}

ul {
  /* border: 1px solid red; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  letter-spacing: 0.18px;
  opacity: 1;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 400;
  color: #b8bfd6;
  padding-left: 80px;
  /* margin-left: 20px; */
}

ul li {
  margin-right: 70px;
  display: flex;
  /* border: 1px solid red; */
}

ul li:hover svg,
ul li:hover span {
  color: #4675c0;
  fill: #4675c0;
  cursor: pointer;
  text-decoration: none;
}

.active {
  /* background-color: #4675c0; */
  color: #4675c0;
}

.active_icon {
  fill: #4675c0;
}

.user {
  position: absolute;
  /* margin-top: -5px; */
  margin-left: 81.6%;
  float: right;

  border-radius: 12px;
  background-color: rgb(255, 255, 255);
  width: 15%;
  height: 20%;
  z-index: 1;
  box-shadow: 0px 0px 30px #1236840d;
}

.role {
  background-color: #4675c0;
  font-size: 12px;
  width: auto;
  z-index: 1;
  color: white;
  font-weight: 100;
  letter-spacing: 0.8px;
  float: right;
  border-radius: 5px;
  padding: 0px 10px 0px 10px;
  margin-left: auto;
}

/* สไตล์สำหรับ popup ของ notification */
.notification-popup {
  position: absolute;
  overflow-y: auto; /* เลือกเฉพาะการเลื่อนแนวตั้ง */
  overflow-x: hidden; /* ป้องกันการเลื่อนแนวนอน */
  height: 200px;
  width: 280px;
  top: 80px;
  padding-bottom: 15px;
  background-color: white;
  /* padding: 10px; */
}

.bell {
  /* margin-right: -20px; */
  /* margin-left: 20px; */
  position: absolute;
  margin-left: -110px;
  margin-top: 10px;
  width: 30px;
  height: 30px;
  /* background-color: #4675c0; */
}

.bell:hover {
  opacity: 0.5;
  cursor: pointer;
}

.badge {
  background-color: red;
  color: white;
  border-radius: 100px;
  /* padding: 0.3em; */
  font-size: 12px;
  padding-left: 6px;
  padding-right: 7px;
  text-align: center;

  padding-top: 1.7px;
  position: relative;
  margin-top: -32px;
  width: 23px;
  height: 20px;
  margin-left: 10px;
  top: -35px;
}

.noti_block {
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
  /* margin-bottom: 15px; */
  /* width: 200px; */
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  background: #f9f9f9;
  display: block;
  overflow: hidden;
  word-wrap: break-word;
  border: 1px solid transparent;
}

.noti_block:hover {
  cursor: pointer;
  background-color: #eef4ff;
  border: 1px solid #4675c0 !important;
}

.No-notifications {
  color: #b8bfd6;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.56px;
  text-align: center;
}

.line-noti-popup {
  background-color: #e6e6e6;
  height: 1px;
  width: 250px;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: -15px;
  transform: translate(-50%, -50%);
  /* bottom: 78%; */
}

</style>
