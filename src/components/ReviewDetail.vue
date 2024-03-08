<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onBeforeMount, watch, computed } from "vue";
import moment from "moment";
import BackNavbar from "./BackNavbar.vue";
import ToastSuccess from "../components/ToastSuccess.vue";
import ToastError from "../components/ToastError.vue";
import PopupReport from "../components/PopupReport.vue";

const params = useRoute().params;

const reviews = ref([]);
const course = ref([]);
const showNoData = ref(false);
const isDropdownOpen = ref([]);
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");
const filteredreviews = ref([]);
const searchQuery = ref("");
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("Add Comment Failed");
const successMessage = ref();

const hideError = () => {
  showError.value = false;
};

const hideSuccess = () => {
  showSuccess.value = false;
};

// report -----------------------------------------------------------
const idreport = ref(); //ค่า id review ที่จะส่งไป report

const isPopupVisible = ref(false);

const closePopup = () => {
  isPopupVisible.value = false;
};

const openPopupReport = (reviewId) => {
  idreport.value = reviewId;
  isPopupVisible.value = true;
};

const handleSelectedOption = async (option) => {
  console.log("Selected option:", option.value);
  console.log("Selected option:", option.selected);
  console.log("Selected summaryid:", idreport.value);

  let data = {};
  if (option.value === "1") {
    data = {
      inappropriateReview: option.selected,
      notMatchReview: false,
      emailReportReview: email,
      reviewIdreview: idreport.value,
    };
  } else if (option.value === "2") {
    data = {
      inappropriateReview: false,
      notMatchReview: option.selected,
      emailReportReview: email,
      reviewIdreview: idreport.value,
    };
  }

  // api report -----------------------------------------------------------

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportReview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 201) {
      console.log("Report review success");
      successMessage.value = `Report Success`;
      showSuccess.value = true;
      closePopup();
      setTimeout(() => {
        hideSuccess();
      }, 1500);
    } else {
      console.error("can not report");
    }
  } catch (error) {
    console.error("Error reporting review:", error);
  }
};

// -----------------------------------------------------------

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() =>
  Math.ceil(filteredreviews.value.length / itemsPerPage)
);
const paginatedreviews = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredreviews.value.slice(startIndex, endIndex);
});

const updatePage = (direction) => {
  if (direction === "prev" && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === "next" && currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const clearFilter = () => {
  searchQuery.value = "";

  fetchReviews();
  currentPage.value = 1;
};

const filterData = () => {
  if (searchQuery.value === "") {
    clearFilter();
  }
  filteredreviews.value = reviews.value.filter(
    (review) => review.gradesReceived === searchQuery.value
  );
  currentPage.value = 1;
};

const fetchReviews = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}course/${params.courseid}/review`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data) {
        reviews.value = data;
        filteredreviews.value = data;
        // totalPages.value = data.totalPages;
        isDropdownOpen.value = Array(reviews.value.length).fill(false);
      } else {
        console.error("Error: Failed to parse data");
      }
    } else {
      console.error("Error:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onBeforeMount(async () => {
  try {
    const responsereview = await fetch(
      `${import.meta.env.VITE_BASE_URL}course/${params.courseid}/review`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const responsecourse = await fetch(
      `${import.meta.env.VITE_BASE_URL}course/${params.courseid}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (responsereview.ok && responsecourse.ok) {
      const data_review = await responsereview.json();
      const data_course = await responsecourse.json();

      if (data_review && data_course) {
        reviews.value = data_review;
        filteredreviews.value = data_review;
        // totalPages.value = data_review.totalPages;
        course.value = data_course;
        isDropdownOpen.value = Array(reviews.value.length).fill(false);

        setTimeout(() => {
          showNoData.value = true;
        }, 10);
      } else {
        console.error("Error: Failed to parse data");
      }
    }

    if (responsereview.status === 401 || responsecourse.status === 401) {
      signout();
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

const toggleDropdown = (index) => {
  if (isDropdownOpen.value && isDropdownOpen.value[index] !== undefined) {
    isDropdownOpen.value[index] = !isDropdownOpen.value[index];
  }
};

const deleteReview = async (id, index) => {
  if (confirm("You want to delete") == true) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}review/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200) {
      isDropdownOpen.value[index] = false;
      alert("Delete!!!", `You delete event success`, "success");

      // setTimeout(function () {
      //   reviews.value = reviews.value.filter((e) => e.id !== id);
      // }, 500);

      setTimeout(function () {
        const indexToDelete = reviews.value.findIndex((e) => e.id === id);
        if (indexToDelete !== -1) {
          reviews.value.splice(indexToDelete, 1);
        }
      }, 500);

      console.log("delete success");
    } else console.log("cannot delete");
  }
};

const hidereview = async (id) => {
  try {
    const confirmed = confirm("คุณแน่ใจหรือไม่ที่ต้องการซ่อนข้อมูลนี้?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}review/${id}/hide`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      fetchReviews();
      alert("ซ่อนข้อมูลสำเร็จ");
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการซ่อนข้อมูล:", error);
  }
};

const getGradeColor = (gradesReceived) => {
  switch (gradesReceived) {
    case "A":
      return "#4A328B";
    case "B+":
      return "#457AEF";
    case "B":
      return "#01A29A";
    case "C+":
      return "#1BA32E";
    case "C":
      return "#B9CA02";
    case "D+":
      return "#E59E00";
    case "D":
      return "#EA5E0E";
    case "F":
      return "#DD001B";
  }
};

const signout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  alert("Token has expired. Please log in again.");
  Login();
};

const appRouter = useRouter();
const Login = () => appRouter.push({ name: "login" });
</script>

<template>
  <div class="container mx-auto mt-28">
    <div class="toast-container">
      <ToastError
        :showError="showError"
        :errorMessage="errorMessage"
        @hide-error="hideError"
      />
      <ToastSuccess
        :showSuccess="showSuccess"
        :successMessage="successMessage"
        @hide-success="hideSuccess"
      />
    </div>

    <!-- ส่วนของ breadcrumb -->
    <div class="navigation">
      <span style="color: #b8bfd6"
        >Review &nbsp;
        <span style="color: #4675c1">
          > &nbsp; {{ course.courseName }} {{ course.courseFullName }}
        </span>
      </span>
    </div>

    <!-- ส่วนของ filter  -->
    <div class="search">
      <p class="topic">Search</p>
      <div class="line"></div>
      <div class="filter-container flex items-center">
        <div class="filter-item">
          <p class="second">Grades Received</p>

          <!-- <input
            v-model.trim="searchQuery"
            placeholder="Search Grades Received ..."
            class="dropdowns-search"
            required
          /> -->
          <select
            v-model="searchQuery"
            placeholder="Select Grades Received ..."
            class="dropdowns-search"
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>

        <div class="button-2">
          <button @click="filterData" class="button-search">Search</button>
          <button @click="clearFilter" class="button-clear">Clear</button>
        </div>
      </div>
    </div>

    <!-- ส่วนของกรอบ box -->
    <div class="box" v-if="paginatedreviews.length > 0">
      <div class="box-content">
        <div class="box-line"></div>
        <div class="subject">
          {{ course.courseName }}
          <span class="subject-full"> ( {{ course.courseFullName }} )</span>
        </div>
      </div>

      <!-- ส่วนของ review แต่ละอัน -->
      <div
        class="review-box"
        v-for="(review, index) in paginatedreviews"
        :key="review.id"
      >
        <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
        <div class="dropdown">
          <img
            class="info"
            src="../assets/info.png"
            @click="() => toggleDropdown(index)"
          />
        </div>

        <div class="dropdown-click">
          <div
            class="absolute right-3 z-12 mt-2 w-32 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            v-if="isDropdownOpen[index]"
          >
            <router-link
              :to="{
                name: 'EditReview',
                params: { reviewid: review.id },
              }"
              tag="a"
              class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              v-if="role === 'st_group' && review.emailOwner === email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19.5"
                height="18.94"
                viewBox="0 0 19.5 18.94"
                style="margin-right: 15px; margin-left: 8px; width: 16px"
              >
                <g
                  id="Iconly_Light-Outline_Edit"
                  data-name="Iconly/Light-Outline/Edit"
                  transform="translate(-2 -3)"
                >
                  <g id="Edit" transform="translate(2 3)">
                    <path
                      id="Combined-Shape"
                      d="M18.75,17.44a.75.75,0,0,1,0,1.5H11.5a.75.75,0,0,1,0-1.5ZM14.116.654l1.723,1.339A2.821,2.821,0,0,1,17.1,3.768a2.862,2.862,0,0,1-.368,2.2l-.015.022L16.712,6c-.068.089-.362.461-1.847,2.322a.591.591,0,0,1-.046.069.749.749,0,0,1-.081.09l-.321.4-.228.285L12.5,11.285l-.34.425L7.148,17.98a2.447,2.447,0,0,1-1.886.914l-3.639.046h-.01a.751.751,0,0,1-.73-.577L.064,14.892a2.371,2.371,0,0,1,.46-2.037L9.944,1.073l.011-.013A3,3,0,0,1,14.116.654ZM8.894,4.787l-7.2,9a.879.879,0,0,0-.171.755l.681,2.885,3.039-.038a.949.949,0,0,0,.733-.352l3.235-4.048.417-.521h0l.417-.522,3.109-3.891Zm2.216-2.77-1.279,1.6,4.261,3.271c.82-1.027,1.36-1.7,1.41-1.768a1.36,1.36,0,0,0,.142-1,1.411,1.411,0,0,0-.652-.887c-.071-.049-1.756-1.357-1.808-1.4A1.5,1.5,0,0,0,11.11,2.017Z"
                      fill-rule="evenodd"
                    />
                  </g>
                </g>
              </svg>

              Edit
            </router-link>

            <a
              href="#"
              class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              @click="() => deleteReview(review.id, index)"
              v-if="role === 'st_group' && review.emailOwner === email"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18.458"
                height="20"
                viewBox="0 0 18.458 20"
                style="margin-right: 15px; margin-left: 8px; width: 15px"
              >
                <g
                  id="Iconly_Light-Outline_Delete"
                  data-name="Iconly/Light-Outline/Delete"
                  transform="translate(-3 -2)"
                >
                  <g id="Delete" transform="translate(3 2)">
                    <path
                      id="Combined-Shape"
                      d="M16.385,6.72a.751.751,0,0,1,.688.808c-.006.068-.548,6.779-.86,9.594a2.976,2.976,0,0,1-3.09,2.842C11.79,19.987,10.5,20,9.247,20c-1.355,0-2.676-.015-3.983-.042a2.967,2.967,0,0,1-3.018-2.829c-.315-2.84-.854-9.534-.859-9.6a.749.749,0,0,1,.687-.808.77.77,0,0,1,.808.687c0,.043.224,2.777.464,5.482l.048.54c.121,1.344.244,2.636.343,3.536a1.472,1.472,0,0,0,1.558,1.494c2.5.053,5.051.056,7.8.006a1.5,1.5,0,0,0,1.626-1.507c.31-2.794.85-9.482.856-9.55A.766.766,0,0,1,16.385,6.72ZM11.345,0a2.033,2.033,0,0,1,1.962,1.506l.254,1.261a.9.9,0,0,0,.865.722h3.282a.75.75,0,1,1,0,1.5H.75a.75.75,0,1,1,0-1.5H4.031l.1-.006A.9.9,0,0,0,4.9,2.767L5.14,1.551A2.043,2.043,0,0,1,7.112,0Zm0,1.5H7.112a.529.529,0,0,0-.512.392l-.233,1.17a2.38,2.38,0,0,1-.128.427h5.979a2.386,2.386,0,0,1-.128-.427l-.243-1.216A.524.524,0,0,0,11.345,1.5Z"
                      fill-rule="evenodd"
                    />
                  </g>
                </g>
              </svg>

              Delete</a
            >

            <a
              href="#"
              class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              @click="hidereview(review.id)"
              v-if="role === 'staff_group'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="17.273"
                viewBox="0 0 20 17.273"
                style="margin-right: 15px; margin-left: 8px; width: 16px"
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

              Hide</a
            >

            <a
              href="#"
              class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              v-if="role === 'st_group' && email !== review.emailOwner"
              @click="() => openPopupReport(review.id, index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20.014"
                height="18.186"
                viewBox="0 0 20.014 18.186"
                style="margin-right: 15px; margin-left: 8px; width: 16px"
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

              Report</a
            >

            <PopupReport
              :show="isPopupVisible"
              @close="closePopup"
              @selected="handleSelectedOption"
            />
          </div>
        </div>

        <!-- <img src="../assets/user.png" class="user" /> -->
        <img src="../assets/student.png" id="profile_review" />
        <div class="detail-user-review">
          <span
            class="grade flex items-center"
            :style="{
              borderColor: getGradeColor(review.gradesReceived),
            }"
          >
            <p
              class="grade_received"
              :style="{
                backgroundColor: getGradeColor(review.gradesReceived),
              }"
            >
              {{ review.gradesReceived }}
            </p>
            <span
              :style="{
                color: getGradeColor(review.gradesReceived),
              }"
              >Grades Received</span
            ></span
          >

          <p class="instructor flex items-center">
            <svg
              style="margin-right: 13px"
              xmlns="http://www.w3.org/2000/svg"
              width="11.118"
              height="14.18"
              viewBox="0 0 11.118 14.18"
            >
              <g id="teacher-svgrepo-com" transform="translate(-43.369 -28)">
                <g
                  id="Group_318"
                  data-name="Group 318"
                  transform="translate(43.369 28)"
                >
                  <g
                    id="Group_317"
                    data-name="Group 317"
                    transform="translate(0 0)"
                  >
                    <path
                      id="Path_178"
                      data-name="Path 178"
                      d="M89.844,6.616a3.308,3.308,0,1,0-3.308-3.308A3.312,3.312,0,0,0,89.844,6.616Zm0-5.826a2.518,2.518,0,1,1-2.518,2.518A2.521,2.521,0,0,1,89.844.79Z"
                      transform="translate(-84.285)"
                      fill="#697a98"
                    />
                    <path
                      id="Path_179"
                      data-name="Path 179"
                      d="M54.453,173.614l-1.085-4.5a1.181,1.181,0,0,0-1.152-.907H45.639a1.181,1.181,0,0,0-1.152.907l-1.085,4.5a1.185,1.185,0,0,0,1.152,1.463H53.3A1.185,1.185,0,0,0,54.453,173.614Zm-9.9.673a.4.4,0,0,1-.384-.487l1.085-4.5a.394.394,0,0,1,.384-.3h1.8l-.5,3.523a.4.4,0,0,0,.076.294l1.117,1.473Zm3.19-1.819L48.235,169H49.62l.491,3.471-1.183,1.56Zm5.557,1.819H49.723l1.117-1.473a.4.4,0,0,0,.076-.294l-.5-3.523h1.8a.394.394,0,0,1,.384.3l1.085,4.5A.4.4,0,0,1,53.3,174.287Z"
                      transform="translate(-43.369 -160.897)"
                      fill="#697a98"
                    />
                  </g>
                </g>
              </g>
            </svg>

            <span>{{ review.instructorName }}</span>
          </p>

          <p class="flex items-center">
            <svg
              style="margin-right: 13px; width: 18px"
              xmlns="http://www.w3.org/2000/svg"
              width="15.84"
              height="19.87"
              viewBox="0 0 15.84 19.87"
              class="user_review"
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
                    fill="#697A98"
                  />
                </g>
              </g>
            </svg>
            <span class="username_review">
              {{ review.emailOwner.slice(0, 5) }}
              <div class="dot_review"></div>
              <!-- {{
                moment(review.fileCreatedOn).locale("th").format("DD MMMM YYYY")
              }} -->
              <!-- {{ moment(review.reviewCreatedOn).locale("th").fromNow() }} -->

              {{
                moment(review.reviewCreatedOn).diff(moment(), "days") > -7
                  ? moment(review.reviewCreatedOn).locale("th").fromNow()
                  : moment(review.reviewCreatedOn)
                      .locale("th")
                      .format("DD MMMM YYYY")
              }}
            </span>
          </p>
        </div>

        <div class="year flex items-center">
          <p class="section" v-if="review.section !== null">
            Sec {{ review.section }}
          </p>
          <p class="section" v-if="review.section === null">Sec -</p>
          <p class="year_text">{{ review.semester }} / {{ review.year }}</p>
        </div>

        <div class="line_review"></div>
        <p class="assignment">
          Assignment
          <br />
          <span class="in_assignment">{{ review.work }}</span>
        </p>

        <p class="description">
          Description
          <br />
          <span class="in_description">{{ review.reviewDescription }}</span>
        </p>

        <!-- เนื้อหามีความน่าสนใจ -->
        <div class="rating_container">
          <div class="rating_review">
            <div v-if="review.ratingOfInteresting === 1">
              <p class="label_rating">เนื้อหามีความน่าสนใจ</p>
              <div class="box_star">⭐</div>
            </div>
            <div v-if="review.ratingOfInteresting === 2">
              <p class="label_rating">เนื้อหามีความน่าสนใจ</p>
              <div class="box_star">⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfInteresting === 3">
              <p class="label_rating">เนื้อหามีความน่าสนใจ</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfInteresting === 4">
              <p class="label_rating">เนื้อหามีความน่าสนใจ</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfInteresting === 5">
              <p class="label_rating">เนื้อหามีความน่าสนใจ</p>
              <div class="box_star">
                ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
              </div>
            </div>
          </div>

          <!-- เน้นการทำงานเดี่ยว -->
          <div class="rating_review">
            <div v-if="review.ratingOfIndividualWork === 1">
              <p class="label_rating">เน้นการทำงานเดี่ยว</p>
              <div class="box_star">⭐</div>
            </div>
            <div v-if="review.ratingOfIndividualWork === 2">
              <p class="label_rating">เน้นการทำงานเดี่ยว</p>
              <div class="box_star">⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfIndividualWork === 3">
              <p class="label_rating">เน้นการทำงานเดี่ยว</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfIndividualWork === 4">
              <p class="label_rating">เน้นการทำงานเดี่ยว</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfIndividualWork === 5">
              <p class="label_rating">เน้นการทำงานเดี่ยว</p>
              <div class="box_star">
                ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
              </div>
            </div>
          </div>

          <!-- เน้นการทำงานกลุ่ม -->
          <div class="rating_review">
            <div v-if="review.ratingOfGroupWork === 1">
              <p class="label_rating">เน้นการทำงานกลุ่ม</p>
              <div class="box_star">⭐</div>
            </div>
            <div v-if="review.ratingOfGroupWork === 2">
              <p class="label_rating">เน้นการทำงานกลุ่ม</p>
              <div class="box_star">⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGroupWork === 3">
              <p class="label_rating">เน้นการทำงานกลุ่ม</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGroupWork === 4">
              <p class="label_rating">เน้นการทำงานกลุ่ม</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGroupWork === 5">
              <p class="label_rating">เน้นการทำงานกลุ่ม</p>
              <div class="box_star">
                ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
              </div>
            </div>
          </div>

          <div class="rating_review">
            <div v-if="review.ratingOfGradeCollect === 1">
              <p class="label_rating">วิชาเก็บเกรด</p>
              <div class="box_star">⭐</div>
            </div>
            <div v-if="review.ratingOfGradeCollect === 2">
              <p class="label_rating">วิชาเก็บเกรด</p>
              <div class="box_star">⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGradeCollect === 3">
              <p class="label_rating">วิชาเก็บเกรด</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGradeCollect === 4">
              <p class="label_rating">วิชาเก็บเกรด</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfGradeCollect === 5">
              <p class="label_rating">วิชาเก็บเกรด</p>
              <div class="box_star">
                ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
              </div>
            </div>
          </div>

          <div class="rating_review">
            <div v-if="review.ratingOfEasyExam === 1">
              <p class="label_rating">ข้อสอบไม่ยาก</p>
              <div class="box_star">⭐</div>
            </div>
            <div v-if="review.ratingOfEasyExam === 2">
              <p class="label_rating">ข้อสอบไม่ยาก</p>
              <div class="box_star">⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfEasyExam === 3">
              <p class="label_rating">ข้อสอบไม่ยาก</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfEasyExam === 4">
              <p class="label_rating">ข้อสอบไม่ยาก</p>
              <div class="box_star">⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐</div>
            </div>
            <div v-if="review.ratingOfEasyExam === 5">
              <p class="label_rating">ข้อสอบไม่ยาก</p>
              <div class="box_star">
                ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- pagination -->
      <div class="pagination flex items-center">
        <ul class="flex items-center -space-x-px h-8 text-sm"></ul>
        <button
          class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          @click="updatePage('prev')"
          :disabled="currentPage === 1"
        >
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </button>
        <span
          class="flex items-center justify-center px-3 h-8 leading-tight text-sm text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >{{ currentPage }} of {{ totalPages }}</span
        >
        <button
          class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
          @click="updatePage('next')"
          :disabled="currentPage === totalPages"
        >
          <svg
            class="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-else>
      <div class="no-review" v-if="showNoData">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="44.653"
          height="59.234"
          viewBox="0 0 44.653 59.234"
          class="notfound"
        >
          <g id="Exp-2.-F" transform="translate(-9.673 -2.383)">
            <path
              id="Path_19725"
              data-name="Path 19725"
              d="M51.791,24.617h-37a3,3,0,0,0-3,3v6h40Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <path
              id="Path_19726"
              data-name="Path 19726"
              d="M11.791,28.3h40v1.863h-40Z"
              fill="#8da3be"
              fill-rule="evenodd"
            />
            <path
              id="Path_19727"
              data-name="Path 19727"
              d="M51.791,23.7a3,3,0,0,0-3-3H36.153a3,3,0,0,0-2.842,2.04C32.733,24.449,32,26.617,32,26.617H51.791Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <path
              id="Path_19728"
              data-name="Path 19728"
              d="M54.279,34.234a4,4,0,0,0-3.953-4.617H13.674a4,4,0,0,0-3.953,4.617c1.018,6.512,2.85,18.238,3.75,24a4,4,0,0,0,3.953,3.383H46.576a4,4,0,0,0,3.953-3.383c.9-5.762,2.732-17.488,3.75-24Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19729"
              data-name="Path 19729"
              d="M9.721,34.234l.513,3.28a4.04,4.04,0,0,1,.976-3.219,4,4,0,0,1,3.039-1.4h35.5a4,4,0,0,1,3.039,1.4,4.04,4.04,0,0,1,.976,3.219l.513-3.28a4,4,0,0,0-3.953-4.617H13.674a4,4,0,0,0-3.953,4.617Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <g id="Group_29522" data-name="Group 29522">
              <path
                id="Path_19730"
                data-name="Path 19730"
                d="M29.715,53.464a2,2,0,0,0-2-2h-8a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19731"
                data-name="Path 19731"
                d="M23.557,25.826a5.277,5.277,0,0,1-.064-.834,1,1,0,1,0-2-.008,7.1,7.1,0,0,0,.089,1.153,1,1,0,0,0,1.975-.311Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19732"
                data-name="Path 19732"
                d="M24.607,21.993a5.329,5.329,0,0,1,.66-.648A1,1,0,0,0,23.992,19.8a7.373,7.373,0,0,0-.908.892,1,1,0,0,0,1.523,1.3Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19733"
                data-name="Path 19733"
                d="M28.376,19.9a10.683,10.683,0,0,1,1.277-.2,1,1,0,0,0-.2-1.99,12.635,12.635,0,0,0-1.516.243,1,1,0,1,0,.438,1.951Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19734"
                data-name="Path 19734"
                d="M33.495,19.694c.61.016,1.189.011,1.741-.012a1,1,0,0,0-.084-2q-.763.031-1.606.011a1,1,0,1,0-.051,2Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19735"
                data-name="Path 19735"
                d="M39.368,19.055a11.383,11.383,0,0,0,1.749-.66,1,1,0,0,0-.866-1.8,9.447,9.447,0,0,1-1.441.543,1,1,0,0,0,.558,1.92Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19736"
                data-name="Path 19736"
                d="M44.122,15.939a6.171,6.171,0,0,0,.962-2.144,1,1,0,1,0-1.947-.456,4.186,4.186,0,0,1-.653,1.452,1,1,0,1,0,1.638,1.148Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19737"
                data-name="Path 19737"
                d="M44.715,9.783a5.751,5.751,0,0,0-1.961-2.471,1,1,0,1,0-1.136,1.646,3.737,3.737,0,0,1,1.259,1.614,1,1,0,1,0,1.838-.789Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
            </g>
            <path
              id="Path_19738"
              data-name="Path 19738"
              d="M31.891,6.831c1.082-6.127,10.459-5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19739"
              data-name="Path 19739"
              d="M31.891,8.383c1.082,6.126,10.459,5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19740"
              data-name="Path 19740"
              d="M31.8,8.617h6.7a1,1,0,0,0,0-2H31.8a1,1,0,1,0,0,2Z"
              fill="#4675c0"
              fill-rule="evenodd"
            />
          </g>
        </svg>

        <p>No review</p>
      </div>
    </div>

    <BackNavbar />
  </div>
</template>

<style scoped>
.navigation {
  margin-top: -80px;
  margin-left: 10px;
  font: normal normal 400 14px/22px Poppins;
  letter-spacing: 0.28px;
}
.no-review {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  margin-top: 20%;
}
.notfound {
  width: 15%;
  height: 15%;
}

.no-review p {
  margin-top: 25px;
  color: #b8bfd6;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
}

.box {
  position: relative;
  width: 1255px;
  /* height: 849px; */
  /* margin-top: 25px; */
  margin-top: 235px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 30px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.box-content {
  margin-left: -93%;
}
.box-line {
  float: left;
  margin-top: 22px;
  margin-bottom: 22px;
  width: 8px;
  height: 39px;
  background: #4675c0;
  border-radius: 15px;
  opacity: 1;
}

.subject {
  position: absolute;
  margin-left: 30px;
  padding-top: 22px;
  color: var(--unnamed-color-19335a);
  text-align: left;
  font: normal normal 600 26px/39px Poppins;
  letter-spacing: 1.2px;
  color: #19335a;
  opacity: 1;
}

.subject-full {
  color: var(--unnamed-color-b8bfd6);
  text-align: left;
  font: normal normal 400 14px/22px Poppins;
  /* font-size: 12px; */
  letter-spacing: 0.28px;
  color: #b8bfd6;
  opacity: 1;
}

.review-box {
  position: relative;
  width: 1188px;
  /* height: 328px; */
  /* UI Properties */
  background: #fafafa 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #efefef;
  border: 1px solid #efefef;
  border-radius: 20px;
  opacity: 1;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.review-box {
  white-space: pre-line; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามตำแหน่งของ "\n" */
  word-wrap: break-word; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามขอบกล่อง */
  overflow: hidden; /* ซ่อนข้อความที่เกินขอบกล่อง */
}

.box {
  margin-bottom: 100px;
}

.dropdown {
  float: right;
  position: relative;
  margin-top: 5px;
  /* display: inline-block; */
  /* position: relative; */
}

.dropdown-click {
  position: relative;
  top: 45px;
  margin-top: 10px;
  z-index: 1;
  margin-right: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.semi-transparent {
  opacity: 0.3;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 10px;
}

.info {
  width: 40px;
  margin-top: 10px;
  margin-right: 3px;
  z-index: 2;
}

.info:hover {
  opacity: 0.5;
}

.user_review {
  width: 69px;
  position: relative;
  margin-left: 20px;
  margin-top: 20px;
}

.assignment {
  text-align: left;
  font: normal normal medium 14px/21px Poppins;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  opacity: 1;
  margin-bottom: 10px;
  margin-left: 40px;
  margin-top: 50px;
  color: #b8bfd6;
  width: 95%;
}

.in_assignment {
  color: #697a98;
  font-size: 14px;
}

.in_description {
  color: #697a98;
  font-size: 14px;
}
.description {
  color: #b8bfd6;
  text-align: left;
  font: normal normal medium 14px/21px Poppins;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  opacity: 1;
  margin-bottom: 10px;
  margin-left: 40px;
  margin-top: 20px;
  width: 95%;
}

.rating_container {
  display: flex;
  justify-content: center;
}
.rating_review {
  width: 210px;
  height: 84px;
  /* UI Properties */
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #4675c158;
  border-radius: 15px;
  opacity: 1;
  /* display: inline-block; */
  /* margin-right: 20px; */
  margin-left: 12px;
  margin-right: 5px;
  margin-top: 30px;
  margin-bottom: 10px;
}

.createon {
  color: var(--unnamed-color-b8bfd6);
  text-align: left;
  font: normal normal medium 14px/21px Poppins;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: #b8bfd6;
  opacity: 1;
  margin-bottom: 20px;
  /* padding-top:20px; */
}

.line_review {
  background-color: #e6e6e6;
  height: 1px;
  width: 95%;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  margin-top: 30px;
}

.detail-1 {
  margin-left: 120px;
  margin-top: -70px;
  position: relative;
  width: 1000px;
}

.createon-icon {
  width: 20px;
  margin-right: 10px;
  margin-top: -20px;
}
.createon-container {
  display: flex;
  align-items: center;
}

#profile_review {
  width: 70px;
  height: 70px;
  margin-left: 30px;
  margin-top: 20px;
}

.grade {
  background-color: white;
  width: 190px;
  height: 25px;
  border: 1px solid var(--unnamed-color-457aef);
  background: #b8bfd600 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #457aef;
  border-radius: 13px;
  opacity: 1;
  margin-left: 112px;
  margin-bottom: 10px;
}

.grade span {
  color: var(--unnamed-color-457aef);
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.48px;
  color: #457aef;
  opacity: 1;
  padding-left: 20px;
}

.grade_received {
  color: wite;
  width: 35px;
  height: 25px;
  /* UI Properties */
  background: #457aef 0% 0% no-repeat padding-box;
  font-size: 14px;
  font-weight: 300;

  border-radius: 13px 0px 0px 13px;
  opacity: 1;
  color: white;
  text-align: center;
  justify-content: center;
  padding: 2px;
}

.user_review {
  width: 12px;
  height: 12px;
  opacity: 1;
  /* display: flex inline; */
  z-index: 1;
  /* margin-left: -56.5px; */
  margin-left: 112px;
}

.instructor {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.48px;
  color: #697a98;
  opacity: 1;
  margin-bottom: -18px;
  margin-left: 115px;
}

.instructor span {
  margin-left: -2px;
}
.username_review {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0.48px;
  font-size: 12px;
  font-weight: 500;
  color: #697a98;
  opacity: 1;
  margin-top: 23px;
  margin-left: -5px;
}

.dot_review {
  width: 5px;
  height: 5px;
  background: #b8bfd6;
  opacity: 1;
  display: flex inline;
  z-index: 1;
  border-radius: 50%;
  margin-left: 8px;
  margin-right: 5px;
}

.detail-user-review {
  float: left;
  margin-top: -60px;
  margin-left: 8px;
}

.label_rating {
  /* background-color: #457aef; */
  /* margin-top: 30px; */
  letter-spacing: var(--unnamed-character-spacing-0-48);
  color: var(--unnamed-color-457aef);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.48px;
  color: #457aef;
  opacity: 1;
  padding-top: 10px;
  padding-bottom: 5px;
  text-align: center;
}

.box_star {
  width: 175px;
  height: 34px;
  /* UI Properties */
  background: #f1f6ff 0% 0% no-repeat padding-box;
  border-radius: 10px;
  opacity: 1;
  padding: 5px;
  text-align: center;
  margin-left: 8%;
  margin-right: 8%;
}

.year {
  float: right;
  /* padding-left: 10px; */
  padding-right: 15px;
  width: auto;
  height: 28px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #697b98;
  border-radius: 8px;
  opacity: 1;
  margin-top: -68px;
  margin-right: 50px;
  /* font: normal normal 8.8px Poppins; */
}

.year_text {
  font-size: 14px;
  font-weight: 400;
  font-family: "Poppins";
  color: #697b98;
  letter-spacing: 0.48px;
}

.section {
  height: 28px;
  width: auto;
  padding-left: 15px;
  padding-right: 15px;
  margin-right: 15px;
  background: var(--unnamed-color-697a98) 0% 0% no-repeat padding-box;
  background: #697a98 0% 0% no-repeat padding-box;
  border-radius: 8px 0px 0px 8px;
  opacity: 1;
  color: white;
  font-size: 13px;
  letter-spacing: 0.48px;
  padding-top: 5px;
  font-weight: 400;
}

.search {
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: 115px;
  /* top:30%; */
  transform: translate(-50%, -50%);
  width: 1255px;
  height: 175px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
}

.search .topic {
  margin-top: 20px;
  margin-left: 30px;
  font: normal normal 500 18px/27px Poppins;
  letter-spacing: 0.72px;
  color: #4675c0;
  opacity: 1;
}

.search .second {
  margin-top: 25px;
  margin-left: 30px;
  font: normal normal 400 14px/27px Poppins;
  letter-spacing: 0.28px;
  color: #697a98;
  opacity: 1;
}

.inputsearch {
  letter-spacing: 0.28px;
  color: #636363;
  opacity: 1;
}

.textsearch {
  margin-left: 30px;
  margin-top: 5px;
  width: 300px;
  height: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
}

.dropdowns-search {
  margin-left: 30px;
  margin-top: 5px;
  padding-left: 15px;
  width: 300px;
  height: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
}

.dropdowns-search::placeholder {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.5;
}

.dropdowns-search:valid {
  font-size: 14px;
  font-weight: 500;
}

.line {
  background-color: #ecf1f9;
  height: 1.5px;
  width: 95%;
  position: absolute;
  top: 58px;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
}

.button-search {
  background-color: #4675c0;
  height: 40px;
  width: 100px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: white;
  margin-right: 20px;
  margin-left: 660px;
  margin-top: 57px;
}

.button-search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-search:hover {
  /* opacity: 0.5; */
  background-color: #2152a0;
}

.button-search:active,
.button-clear:active {
  transform: scale(0.92); /* ลดขนาดของปุ่มเมื่อถูกคลิก */
  transition: transform 0.2s ease-in-out; /* เพิ่มเอฟเฟค transition */
}

.button-search:active:disabled,
.button-clear:active:disabled {
  transform: none; /* กำหนดให้ไม่มีการเปลี่ยนขนาดเมื่อถูกคลิกแต่ยัง disable อยู่ */
}

.button-search:hover:disabled {
  background-color: #4675c0; /* สีที่คุณต้องการเมื่อ hover แต่ปุ่ม disable */
}

.button-clear:hover:disabled {
  background-color: #ffffff; /* ใส่สีที่คุณต้องการเมื่อ hover แต่ปุ่ม disable */
}

.button-clear {
  background-color: white;
  border: solid 1px #4675c0;
  height: 40px;
  width: 100px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: #4675c0;
}

.button-clear:hover {
  opacity: 0.5;
  /* background-color: #f4f8ff; */
}

.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
