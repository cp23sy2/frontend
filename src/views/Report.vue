<script setup>
import { ref, onBeforeMount, computed } from "vue";
import moment from "moment";
//show
const activeTab = ref("summary");
const summaryButtonColor = ref("#3498db");
const reviewButtonColor = ref("#3498db");
const isDropdownOpen = ref([]);
const role = localStorage.getItem("role");
const summaries = ref([]);
const reviews = ref([]);
// const showPopup = ref(false);
const reportofsummary = ref([]);
const reportofreview = ref([]);

const currentPageSummary = ref(1);
const currentPageReview = ref(1);
const itemsPerPage = ref(10);

const paginatedItemsSummary = computed(() => {
  const start = (currentPageSummary.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return summaries.value.slice(start, end);
});

const totalItemsSummary = computed(() => {
  return summaries.value.length;
});

const totalPagesSummary = computed(() =>
  Math.ceil(totalItemsSummary.value / itemsPerPage.value)
);

const setPageSummary = (page) => {
  if (page >= 1 && page <= totalPagesSummary.value) {
    currentPageSummary.value = page;
  }
};

const paginatedItemsReview = computed(() => {
  const start = (currentPageReview.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return reviews.value.slice(start, end);
});

const totalItemsReview = computed(() => {
  return reviews.value.length;
});

const totalPagesReview = computed(() =>
  Math.ceil(totalItemsReview.value / itemsPerPage.value)
);

const setPageReview = (page) => {
  if (page >= 1 && page <= totalPagesReview.value) {
    currentPageReview.value = page;
  }
};

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
      summaries.value = data;
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
      reviews.value = data;
    } else if (response.status === 401) {
      signout();
    } else {
      console.error("Get Report Review failed");
    }
  } catch (error) {
    console.error("Error fetching review data");
  }
};

const getDownloadLink = (fileName) => {
  return `${import.meta.env.VITE_BASE_URL}files/${fileName}`;
};

const extractFileName = (filePath) => {
  const parts = filePath.split("/");
  return parts[parts.length - 1];
};

const openFileInNewTab = (fileName) => {
  const downloadLink = getDownloadLink(fileName);
  window.open(downloadLink, "_blank");
};

const getCategoryColor = (courseName) => {
  if (courseName.startsWith("GEN")) {
    return "#77D8DD";
  } else if (courseName.startsWith("SSC")) {
    return "#A698F0";
  } else if (courseName.startsWith("INT")) {
    return "#B7DB92";
  } else if (courseName.startsWith("LNG")) {
    return "#FF9F9F";
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

const getFileTypeIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "png":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-png-file-file-extension-fauzidea-flat-fauzidea.png";
    case "jpg":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-jpg-file-file-extension-fauzidea-flat-fauzidea.png";
    case "jpeg":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-jpeg-file-extension-fauzidea-flat-fauzidea.png";
    case "pdf":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-pdf-file-file-extension-fauzidea-flat-fauzidea.png";
    case "doc":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-doc-file-file-extension-fauzidea-flat-fauzidea.png";
    case "docx":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/000000/external-docx-file-file-extension-fauzidea-flat-fauzidea.png";
    case "xls":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-xls-file-file-extension-fauzidea-flat-fauzidea.png";
    case "xlsx":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-xlsx-file-file-extension-fauzidea-flat-fauzidea.png";
    case "zip":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-zip-file-file-extension-fauzidea-flat-fauzidea.png";
    case "pptx":
      return "https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-ppt-file-file-extension-fauzidea-flat-fauzidea.png";

    default:
      return "https://img.icons8.com/external-flat-icons-inmotus-design/67/external-complete-edit-files-flat-icons-inmotus-design.png";
  }
};

const toggleDropdown = (index) => {
  // ตรวจสอบว่า Object มีค่าหรือยัง ถ้าไม่มีให้สร้าง Object ใหม่
  if (!isDropdownOpen.value[index]) {
    isDropdownOpen.value[index] = false;
  }
  isDropdownOpen.value[index] = !isDropdownOpen.value[index];
};

const hidesummary = async (id) => {
  try {
    const confirmed = confirm("Admin ต้องการซ่อนเนื้อหา report ส่วนนี้หรือไม่?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}summary/${id}/hide`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      getreportsummary();
      alert("Admin ซ่อนเนื้อหาแล้ว");

      const currentReviewsCount = summaries.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการซ่อนข้อมูล:", error);
  }
};

const hidereview = async (id) => {
  try {
    const confirmed = confirm("Admin ต้องการซ่อนเนื้อหา report ส่วนนี้หรือไม่?");

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
      getreportreview();
      alert("Admin ซ่อนเนื้อหาแล้ว");
      // window.location.reload();
      const currentReviewsCount = reviews.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการซ่อนข้อมูล:", error);
  }
};

const rejectsummary  = async (id) => {
  if (confirm("Admin ต้องการยกเลิก report เนื้อหานี้หรือไม่?") == true) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportCourseFile/${id}/summary`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200) {
      getreportsummary();
      alert("Admin ยกเลิก report สำเร็จ");

      const currentReviewsCount = summaries.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else console.log("cannot delete");
  }
};

const rejectreview  = async (id) => {
  if (confirm("Admin ต้องการยกเลิก report เนื้อหานี้หรือไม่?") == true) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportReview/${id}/review`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200) {
      getreportreview();
      alert("Admin ยกเลิก report สำเร็จ");
      // window.location.reload();
      const currentReviewsCount = reviews.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else console.log("cannot delete");
  }
};

// const togglePopupSummary = (summaryId) => {
//   showPopup.value = !showPopup.value;
//   if (showPopup.value) {
//     getdetailofreportsummary(summaryId);
//   }
// };

// const togglePopupReview = (reviewId) => {
//   showPopup.value = !showPopup.value;
//   if (showPopup.value) {
//     getdetailofreportreview(reviewId);
//   }
// };

const showPopup = ref(null);

const togglePopupSummary = (summaryId, shouldGetComments = true) => {
  if (showPopup.value === summaryId) {
    showPopup.value = null;
  } else {
    showPopup.value = summaryId;
    if (shouldGetComments) {
      getdetailofreportsummary(summaryId);
    }
  }
};

const togglePopupReview = (reviewId, shouldGetComments = true) => {
  if (showPopup.value === reviewId) {
    showPopup.value = null;
  } else {
    showPopup.value = reviewId;
    if (shouldGetComments) {
      getdetailofreportreview(reviewId);
    }
  }
};

const getdetailofreportsummary = async (summaryId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportCourseFile/${summaryId}/summary/`,
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
      reportofsummary.value = data;
    } else {
      if (response.status === 404) {
        reportofsummary.value = [];
        console.log("No comments found");
      } else {
        console.error("Error: Failed to parse data");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getdetailofreportreview = async (reviewId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportReview/${reviewId}/review/`,
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
      reportofreview.value = data;
    } else {
      if (response.status === 404) {
        reportofreview.value = [];
        console.log("No comments found");
      } else {
        console.error("Error: Failed to parse data");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// const handleDetailReportClicked = (id) => {
//   console.log("Detail report clicked with id:", id);
//   alert(`Detail report clicked with id:, ${id}`);
// };

const switchTab = (tab) => {
  activeTab.value = tab;
  updateButtonColors();
};

const updateButtonColors = () => {
  summaryButtonColor.value =
    activeTab.value === "summary" ? "#FFFFFF" : "#E2E6F4";
  reviewButtonColor.value =
    activeTab.value === "review" ? "#FFFFFF" : "#E2E6F4";
};

const signout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  alert("Token has expired. Please log in again.");
  Login();
};

onBeforeMount(() => {
  activeTab.value = "summary";
  updateButtonColors();
  getreportsummary();
  getreportreview();
});
</script>

<template>
  <div class="container mx-auto mt-28 mt-8 mb-10">
    <div class="line-review"></div>
    <p class="review">Report</p>

    <div class="all">
      <button
        :style="{
          backgroundColor: summaryButtonColor,
          color: activeTab === 'summary' ? '#4675c0' : '#B8BFD6',
        }"
        @click="switchTab('summary')"
        class="font-light tab"
      >
        Summary
        <span class="count" :class="{ inactive: activeTab !== 'summary' }">{{
          summaries.length
        }}</span>
      </button>

      <button
        :style="{
          backgroundColor: reviewButtonColor,
          color: activeTab === 'review' ? '#4675c0' : '#B8BFD6',
        }"
        @click="switchTab('review')"
        class="font-light tab"
      >
        Review
        <span class="count" :class="{ inactive: activeTab !== 'review' }">{{
          reviews.length
        }}</span>
      </button>

      <!-- report summary -->
      <div
        class="box"
        v-if="
          activeTab === 'summary' &&
          summaries.length > 0 &&
          paginatedItemsSummary.length > 0
        "
      >
        <div
          class="report-box"
          v-for="(summary, index) in paginatedItemsSummary"
          :key="summary.id"
        >
          <div class="dropdownreport">
            <img
              class="inforeport"
              src="../assets/info.png"
              @click="() => toggleDropdown(index)"
            />
          </div>

          <div class="dropdown-click">
            <div
              class="absolute right-3 z-12 mt-2 w-32 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              v-if="isDropdownOpen[index]"
            >
              <a
                href="#"
                class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
                @click="hidesummary(summary.id)"
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
                v-if="role === 'staff_group'"
                @click="rejectsummary(summary.id)"
              >
                <svg
                  style="margin-right: 15px; margin-left: 8px; width: 16px"
                  width="20"
                  height="17.273"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#33363F"
                    stroke-width="2"
                  />
                  <path d="M18 18L6 6" stroke="#33363F" stroke-width="2" />
                </svg>

                Reject</a
              >
            </div>
          </div>
          <img src="../assets/student.png" id="profile" />
          <div class="box-title">
            <p class="title_summary">{{ summary.title }}</p>

            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.courseName),
              }"
              v-if="summary.courseName.startsWith('INT')"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.courseName),
              }"
              v-if="summary.courseName.startsWith('GEN')"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.courseName),
              }"
              v-if="summary.courseName.startsWith('SSC')"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.courseName),
              }"
              v-if="summary.courseName.startsWith('LNG')"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <br />
            <svg
              style="margin-right: 13px; width: 18px"
              xmlns="http://www.w3.org/2000/svg"
              width="15.84"
              height="19.87"
              viewBox="0 0 15.84 19.87"
              class="user"
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

            <span class="username">
              {{ summary.emailOwner.slice(0, 5) }}
              <div class="dot"></div>
              <!-- {{ moment(summary.fileCreatedOn).locale("th").fromNow() }} -->
              {{
                moment(summary.fileCreatedOn).diff(moment(), "days") > -7
                  ? moment(summary.fileCreatedOn).locale("th").fromNow()
                  : moment(summary.fileCreatedOn)
                      .locale("th")
                      .format("DD MMMM YYYY")
              }}
            </span>
          </div>
          <p class="filedescription">{{ summary.fileDescription }}</p>

          <p class="filedownload tooltip">
            <a href="#" @click.prevent="openFileInNewTab(summary.fileUpload)">
              <div class="flex items-center space-x-2 ml-4">
                <img
                  width="30"
                  height="30"
                  :src="getFileTypeIcon(summary.fileUpload)"
                />
                <span
                  class="text-sm pl-2"
                  style="color: #4675c1; cursor: pointer"
                >
                  {{ extractFileName(summary.fileUpload).slice(14, 36) }}
                </span>
              </div>
              <span class="tooltip-text">Click To Download File</span>
            </a>
          </p>

          <div
            class="report-detail flex items-center"
            @click="togglePopupSummary(summary.id)"
          >
            <span class="text-sm font-light flex items-center"
              > ({{ summary.reportSummaryCount }}) Report</span
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="33"
              viewBox="0 0 33 33"
              class="arrowreport"
            >
              <g
                id="Icon_feather-arrow-right-circle"
                data-name="Icon feather-arrow-right-circle"
                transform="translate(-1.5 -1.5)"
              >
                <path
                  id="Path_134"
                  data-name="Path 134"
                  d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
                <path
                  id="Path_135"
                  data-name="Path 135"
                  d="M18,24l6-6-6-6"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
                <path
                  id="Path_136"
                  data-name="Path 136"
                  d="M12,18H24"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
              </g>
            </svg>
          </div>

          <div
            v-if="showPopup === summary.id"
            class="popup-container bg-black bg-opacity-20 backdrop-blur-sm"
          >
            <div class="popup">
              <div class="popup-content">
                <div v-if="reportofsummary.length > 0">
                  <div class="comment_header">
                    ({{ reportofsummary.length }}) Reports
                  </div>
                  <div class="line-comment-popup"></div>
                  <div
                    v-for="(report, reportIndex) in reportofsummary"
                    :key="reportIndex"
                  >
                    <div class="detail-comment">
                      <img src="../assets/student.png" id="profile_comment" />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15.84"
                        height="19.87"
                        viewBox="0 0 15.84 19.87"
                        class="user_comment"
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
                      <span class="username-comment">
                        {{ report.emailReportCourseFile.slice(0, 5) }}
                        <div class="dot"></div>
                        <!-- {{
                          moment(report.reportCourseFileCreatedOn)
                            .locale("th")
                            .fromNow()
                        }}  -->
                        {{
                          moment(report.reportCourseFileCreatedOn).diff(
                            moment(),
                            "days"
                          ) > -7
                            ? moment(report.reportCourseFileCreatedOn)
                                .locale("th")
                                .fromNow()
                            : moment(report.reportCourseFileCreatedOn)
                                .locale("th")
                                .format("DD MMMM YYYY")
                        }}
                      </span>

                      <br /><br />
                      <div
                        class="detail-comment-box"
                        v-if="report.inappropriateCourseFile === true"
                      >
                        <span
                          class="bg-red-100 text-red-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-red-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่เหมาะสม</span
                        >
                      </div>
                      <div
                        class="detail-comment-box"
                        v-if="report.notMatchCourseFile === true"
                      >
                        <span
                          class="bg-yellow-100 text-yellow-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-yellow-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่ตรงกับรายวิชา</span
                        >
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Close Button -->
              <div
                class="close-button"
                @click="togglePopupSummary(summary.id, false)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20.426"
                  height="20.423"
                  viewBox="0 0 13.426 13.423"
                >
                  <path
                    id="Icon_ionic-ios-close"
                    data-name="Icon ionic-ios-close"
                    d="M19.589,18l4.8-4.8A1.124,1.124,0,0,0,22.8,11.616l-4.8,4.8-4.8-4.8A1.124,1.124,0,1,0,11.616,13.2l4.8,4.8-4.8,4.8A1.124,1.124,0,0,0,13.2,24.384l4.8-4.8,4.8,4.8A1.124,1.124,0,1,0,24.384,22.8Z"
                    transform="translate(-11.285 -11.289)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <ul class="flex items-center -space-x-px h-8 text-sm">
            <button
              class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              :class="{
                'opacity-50 cursor-not-allowed': currentPageSummary === 1,
              }"
              @click="setPageSummary(currentPageSummary - 1)"
              :disabled="currentPageSummary === 1"
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
              >{{ currentPageSummary }} of {{ totalPagesSummary }}</span
            >
            <button
              class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentPageSummary === totalPagesSummary,
              }"
              @click="setPageSummary(currentPageSummary + 1)"
              :disabled="currentPageSummary === totalPagesSummary"
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
          </ul>
        </div>
      </div>

      <div v-else-if="activeTab === 'summary'" class="box no-data">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="55.678"
          height="48.6"
          viewBox="0 0 55.678 48.6"
          class="nosummary"
        >
          <g id="Exp-2.-F" transform="translate(-4.161 -7.71)">
            <path
              id="Path_19668"
              data-name="Path 19668"
              d="M14.387,32.075V8.71a1,1,0,0,1,1-1H37.941L49.387,20.4V36.355s0,1.215-.1,3.083L43.659,37.4a2,2,0,0,0-1.973.353l-3.032,2.563a2,2,0,0,1-1.841.4L30.839,39l5.769,4.121a2,2,0,0,0,2.412-.066l2.931-2.345A2,2,0,0,1,43.9,40.4l5.176,1.941c-.4,4.314-1.309,9.971-3.4,13.483a1,1,0,0,1-.843.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.469c3.1-6.738,3.33-18.466,3.33-18.466V35.044L18.775,33.4a2,2,0,0,1,1.951.311l2.932,2.345a2,2,0,0,0,2.412.066L31.839,32l-5.974,1.707a2,2,0,0,1-1.841-.4l-3.032-2.563a2,2,0,0,0-1.973-.353Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19669"
              data-name="Path 19669"
              d="M48.579,42.153l.5.2c-.4,4.314-1.309,9.976-3.4,13.49a1,1,0,0,1-.843.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.47l.039-.086c12.314.579,30.2-1.578,32.551-2.5,1.75-.685,3.818-5.465,4.932-10.1Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <g id="Group_29517" data-name="Group 29517">
              <path
                id="Path_19670"
                data-name="Path 19670"
                d="M49.387,20.4a18.052,18.052,0,0,0-9.549-.723,1,1,0,0,1-1.146-1.091A35.724,35.724,0,0,0,37.941,7.71,41.314,41.314,0,0,1,49.387,20.4Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19671"
                data-name="Path 19671"
                d="M6.078,23.778l5,5.87a1,1,0,1,0,1.522-1.3l-5-5.87a1,1,0,1,0-1.522,1.3Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19672"
                data-name="Path 19672"
                d="M6.132,32.5l3.549.951a1,1,0,0,0,.518-1.932L6.65,30.572A1,1,0,0,0,6.132,32.5Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19673"
                data-name="Path 19673"
                d="M5.661,40.729l6.678-3.856a1,1,0,0,0-1-1.732L4.661,39a1,1,0,0,0,1,1.732Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19674"
                data-name="Path 19674"
                d="M57.922,51.214l-5-5.87a1,1,0,1,0-1.522,1.3l5,5.87a1,1,0,1,0,1.522-1.3Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19675"
                data-name="Path 19675"
                d="M57.868,42.489l-3.549-.951A1,1,0,1,0,53.8,43.47l3.549.951a1,1,0,0,0,.518-1.932Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19676"
                data-name="Path 19676"
                d="M58.339,34.264l-6.678,3.855a1,1,0,0,0,1,1.732L59.339,36a1,1,0,1,0-1-1.732Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19677"
                data-name="Path 19677"
                d="M19.864,16.9,23.4,20.436a1,1,0,1,0,1.414-1.415l-3.536-3.535A1,1,0,1,0,19.864,16.9Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19678"
                data-name="Path 19678"
                d="M23.4,15.486l-3.536,3.535a1,1,0,0,0,1.414,1.415L24.814,16.9A1,1,0,1,0,23.4,15.486Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19679"
                data-name="Path 19679"
                d="M30.864,16.9,34.4,20.436a1,1,0,0,0,1.414-1.415l-3.536-3.535A1,1,0,1,0,30.864,16.9Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19680"
                data-name="Path 19680"
                d="M34.4,15.486l-3.536,3.535a1,1,0,0,0,1.414,1.415L35.814,16.9A1,1,0,0,0,34.4,15.486Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19681"
                data-name="Path 19681"
                d="M22.438,26.409l1.4-1.051,1.4,1.05a1,1,0,0,0,1.2,0l1.4-1.05,1.4,1.05a1,1,0,0,0,1.2,0l1.4-1.05,1.4,1.05a1,1,0,1,0,1.2-1.6l-2-1.5a1,1,0,0,0-1.2,0l-1.4,1.05-1.4-1.05a1,1,0,0,0-1.2,0l-1.4,1.05-1.4-1.049a1,1,0,0,0-1.2,0l-2,1.5a1,1,0,1,0,1.2,1.6Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>

        <span>No Report Summary</span>
      </div>

      <!-- ส่วนของกล่อง review -->

      <div class="box" v-if="activeTab === 'review' && reviews.length > 0">
        <div
          class="report-box"
          v-for="(review, index) in paginatedItemsReview"
          :key="review.id"
        >
          <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
          <div class="dropdownreview">
            <img
              class="inforeport"
              src="../assets/info.png"
              @click="() => toggleDropdown(index)"
            />
          </div>

          <div class="dropdown-click">
            <div
              class="absolute right-3 z-12 mt-2 w-32 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              v-if="isDropdownOpen[index]"
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
                v-if="role === 'staff_group'"
                @click="rejectreview(review.id)"

              >
                <svg
                  style="margin-right: 15px; margin-left: 8px; width: 16px"
                  width="20"
                  height="17.273"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#33363F"
                    stroke-width="2"
                  />
                  <path d="M18 18L6 6" stroke="#33363F" stroke-width="2" />
                </svg>

                Reject</a
              >
            </div>
          </div>

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

            <span
              class="course_subject_review"
              :style="{
                backgroundColor: getCategoryColor(review.categoryName),
              }"
              v-if="review.categoryName === 'INT'"
              >{{ review.courseName }} {{ review.courseFullName }}</span
            >
            <span
              class="course_subject_review"
              :style="{
                backgroundColor: getCategoryColor(review.categoryName),
              }"
              v-if="review.categoryName === 'GEN'"
              >{{ review.courseName }} {{ review.courseFullName }}</span
            >
            <span
              class="course_subject_review"
              :style="{
                backgroundColor: getCategoryColor(review.categoryName),
              }"
              v-if="review.categoryName === 'SSC'"
              >{{ review.courseName }} {{ review.courseFullName }}</span
            >
            <span
              class="course_subject_review"
              :style="{
                backgroundColor: getCategoryColor(review.categoryName),
              }"
              v-if="review.categoryName === 'LNG'"
              >{{ review.courseName }} {{ review.courseFullName }}</span
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
                <!-- {{ moment(review.reviewCreatedOn).locale("th").fromNow() }} -->

                {{
                  moment(review.reviewCreatedOn).diff(moment(), "days") > -7
                    ? moment(review.reviewCreatedOn).locale("th").fromNow()
                    : moment(review.reviewCreatedOn)
                        .locale("th")
                        .format("DD MMMM YYYY")
                }}

                <!-- {{
                  moment(review.fileCreatedOn)
                    .locale("th")
                    .format("DD MMMM YYYY")
                }} -->
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

          <div
            class="report-detail-review flex items-center"
            @click="togglePopupReview(review.id)"
          >
            <span class="text-sm font-light flex items-center"
              >({{ review.reportReviewCount }}) Report</span
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="33"
              viewBox="0 0 33 33"
              class="arrowreport"
            >
              <g
                id="Icon_feather-arrow-right-circle"
                data-name="Icon feather-arrow-right-circle"
                transform="translate(-1.5 -1.5)"
              >
                <path
                  id="Path_134"
                  data-name="Path 134"
                  d="M33,18A15,15,0,1,1,18,3,15,15,0,0,1,33,18Z"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
                <path
                  id="Path_135"
                  data-name="Path 135"
                  d="M18,24l6-6-6-6"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
                <path
                  id="Path_136"
                  data-name="Path 136"
                  d="M12,18H24"
                  fill="none"
                  stroke="#d20000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
              </g>
            </svg>
          </div>

          <div
            v-if="showPopup === review.id"
            class="popup-container bg-black bg-opacity-20 backdrop-blur-sm"
          >
            <div class="popup">
              <div class="popup-content">
                <div v-if="reportofreview.length > 0">
                  <div class="comment_header">
                    ({{ reportofreview.length }}) Reports
                  </div>
                  <div class="line-comment-popup"></div>
                  <div
                    v-for="(report, reportIndex) in reportofreview"
                    :key="reportIndex"
                  >
                    <div class="detail-comment">
                      <img src="../assets/student.png" id="profile_comment" />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15.84"
                        height="19.87"
                        viewBox="0 0 15.84 19.87"
                        class="user_comment"
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
                      <span class="username-comment">
                        {{ report.emailReportReview.slice(0, 5) }}
                        <div class="dot"></div>
                        {{
                          moment(report.reportReviewCreatedOn)
                            .locale("th")
                            .fromNow()
                        }} </span
                      ><br /><br />
                      <div
                        class="detail-comment-box"
                        v-if="report.inappropriateReview === true"
                      >
                        <span
                          class="bg-red-100 text-red-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-red-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่เหมาะสม</span
                        >
                      </div>
                      <div
                        class="detail-comment-box"
                        v-if="report.notMatchReview === true"
                      >
                        <span
                          class="bg-yellow-100 text-yellow-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-yellow-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่ตรงกับรายวิชา</span
                        >
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Close Button -->
              <div
                class="close-button"
                @click="togglePopupReview(review.id, false)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20.426"
                  height="20.423"
                  viewBox="0 0 13.426 13.423"
                >
                  <path
                    id="Icon_ionic-ios-close"
                    data-name="Icon ionic-ios-close"
                    d="M19.589,18l4.8-4.8A1.124,1.124,0,0,0,22.8,11.616l-4.8,4.8-4.8-4.8A1.124,1.124,0,1,0,11.616,13.2l4.8,4.8-4.8,4.8A1.124,1.124,0,0,0,13.2,24.384l4.8-4.8,4.8,4.8A1.124,1.124,0,1,0,24.384,22.8Z"
                    transform="translate(-11.285 -11.289)"
                  />
                </svg>
              </div>
            </div>
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
                <div class="box_star">
                  ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
                </div>
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
                <div class="box_star">
                  ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
                </div>
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
                <div class="box_star">
                  ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
                </div>
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
                <div class="box_star">
                  ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
                </div>
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
                <div class="box_star">
                  ⭐&nbsp&nbsp⭐&nbsp&nbsp⭐&nbsp&nbsp⭐
                </div>
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

        <div class="pagination">
          <ul class="flex items-center -space-x-px h-8 text-sm">
            <button
              class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              :class="{
                'opacity-50 cursor-not-allowed': currentPageReview === 1,
              }"
              @click="setPageReview(currentPageReview - 1)"
              :disabled="currentPageReview === 1"
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
              >{{ currentPageReview }} of {{ totalPagesReview }}</span
            >
            <button
              class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentPageReview === totalPagesReview,
              }"
              @click="setPageReview(currentPageReview + 1)"
              :disabled="currentPageReview === totalPagesReview"
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
          </ul>
        </div>
      </div>

      <div v-else-if="activeTab === 'review'" class="box no-data">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="55.678"
          height="48.6"
          viewBox="0 0 55.678 48.6"
          class="nosummary"
        >
          <g id="Exp-2.-F" transform="translate(-4.161 -7.71)">
            <path
              id="Path_19668"
              data-name="Path 19668"
              d="M14.387,32.075V8.71a1,1,0,0,1,1-1H37.941L49.387,20.4V36.355s0,1.215-.1,3.083L43.659,37.4a2,2,0,0,0-1.973.353l-3.032,2.563a2,2,0,0,1-1.841.4L30.839,39l5.769,4.121a2,2,0,0,0,2.412-.066l2.931-2.345A2,2,0,0,1,43.9,40.4l5.176,1.941c-.4,4.314-1.309,9.971-3.4,13.483a1,1,0,0,1-.843.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.469c3.1-6.738,3.33-18.466,3.33-18.466V35.044L18.775,33.4a2,2,0,0,1,1.951.311l2.932,2.345a2,2,0,0,0,2.412.066L31.839,32l-5.974,1.707a2,2,0,0,1-1.841-.4l-3.032-2.563a2,2,0,0,0-1.973-.353Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19669"
              data-name="Path 19669"
              d="M48.579,42.153l.5.2c-.4,4.314-1.309,9.976-3.4,13.49a1,1,0,0,1-.843.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.47l.039-.086c12.314.579,30.2-1.578,32.551-2.5,1.75-.685,3.818-5.465,4.932-10.1Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <g id="Group_29517" data-name="Group 29517">
              <path
                id="Path_19670"
                data-name="Path 19670"
                d="M49.387,20.4a18.052,18.052,0,0,0-9.549-.723,1,1,0,0,1-1.146-1.091A35.724,35.724,0,0,0,37.941,7.71,41.314,41.314,0,0,1,49.387,20.4Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19671"
                data-name="Path 19671"
                d="M6.078,23.778l5,5.87a1,1,0,1,0,1.522-1.3l-5-5.87a1,1,0,1,0-1.522,1.3Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19672"
                data-name="Path 19672"
                d="M6.132,32.5l3.549.951a1,1,0,0,0,.518-1.932L6.65,30.572A1,1,0,0,0,6.132,32.5Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19673"
                data-name="Path 19673"
                d="M5.661,40.729l6.678-3.856a1,1,0,0,0-1-1.732L4.661,39a1,1,0,0,0,1,1.732Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19674"
                data-name="Path 19674"
                d="M57.922,51.214l-5-5.87a1,1,0,1,0-1.522,1.3l5,5.87a1,1,0,1,0,1.522-1.3Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19675"
                data-name="Path 19675"
                d="M57.868,42.489l-3.549-.951A1,1,0,1,0,53.8,43.47l3.549.951a1,1,0,0,0,.518-1.932Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19676"
                data-name="Path 19676"
                d="M58.339,34.264l-6.678,3.855a1,1,0,0,0,1,1.732L59.339,36a1,1,0,1,0-1-1.732Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19677"
                data-name="Path 19677"
                d="M19.864,16.9,23.4,20.436a1,1,0,1,0,1.414-1.415l-3.536-3.535A1,1,0,1,0,19.864,16.9Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19678"
                data-name="Path 19678"
                d="M23.4,15.486l-3.536,3.535a1,1,0,0,0,1.414,1.415L24.814,16.9A1,1,0,1,0,23.4,15.486Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19679"
                data-name="Path 19679"
                d="M30.864,16.9,34.4,20.436a1,1,0,0,0,1.414-1.415l-3.536-3.535A1,1,0,1,0,30.864,16.9Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19680"
                data-name="Path 19680"
                d="M34.4,15.486l-3.536,3.535a1,1,0,0,0,1.414,1.415L35.814,16.9A1,1,0,0,0,34.4,15.486Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
              <path
                id="Path_19681"
                data-name="Path 19681"
                d="M22.438,26.409l1.4-1.051,1.4,1.05a1,1,0,0,0,1.2,0l1.4-1.05,1.4,1.05a1,1,0,0,0,1.2,0l1.4-1.05,1.4,1.05a1,1,0,1,0,1.2-1.6l-2-1.5a1,1,0,0,0-1.2,0l-1.4,1.05-1.4-1.05a1,1,0,0,0-1.2,0l-1.4,1.05-1.4-1.049a1,1,0,0,0-1.2,0l-2,1.5a1,1,0,1,0,1.2,1.6Z"
                fill="#4675c0"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>
        No Report Review
      </div>
    </div>
  </div>
</template>

<style scoped>
.all {
  position: absolute;
  margin-left: 12.5px;
  margin-top: 10px;
}

.tab {
  color: #000000;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 12px;
  cursor: pointer;
  border: none;
  border-radius: 15px 15px 0px 0px;
  height: 50px;
  position: relative;
}

.line-review {
  position: absolute;
  width: 8px;
  height: 39px;
  border-radius: 15px;
  margin-left: 15px;
  background-color: #4675c0;
}

.review {
  margin-left: 40px;
  color: var(--unnamed-color-19335a);
  text-align: left;
  font: normal normal 600 26px/39px Poppins;
  letter-spacing: 1.04px;
  color: #19335a;
  opacity: 1;
  margin-bottom: 20px;
}

.box {
  position: relative;
  width: 1255px;
  /* height: 849px; */
  /* margin-top: 25px; */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 60px;
  padding-bottom: 30px;
  padding-top: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 8px 15px #457aef0d;
  border-radius: 0px 20px 20px 20px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
}

.count {
  margin-left: 5px;
  padding: 4px 10px 4px 10px;
  border-radius: 8px;
  background-color: #4675c0;
  color: white;
  font-size: 13px;
  font-weight: 400;
}

.inactive {
  background-color: #b8bfd6;
  opacity: 0.5;
}

.report-box {
  position: relative;
  width: 1188px;
  /* height: 328px; */
  background: #fafafa 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #efefef;
  border: 1px solid #efefef;
  border-radius: 20px;
  opacity: 1;
  /* margin-top: 10px; */
  margin-bottom: 30px;
  padding: 20px;
  padding-bottom: 30px;
  padding-top: 15px;
  white-space: pre-line; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามตำแหน่งของ "\n" */
  word-wrap: break-word; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามขอบกล่อง */
  overflow: hidden;
}

#profile {
  width: 70px;
  height: 70px;
  margin-left: 10px;
  margin-top: 5px;
}

#profile_comment {
  width: 70px;
  height: 70px;
  float: left;
  margin: 15px;
  margin-left: 20px;
  
}

.title_summary {
  width: auto;
  height: 28px;
  color: var(--unnamed-color-4675c0);
  text-align: left;
  /* font: normal normal 600 20px/30px Poppins; */
  letter-spacing: 0.8px;
  color: #4675c0;
  opacity: 1;
  margin-top: -70px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 600;
}

.filedescription {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font: normal normal light 14px Poppins;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0px;
  color: #697a98;
  opacity: 1;
  margin-left: 15px;
  margin-right: 30px;
  margin-bottom: 18px;
  margin-top: 20px;
}

.filedownload {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #4675c158;
  border-radius: 10px;
  opacity: 1;
  width: 280px;
  height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 15px;
}

.filedownload:hover {
  /* border: 1px solid #4675c158; */
  cursor: pointer;
  border: 1px solid #4675c0;
  background-color: #eef4ff;
}

.box-title {
  margin-top: -75px;
  margin-left: 105px;
}

.username {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0.48px;
  font-size: 12px;
  font-weight: 500;
  color: #697a98;
  opacity: 1;
  margin-left: -8px;
  display: inline-block;
  margin-top: 10px;
}

.username-comment {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font: normal normal medium 12px/18px Poppins;
  letter-spacing: 0.48px;
  font-size: 12px;
  font-weight: 500;
  color: #697a98;
  opacity: 1;
  display: inline-block;
  margin-top: 20px;
  float: left;
  margin-left: -13px;
  /* padding-left: -70%; */
}

.dot {
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

.user {
  width: 12px;
  height: 12px;
  opacity: 1;
  display: flex inline;
  z-index: 1;
}

.user_comment {
  width: 12px;
  height: 12px;
  opacity: 1;
  display: flex inline;
  z-index: 1;
  float: left;
  margin-top: 23px;
  margin-left: 5px;
  margin-right: 20px;
}

.course_subject {
  background-color: #4675c0;
  font-size: 12px;
  font-weight: 100;
  border-radius: 6px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-top: 5px;
  letter-spacing: 0.48px;
  color: white;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  width: 160px;
  background-color: #000000;
  color: #fff;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
  font-size: 11px;
  text-align: center;
  border-radius: 6px;
  padding: 3px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -85px;
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
}

.tooltip-text:after {
  content: "";
  position: absolute;
  bottom: -50%;
  left: 50%;
  margin-left: -8px;
  border-width: 8px;
  border-style: solid;
  border-color: #000000 transparent transparent transparent;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.dropdownreport {
  float: right;
  position: relative;
  margin-top: -10px;
  /* display: inline-block; */
  /* position: relative; */
}

.dropdown-click {
  position: relative;
  top: 30px;
  margin-right: -10px;
  margin-top: 10px;
  z-index: 1;
}

.dropdownreport {
  float: right;
  position: relative;
}

.inforeport {
  width: 40px;
  margin-top: 10px;
  margin-right: 0px;
  margin-left: 35%;
  z-index: 2;
}

.inforeport:hover {
  opacity: 0.5;
  cursor: pointer;
}

.report-detail {
  letter-spacing: 0.8px;
  color: #d20000;
  font-weight: 500;
  /* padding-left: 10px; */
  /* text-decoration: none; */
  width: auto;
  height: 35px;
  /* UI Properties */
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #d20000;
  border-radius: 10px;
  opacity: 1;
  float: right;
  margin-top: 15px;
  margin-right: 15px;
  padding-left: 20px;
  padding-right: 20px;
}

.report-detail:hover {
  background-color: #ffeeee;
  cursor: pointer;
  border: 1px solid #d20000;
}

.report-detail svg {
  width: 20px;
  margin-left: 10px;
}

.report-detail-review {
  letter-spacing: 0.8px;
  color: #d20000;
  font-weight: 500;
  /* padding-left: 10px; */
  /* text-decoration: none; */
  width: auto;
  height: 35px;
  /* UI Properties */
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #d20000;
  border-radius: 10px;
  opacity: 1;
  float: right;
  /* margin-top: 10px; */
  margin-right: 15px;
  margin-right: 30px;
  padding-left: 20px;
  padding-right: 20px;
}

.report-detail-review:hover {
  background-color: #ffeeee;
  cursor: pointer;
  border: 1px solid #d20000;
}

.report-detail-review svg {
  width: 20px;
  margin-left: 10px;
}
.no-data {
  color: #b8bfd6;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
  padding-bottom: 80px;
}

.nosummary {
  width: 15%;
  height: 15%;
  padding-bottom: 30px;
  padding-top: 30px;
}

#profile_review {
  width: 70px;
  height: 70px;
  margin-left: 10px;
  margin-top: 10px;
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
  margin-left: 95px;
  margin-bottom: 8px;
  margin-top: -5px;
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
  /* margin-left: 195px; */
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
  margin-left: 100px;
  margin-top: 10px;
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
  margin-top: -73px;
  margin-right: 30px;
  font-size: 13px;
  font-weight: 400;
  color: #697b98;
  letter-spacing: 0.48px;
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
}

.user_review {
  width: 69px;
  position: relative;
  margin-left: 97px;
  margin-top: 20px;
}

.assignment {
  text-align: left;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  opacity: 1;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-top: 80px;
  color: #b8bfd6;
  width: 97%;
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
  margin-bottom: 0px;
  margin-left: 20px;
  margin-top: 20px;
  width: 97%;
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
  margin-left: 9px;
  margin-right: 8px;
  margin-top: 30px;
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
  margin-top: 60px;
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

.dropdownreview {
  float: right;
  position: relative;
  margin-top: -10px;
  /* display: inline-block; */
  /* position: relative; */
}

.dropdown-click {
  position: relative;
  top: 30px;
  margin-top: 10px;
  z-index: 1;
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

.inforeview {
  width: 40px;
  margin-top: 10px;
  z-index: 2;
}

.inforeview:hover {
  opacity: 0.5;
}

.course_subject {
  background-color: #4675c0;
  font-size: 12px;
  font-weight: 100;
  border-radius: 6px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-top: 5px;
  letter-spacing: 0.48px;
  color: white;
}

.course_subject_review {
  background-color: #4675c0;
  font-size: 12px;
  font-weight: 100;
  border-radius: 6px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 95px;
  letter-spacing: 0.48px;
  color: white;
}

.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  padding: 30px;
  position: relative;
  width: 652px;
  height: 600px;
  padding-bottom: 60px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
  margin-bottom: 30px;
  bottom: 30px;
  overflow: auto;
  top: 2%;
}

.popup-content {
  text-align: center;
}

.detail-comment {
  display: block;
  margin: auto;
  position: relative;
  width: 554px;
  height: auto;
  background: #f7f7fa 0% 0% no-repeat padding-box;
  border: 1px solid #ededed;
  border-radius: 20px;
  opacity: 1;
  margin-bottom: 25px;
  top: 50px;
}

.detail-comment-box {
  /* float: left; */
  color: var(--unnamed-color-697a98);
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0px;
  color: #697a98;
  opacity: 1;
  margin-left: 20%;
  margin-right: 30px;
  /* margin-bottom: 18px; */
  margin-top: 5px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #333;
  padding: 20px;
}

.close-button:hover {
  opacity: 0.5;
}

.comment_header {
  color: var(--unnamed-color-4675c0);
  text-align: left;
  /* font: normal normal 600 20px/30px Poppins; */
  letter-spacing: 0.8px;
  color: #4675c0;
  opacity: 1;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  font: normal normal 600 28px/42px Poppins;
  letter-spacing: 1.12px;
  color: #4675c0;
}

.line-comment-popup {
  background-color: #e6e6e6;
  height: 1px;
  width: 551px;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: 20px;
  transform: translate(-50%, -50%);
}
</style>
