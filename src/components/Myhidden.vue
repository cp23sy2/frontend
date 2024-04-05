<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";

const reviews = ref([]);
const summarys = ref([]);
const activeTab = ref("summary");
const summaryButtonColor = ref("#3498db");
const reviewButtonColor = ref("#3498db");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");
const comments = ref([]);
const commentofsummary = ref([]);
const hideofsummary = ref([]);
const hideofreview = ref([]);
const isDropdownOpen = ref([]);

const toggleDropdown = (index) => {
  // ตรวจสอบว่า Object มีค่าหรือยัง ถ้าไม่มีให้สร้าง Object ใหม่
  if (!isDropdownOpen.value[index]) {
    isDropdownOpen.value[index] = false;
  }
  isDropdownOpen.value[index] = !isDropdownOpen.value[index];
};


const currentPageSummary = ref(1);
const currentPageReview = ref(1);
const itemsPerPage = ref(10);

const paginatedItemsSummary = computed(() => {
  const start = (currentPageSummary.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return summarys.value.slice(start, end);
});

const paginatedItemsReview = computed(() => {
  const start = (currentPageReview.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return reviews.value.slice(start, end);
});

const totalItemsSummary = computed(() => {
  return summarys.value.length;
});

const totalItemsReview = computed(() => {
  return reviews.value.length;
});

const totalPagesSummary = computed(() =>
  Math.ceil(totalItemsSummary.value / itemsPerPage.value)
);

const totalPagesReview = computed(() =>
  Math.ceil(totalItemsReview.value / itemsPerPage.value)
);

const setPageSummary = (page) => {
  if (page >= 1 && page <= totalPagesSummary.value) {
    currentPageSummary.value = page;
  }
};

const setPageReview = (page) => {
  if (page >= 1 && page <= totalPagesReview.value) {
    currentPageReview.value = page;
  }
};

const showPopuphide = ref(null);

const togglePopupSummary = (summaryId, shouldGetComments = true) => {
  if (showPopuphide.value === summaryId) {
    showPopuphide.value = null;
  } else {
    showPopuphide.value = summaryId;
    if (shouldGetComments) {
      getdetailhideofsummary(summaryId);
    }
  }
};

const togglePopupReview = (reviewId, shouldGetComments = true) => {
  if (showPopuphide.value === reviewId) {
    showPopuphide.value = null;
  } else {
    showPopuphide.value = reviewId;
    if (shouldGetComments) {
      getdetailhideofreview(reviewId);
    }
  }
};

const showPopup = ref(null);

const togglePopup = (summaryId, shouldGetComments = true) => {
  if (showPopup.value === summaryId) {
    showPopup.value = null;
  } else {
    showPopup.value = summaryId;
    if (shouldGetComments) {
      getcommentofsummary(summaryId);
    }
  }
};

const getdetailhideofsummary = async (summaryId) => {
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
      hideofsummary.value = data;
    } else {
      if (response.status === 404) {
        hideofsummary.value = [];
        console.log("No comments found");
      } else {
        console.error("Error: Failed to parse data");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getdetailhideofreview = async (reviewId) => {
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
      hideofreview.value = data;
    } else {
      if (response.status === 404) {
        hideofreview.value = [];
        console.log("No comments found");
      } else {
        console.error("Error: Failed to parse data");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getcommentofsummary = async (summaryId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}comment/${summaryId}/summary/`,
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
      commentofsummary.value = data.content;
      // console.log(commentofsummary);
    } else {
      if (response.status === 404) {
        commentofsummary.value = [];
        console.log("No comments found");
      } else {
        console.error("Error: Failed to parse data");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getsummary = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}summary/hidden`,
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
      summarys.value = data;
      //   summarys.value = data.filter((summary) => !summary.hide);
    }
    if (response.status === 401) {
      signout();
    }
  } catch (error) {
    console.error("Error fetching summary data:", error);
  }
};

const getreview = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}review/hidden`,
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
      //   reviews.value = data.filter((review) => !review.hide);
    } else {
      console.error("Get Review failed");
    }
  } catch (error) {
    console.error("Error fetching review data:", error);
  }
};

const hidesummary = async (id) => {
  try {
    const confirmed = confirm(
      "Admin ต้องการยกเลิกซ่อนเนื้อหา summary ส่วนนี้หรือไม่?"
    );

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
      getsummary();
      alert("Admin ยกเลิกการซ่อนเนื้อหาแล้ว");

      const currentReviewsCount = summarys.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการยกเลิกซ่อนข้อมูล:", error);
  }
};

const hidereview = async (id) => {
  try {
    const confirmed = confirm(
      "Admin ต้องการยกเลิกซ่อนเนื้อหา report ส่วนนี้หรือไม่?"
    );

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
      getreview();
      alert("Admin ยกเลิกการซ่อนเนื้อหาแล้ว");
      // window.location.reload();
      const currentReviewsCount = reviews.value.length;
      if (currentReviewsCount === 1) {
        window.location.reload();
      }
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการยกเลิกซ่อนข้อมูล:", error);
  }
};

const getDownloadLink = (fileName) => {
  return `${import.meta.env.VITE_BASE_URL}files/${fileName}`;
};

const openFileInNewTab = (fileName) => {
  const downloadLink = getDownloadLink(fileName);
  window.open(downloadLink, "_blank");
};

const extractFileName = (filePath) => {
  const parts = filePath.split("/");
  return parts[parts.length - 1];
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

onBeforeMount(() => {
  activeTab.value = "summary";
  updateButtonColors();
  getsummary();
  getreview();
});

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

const getCategoryColor = (categoryName) => {
  switch (categoryName) {
    case "GEN":
      return "#77D8DD";
    case "SSC":
      return "#A698F0";
    case "INT":
      return "#B7DB92";
    case "LNG":
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
  <div class="container mx-auto mt-28 mt-8 mb-10">
    <div class="line-review"></div>
    <p class="review">Hidden</p>

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
          summarys.length
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

      <!-- ส่วนของกล่อง summary -->
      <div
        class="box"
        v-if="
          activeTab === 'summary' &&
          summarys.length > 0 &&
          paginatedItemsSummary.length > 0
        "
      >

        <div
          class="review-box"
          v-for="(summary, index) in paginatedItemsSummary"
          :key="summary.id"
        >

         <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
      <div class="dropdownreview" v-if="role === 'staff_group'">
            <img
              class="inforeport"
              src="../assets/info.png"
              @click="() => toggleDropdown(index)"
            />
          </div>

          <div class="dropdown-click">
            <div
              class="absolute right-3 z-12 mt-2 w-46 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              v-if="isDropdownOpen[index]"
            >
              <a
                href="#"
                class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
                @click="hidesummary(summary.id)"
                >
              <svg
                  style="margin-right: 10px; margin-left: 2px; width: 16px"
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

                Cancle Hide</a
              >
              </div>
          </div>

          <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
          <div class="dropdown">
            <div
              class="report-detail flex items-center"
              @click="togglePopupSummary(summary.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
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
              </svg>
              <span class="text-sm font-light flex items-center">Detail</span>
            </div>
          </div>

          <div
            v-if="showPopuphide === summary.id"
            class="popup-container bg-black bg-opacity-20 backdrop-blur-sm"
          >
            <div class="popup">
              <div class="popup-content">
                <div v-if="hideofsummary.length > 0">
                  <div class="comment_header">Detail Hidden</div>
                  <div class="line-comment-popup"></div>
                  <div
                    v-for="(hide, hideIndex) in hideofsummary"
                    :key="hideIndex"
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
                      <span class="username-comment" v-if="role === 'st_group'">
                       {{ hide.emailReportCourseFile }}
                      </span>

                      <span
                        class="username-comment"
                        v-if="role === 'staff_group'"
                      >
                        {{ hide.emailReportCourseFile.slice(0, 5) }}
                        <div class="dot"></div>

                        {{
                          moment(hide.reportCourseFileCreatedOn).diff(
                            moment(),
                            "days"
                          ) > -7
                            ? moment(hide.reportCourseFileCreatedOn)
                                .locale("th")
                                .fromNow()
                            : moment(hide.reportCourseFileCreatedOn)
                                .locale("th")
                                .format("DD MMMM YYYY")
                        }}
                      </span>

                      <br /><br />
                      <div
                        class="detail-comment-box"
                        v-if="hide.inappropriateCourseFile === true"
                      >
                        <span
                          class="bg-red-100 text-red-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-red-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่เหมาะสม</span
                        >
                      </div>
                      <div
                        class="detail-comment-box"
                        v-if="hide.notMatchCourseFile === true"
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

                <div v-else>
                  <div class="comment_header">Detail Hidden</div>
                  <div class="line-comment-popup"></div>

                  <div class="detail-hidden-admin">
                    โพสต์ของคุณถูกซ่อนโดย admin เนื่องจาก <br />
                    <span style="font-weight: 500; color: #d20000"
                      >มีเนื้อหาที่ไม่เหมาะสม</span
                    >
                    หรือ
                    <span style="font-weight: 500; color: #d20000"
                      >เนื้อหาไม่ตรงกับรายวิชา</span
                    >
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

          <!-- ส่วนของ summary แต่ละกล่อง -->
          <img src="../assets/student.png" id="profile" />
          <div class="box-title">
            <p class="title_summary">{{ summary.title }}</p>

            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.categoryName),
              }"
              v-if="summary.categoryName === 'INT'"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.categoryName),
              }"
              v-if="summary.categoryName === 'GEN'"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.categoryName),
              }"
              v-if="summary.categoryName === 'SSC'"
              >{{ summary.courseName }} {{ summary.courseFullName }}</span
            >
            <span
              class="course_subject"
              :style="{
                backgroundColor: getCategoryColor(summary.categoryName),
              }"
              v-if="summary.categoryName === 'LNG'"
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

              <!-- {{
                moment(summary.fileCreatedOn)
                  .locale("th")
                  .format("DD MMMM YYYY")
              }} -->
            </span>
          </div>
          <p class="filedescription">{{ summary.fileDescription }}</p>

          <p class="filedownload tooltip">
            <!-- <a :href="getDownloadLink(summary.fileUpload)" download> -->
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
            class="count_comment flex items-center"
            @click="togglePopup(summary.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <g id="Icon-Set">
                <path
                  id="comment-2"
                  d="M161,269.625a9.1,9.1,0,0,1-1.9-.206l-2.648,1.592.035-2.609a6.52,6.52,0,0,1-3.361-5.526c0-3.728,3.526-6.75,7.875-6.75s7.875,3.022,7.875,6.75-3.526,6.75-7.875,6.75ZM161,255c-4.97,0-9,3.526-9,7.875a7.537,7.537,0,0,0,3.375,6.142V273l3.943-2.392a10.324,10.324,0,0,0,1.682.142c4.97,0,9-3.526,9-7.875S165.97,255,161,255Zm3.938,6.188h-7.875a.563.563,0,0,0,0,1.125h7.875a.563.563,0,0,0,0-1.125Zm-1.125,3.375h-5.625a.563.563,0,0,0,0,1.125h5.625a.563.563,0,0,0,0-1.125Z"
                  transform="translate(-152 -255)"
                  fill="#4675c0"
                  fill-rule="evenodd"
                />
              </g>
            </svg>
            <span class="text-sm font-light flex items-center">{{
              summary.commentCount
            }}</span>
          </div>

          <!-- comment popup -->
          <div
            v-if="showPopup === summary.id"
            class="popup-container bg-black bg-opacity-20 backdrop-blur-sm"
          >
            <div class="popup">
              <div class="popup-content">
                <div v-if="commentofsummary.length > 0">
                  <div class="comment_header">
                    ({{ commentofsummary.length }}) Comments
                  </div>
                  <div class="line-comment-popup"></div>
                  <div
                    v-for="(comment, commentIndex) in commentofsummary"
                    :key="commentIndex"
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
                        {{ comment.emailOwner.slice(0, 5) }}
                        <div class="dot"></div>
                        <!-- {{
                          moment(comment.commentCreatedOn)
                            .locale("th")
                            .fromNow()
                        }} -->

                        {{
                          moment(comment.commentCreatedOn).diff(
                            moment(),
                            "days"
                          ) > -7
                            ? moment(comment.commentCreatedOn)
                                .locale("th")
                                .fromNow()
                            : moment(comment.commentCreatedOn)
                                .locale("th")
                                .format("DD MMMM YYYY")
                        }}

                        <!-- {{
                          moment(summary.fileCreatedOn)
                            .locale("th")
                            .format("DD MMMM YYYY")
                        }} --> </span
                      ><br /><br />
                      <div class="detail-comment-box">
                        {{ comment.commentDetail }}
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="comment_header">
                    ({{ commentofsummary.length }}) Comment
                  </div>
                  <div class="line-no-comment-popup"></div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="61"
                    height="51.516"
                    viewBox="0 0 61 51.516"
                    class="no_comment"
                  >
                    <g id="Exp-2.-F" transform="translate(-1 -5.742)">
                      <path
                        id="Path_19708"
                        data-name="Path 19708"
                        d="M27,9.677a1,1,0,0,1,1-1H50.554L62,21.37V37.323s.036,13.177-3.707,19.468a1,1,0,0,1-.842.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.47C26.773,49.051,27,37.323,27,37.323Z"
                        fill="#cadcf0"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Path_19709"
                        data-name="Path 19709"
                        d="M62,37.323s.036,13.177-3.707,19.468a1,1,0,0,1-.842.464c-3.827,0-26.548,0-32.9,0a1,1,0,0,1-.882-1.47l.039-.086c12.314.579,30.2-1.578,32.551-2.5,2.516-.985,5.69-10.437,5.739-15.755Z"
                        fill="#a4bbdb"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Path_19710"
                        data-name="Path 19710"
                        d="M62,21.37a18.063,18.063,0,0,0-9.549-.724,1,1,0,0,1-1.146-1.09,35.733,35.733,0,0,0-.751-10.879A41.33,41.33,0,0,1,62,21.37Z"
                        fill="#4675c1"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Path_19711"
                        data-name="Path 19711"
                        d="M27,12.068a12.551,12.551,0,0,1,9.313,18.725l1.647,5.223a.721.721,0,0,1-.177.727l-.14.14a.678.678,0,0,1-.682.166l-5.249-1.655a12.5,12.5,0,0,1-4.728,1.58c.012-.331.016-.513.016-.513Z"
                        fill="#a4bbdb"
                        fill-rule="evenodd"
                      />
                      <path
                        id="Path_19712"
                        data-name="Path 19712"
                        d="M30.447,34.168a12,12,0,1,1,4.4-4.4l1.574,4.994a.687.687,0,0,1-.169.694l-.134.134a.648.648,0,0,1-.652.16Z"
                        fill="#e9f3fc"
                        fill-rule="evenodd"
                      />
                      <g id="Group_29520" data-name="Group 29520">
                        <path
                          id="Path_19713"
                          data-name="Path 19713"
                          d="M22.333,20.182a2.371,2.371,0,0,1,.888-2.057,2.18,2.18,0,0,1,2.868.18,2.127,2.127,0,0,1,.483,1.433,4.863,4.863,0,0,1-1.346,3.2,7.559,7.559,0,0,0-1.919,4.466,1,1,0,0,0,2,.109,5.7,5.7,0,0,1,1.516-3.367,6.7,6.7,0,0,0,1.752-4.427,4.074,4.074,0,0,0-.987-2.745,4.226,4.226,0,0,0-5.551-.462,4.3,4.3,0,0,0-1.7,3.714,1,1,0,0,0,2-.047Z"
                          fill="#4675c1"
                          fill-rule="evenodd"
                        />
                        <circle
                          id="Ellipse_1620"
                          data-name="Ellipse 1620"
                          cx="1.23"
                          cy="1.23"
                          r="1.23"
                          transform="translate(22.982 29.714)"
                          fill="#4675c1"
                        />
                        <path
                          id="Path_19714"
                          data-name="Path 19714"
                          d="M12.217,7.364l4,5.032a1,1,0,1,0,1.566-1.244l-4-5.032a1,1,0,0,0-1.566,1.244Z"
                          fill="#4675c1"
                          fill-rule="evenodd"
                        />
                        <path
                          id="Path_19715"
                          data-name="Path 19715"
                          d="M1.5,9.867l10.452,6a1,1,0,1,0,.995-1.734L2.5,8.133a1,1,0,0,0-1,1.734Z"
                          fill="#4675c1"
                          fill-rule="evenodd"
                        />
                        <path
                          id="Path_19716"
                          data-name="Path 19716"
                          d="M3,21h7a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"
                          fill="#4675c1"
                          fill-rule="evenodd"
                        />
                      </g>
                    </g>
                  </svg>

                  <p class="no-comment-text">No comments</p>
                </div>
              </div>

              <!-- Close Button -->
              <div
                class="close-button"
                @click="togglePopup(summary.idCourse_File, false)"
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
          width="50.493"
          height="59.146"
          viewBox="0 0 50.493 59.146"
          class="nosummary"
        >
          <g id="Exp-2.-F" transform="translate(-6.754 -2.383)">
            <path
              id="Path_19876"
              data-name="Path 19876"
              d="M52,35.617H12V54.129a2,2,0,0,0,1.425,1.916l18,5.4a2.01,2.01,0,0,0,1.15,0l18-5.4A2,2,0,0,0,52,54.129V35.617Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19877"
              data-name="Path 19877"
              d="M52,35.617H32s-.194,25.912,0,25.912a2.011,2.011,0,0,0,.575-.084l18-5.4A2,2,0,0,0,52,54.129V35.617Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <path
              id="Path_19878"
              data-name="Path 19878"
              d="M32,42.106,12,35.617,6.925,43.141a1,1,0,0,0,.52,1.511l18,5.846a1,1,0,0,0,1.137-.39Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19879"
              data-name="Path 19879"
              d="M52,35.617,32,42.106l5.423,8a1,1,0,0,0,1.137.39l17.995-5.846a1,1,0,0,0,.52-1.511L52,35.617Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19880"
              data-name="Path 19880"
              d="M27.159,21.986a1,1,0,0,0-1.136-.388l-18,5.847a1,1,0,0,0-.52,1.51L12,35.617l20-6.511Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19881"
              data-name="Path 19881"
              d="M56.493,28.955a1,1,0,0,0-.52-1.51l-18-5.847a1,1,0,0,0-1.136.388L32,29.106l20,6.511,4.493-6.662Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19882"
              data-name="Path 19882"
              d="M52,35.617,32,29.106,12,35.617l20,6.489Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19883"
              data-name="Path 19883"
              d="M32,42.106v-13L12,35.617Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <g id="Group_29532" data-name="Group 29532">
              <path
                id="Path_19884"
                data-name="Path 19884"
                d="M27.982,31.978a8.757,8.757,0,0,1-1.124-.868,1,1,0,1,0-1.352,1.473,10.672,10.672,0,0,0,1.382,1.069,1,1,0,0,0,1.094-1.674Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19885"
                data-name="Path 19885"
                d="M24.866,28.906a8.689,8.689,0,0,1-.754-1.213,1,1,0,1,0-1.783.907,10.74,10.74,0,0,0,.927,1.492,1,1,0,1,0,1.61-1.186Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19886"
                data-name="Path 19886"
                d="M23.4,24.825a4.628,4.628,0,0,1,.177-1.169,1,1,0,0,0-1.923-.551,6.71,6.71,0,0,0-.254,1.67,1,1,0,0,0,2,.05Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19887"
                data-name="Path 19887"
                d="M24.942,21.485a5.908,5.908,0,0,1,.86-.657,1,1,0,1,0-1.067-1.692,7.855,7.855,0,0,0-1.152.882,1,1,0,0,0,1.359,1.467Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19888"
                data-name="Path 19888"
                d="M28.661,19.76a11.338,11.338,0,0,1,1.6-.176,1,1,0,0,0-.085-2,13.5,13.5,0,0,0-1.877.208,1,1,0,0,0,.364,1.967Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19889"
                data-name="Path 19889"
                d="M33.873,19.7c.853.01,1.647-.02,2.384-.085a1,1,0,1,0-.177-1.992c-.675.059-1.4.087-2.184.077a1,1,0,0,0-.023,2Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19890"
                data-name="Path 19890"
                d="M39.544,19a10.307,10.307,0,0,0,2.526-1.136,1,1,0,1,0-1.075-1.687,8.3,8.3,0,0,1-2.036.91A1,1,0,0,0,39.544,19Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19891"
                data-name="Path 19891"
                d="M44.634,15.068a6.21,6.21,0,0,0,.607-3,1,1,0,0,0-2,.093,4.215,4.215,0,0,1-.41,2.04,1,1,0,1,0,1.8.87Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19892"
                data-name="Path 19892"
                d="M44,8.529a4.738,4.738,0,0,0-2.8-1.892,1,1,0,0,0-.4,1.96A2.737,2.737,0,0,1,42.39,9.72,1,1,0,1,0,44,8.529Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
            </g>
            <path
              id="Path_19893"
              data-name="Path 19893"
              d="M30.933,6.831c1.082-6.127,10.459-5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19894"
              data-name="Path 19894"
              d="M30.933,8.383c1.082,6.126,10.459,5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19895"
              data-name="Path 19895"
              d="M30.843,8.617h6.7a1,1,0,0,0,0-2h-6.7a1,1,0,1,0,0,2Z"
              fill="#4675c1"
              fill-rule="evenodd"
            />
          </g>
        </svg>
        <span>No Summary Hidden</span>
      </div>

      <!-- ส่วนของกล่อง review -->

      <div class="box" v-if="activeTab === 'review' && reviews.length > 0">
        <div
          class="review-box"
          v-for="(review, index) in paginatedItemsReview"
          :key="review.id"
        >

         <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
      <div class="dropdownreview" v-if="role === 'staff_group'">
            <img
              class="inforeport"
              src="../assets/info.png"
              @click="() => toggleDropdown(index)"
            />
          </div>

          <div class="dropdown-click">
            <div
              class="absolute right-3 z-12 mt-2 w-46 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              v-if="isDropdownOpen[index]"
            >
              <a
              @click="hidereview(review.id)"
                href="#"
                class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              >
              <svg
                  style="margin-right: 10px; margin-left: 2px; width: 16px"
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

                Cancle Hide</a
              >
              </div>
          </div>
          <!-- ส่วนของ dropdown เพื่อจะแก้ไข + ลบ -->
          <div class="dropdown">
            <div
              class="hidereview-detail flex items-center"
              @click="togglePopupReview(review.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
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
              </svg>
              <span class="text-sm font-light flex items-center">Detail</span>
            </div>
          </div>

          <div
            v-if="showPopuphide === review.id"
            class="popup-container bg-black bg-opacity-20 backdrop-blur-sm"
          >
            <div class="popup">
              <div class="popup-content">
                <div v-if="hideofreview.length > 0">
                  <div class="comment_header">Detail Hidden</div>
                  <div class="line-comment-popup"></div>
                  <div
                    v-for="(hide, hideIndex) in hideofreview"
                    :key="hideIndex"
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
                      <span class="username-comment" v-if="role === 'st_group'">
                        {{ hide.emailReportReview }}
                      </span>
                      <span
                        class="username-comment"
                        v-if="role === 'staff_group'"
                      >
                        {{ hide.emailReportReview.slice(0, 5) }}
                        <div class="dot"></div>

                        {{
                          moment(hide.reportReviewCreatedOn).diff(
                            moment(),
                            "days"
                          ) > -7
                            ? moment(hide.reportReviewCreatedOn)
                                .locale("th")
                                .fromNow()
                            : moment(hide.reportReviewCreatedOn)
                                .locale("th")
                                .format("DD MMMM YYYY")
                        }}
                      </span>

                      <br /><br />
                      <div
                        class="detail-comment-box"
                        v-if="hide.inappropriateReview === true"
                      >
                        <span
                          class="bg-red-100 text-red-600 text-xs font-small me-2 px-2.5 py-0.5 rounded-md border border-red-400 pt-1 pb-1 pl-3 pr-3"
                          >เนื้อหาไม่เหมาะสม</span
                        >
                      </div>
                      <div
                        class="detail-comment-box"
                        v-if="hide.notMatchReview === true"
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

                <div v-else>
                  <div class="comment_header">Detail Hidden</div>
                  <div class="line-comment-popup"></div>

                  <div class="detail-hidden-admin">
                    โพสต์ของคุณถูกซ่อนโดย admin เนื่องจาก <br />
                    <span style="font-weight: 500; color: #d20000"
                      >มีเนื้อหาที่ไม่เหมาะสม</span
                    >
                    หรือ
                    <span style="font-weight: 500; color: #d20000"
                      >เนื้อหาไม่ตรงกับรายวิชา</span
                    >
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
          width="50.493"
          height="59.146"
          viewBox="0 0 50.493 59.146"
          class="nosummary"
        >
          <g id="Exp-2.-F" transform="translate(-6.754 -2.383)">
            <path
              id="Path_19876"
              data-name="Path 19876"
              d="M52,35.617H12V54.129a2,2,0,0,0,1.425,1.916l18,5.4a2.01,2.01,0,0,0,1.15,0l18-5.4A2,2,0,0,0,52,54.129V35.617Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19877"
              data-name="Path 19877"
              d="M52,35.617H32s-.194,25.912,0,25.912a2.011,2.011,0,0,0,.575-.084l18-5.4A2,2,0,0,0,52,54.129V35.617Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <path
              id="Path_19878"
              data-name="Path 19878"
              d="M32,42.106,12,35.617,6.925,43.141a1,1,0,0,0,.52,1.511l18,5.846a1,1,0,0,0,1.137-.39Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19879"
              data-name="Path 19879"
              d="M52,35.617,32,42.106l5.423,8a1,1,0,0,0,1.137.39l17.995-5.846a1,1,0,0,0,.52-1.511L52,35.617Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19880"
              data-name="Path 19880"
              d="M27.159,21.986a1,1,0,0,0-1.136-.388l-18,5.847a1,1,0,0,0-.52,1.51L12,35.617l20-6.511Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19881"
              data-name="Path 19881"
              d="M56.493,28.955a1,1,0,0,0-.52-1.51l-18-5.847a1,1,0,0,0-1.136.388L32,29.106l20,6.511,4.493-6.662Z"
              fill="#e9f3fc"
              fill-rule="evenodd"
            />
            <path
              id="Path_19882"
              data-name="Path 19882"
              d="M52,35.617,32,29.106,12,35.617l20,6.489Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19883"
              data-name="Path 19883"
              d="M32,42.106v-13L12,35.617Z"
              fill="#a4bbdb"
              fill-rule="evenodd"
            />
            <g id="Group_29532" data-name="Group 29532">
              <path
                id="Path_19884"
                data-name="Path 19884"
                d="M27.982,31.978a8.757,8.757,0,0,1-1.124-.868,1,1,0,1,0-1.352,1.473,10.672,10.672,0,0,0,1.382,1.069,1,1,0,0,0,1.094-1.674Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19885"
                data-name="Path 19885"
                d="M24.866,28.906a8.689,8.689,0,0,1-.754-1.213,1,1,0,1,0-1.783.907,10.74,10.74,0,0,0,.927,1.492,1,1,0,1,0,1.61-1.186Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19886"
                data-name="Path 19886"
                d="M23.4,24.825a4.628,4.628,0,0,1,.177-1.169,1,1,0,0,0-1.923-.551,6.71,6.71,0,0,0-.254,1.67,1,1,0,0,0,2,.05Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19887"
                data-name="Path 19887"
                d="M24.942,21.485a5.908,5.908,0,0,1,.86-.657,1,1,0,1,0-1.067-1.692,7.855,7.855,0,0,0-1.152.882,1,1,0,0,0,1.359,1.467Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19888"
                data-name="Path 19888"
                d="M28.661,19.76a11.338,11.338,0,0,1,1.6-.176,1,1,0,0,0-.085-2,13.5,13.5,0,0,0-1.877.208,1,1,0,0,0,.364,1.967Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19889"
                data-name="Path 19889"
                d="M33.873,19.7c.853.01,1.647-.02,2.384-.085a1,1,0,1,0-.177-1.992c-.675.059-1.4.087-2.184.077a1,1,0,0,0-.023,2Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19890"
                data-name="Path 19890"
                d="M39.544,19a10.307,10.307,0,0,0,2.526-1.136,1,1,0,1,0-1.075-1.687,8.3,8.3,0,0,1-2.036.91A1,1,0,0,0,39.544,19Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19891"
                data-name="Path 19891"
                d="M44.634,15.068a6.21,6.21,0,0,0,.607-3,1,1,0,0,0-2,.093,4.215,4.215,0,0,1-.41,2.04,1,1,0,1,0,1.8.87Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
              <path
                id="Path_19892"
                data-name="Path 19892"
                d="M44,8.529a4.738,4.738,0,0,0-2.8-1.892,1,1,0,0,0-.4,1.96A2.737,2.737,0,0,1,42.39,9.72,1,1,0,1,0,44,8.529Z"
                fill="#4675c1"
                fill-rule="evenodd"
              />
            </g>
            <path
              id="Path_19893"
              data-name="Path 19893"
              d="M30.933,6.831c1.082-6.127,10.459-5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19894"
              data-name="Path 19894"
              d="M30.933,8.383c1.082,6.126,10.459,5.731,5,0Z"
              fill="#cadcf0"
              fill-rule="evenodd"
            />
            <path
              id="Path_19895"
              data-name="Path 19895"
              d="M30.843,8.617h6.7a1,1,0,0,0,0-2h-6.7a1,1,0,1,0,0,2Z"
              fill="#4675c1"
              fill-rule="evenodd"
            />
          </g>
        </svg>
        No Review Hidden
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  width: 40px;
  margin-top: -10px;
  margin-right: 0px;
  margin-left: 40%;
  z-index: 2;
}

.info:hover {
  opacity: 0.5;
}

.all {
  position: absolute;
  margin-left: 10px;
  margin-top: 10px;
}

.tab {
  color: #000000;
  font-size: 16px;
  padding-left: 20px;
  padding-right: 20px;
  /* margin-bottom: 10px; */
  /* margin-top: 15px; */
  /* margin-left: 5px; */
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

.review-box {
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
  white-space: pre-line; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามตำแหน่งของ "\n" */
  word-wrap: break-word; /* ทำให้ข้อความขึ้นบรรทัดใหม่ตามขอบกล่อง */
  overflow: hidden;
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

.line-comment {
  background-color: #e6e6e6;
  height: 1px;
  width: 95%;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: 25px;
  transform: translate(-50%, -50%);
}

.input-comment {
  margin-left: 15px;
  margin-top: 50px;
  padding-left: 15px;
  width: 100%;
  height: 50px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
  margin-bottom: 5px;
}

.input-comment::placeholder {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.5;
}

.input-comment:valid {
  font-size: 14px;
  font-weight: 500;
}

.button-sendcomment {
  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  background-color: #4675c0;
  height: 50px;
  width: 140px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: white;
  margin-left: 15px;
  margin-top: 50px;
  padding: 10px;
  padding-right: 50px;
  padding-left: 12px;
}

.button-sendcomment:hover {
  background-color: #2152a0;
}

.button-sendcomment svg {
  margin-right: 10px;
  margin-left: 5px;
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

.dropdown-click {
  position: relative;
  top: 30px;
  margin-right: -15px;
  z-index: 1;
}

.nosummary {
  width: 15%;
  height: 15%;
  padding-bottom: 20px;
  padding-top: 30px;
}

.no-data {
  color: #b8bfd6;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
  padding-bottom: 80px;
}

.box-comment {
  display: flex;
  width: 99%;
}

.count_comment {
  letter-spacing: 0.8px;
  color: #4675c0;
  font-weight: 500;
  /* padding-left: 10px; */
  /* text-decoration: none; */
  width: auto;
  height: 35px;
  /* UI Properties */
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #4675c158;
  border-radius: 10px;
  opacity: 1;
  float: right;
  margin-top: 15px;
  margin-right: 15px;
  padding-left: 5px;
  padding-right: 15px;
}

.count_comment:hover {
  background-color: #eef4ff;
  cursor: pointer;
  border: 1px solid #4675c0;
}

.count_comment svg {
  margin-right: 8px;
  margin-left: 12px;
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

.detail-hidden-admin {
  display: block;
  margin: auto;
  position: relative;
  width: 554px;
  height: auto;
  /* background: #f7f7fa 0% 0% no-repeat padding-box;
  border: 1px solid #ededed; */
  border-radius: 20px;
  opacity: 1;
  margin-bottom: 25px;
  top: 160px;
  padding: 50px;
  font-size: 20px;
  color: #666;
  margin-bottom: 50px;
  color: #697a98;
  font: normal normal 400 18px/22px Anuphan;
  letter-spacing: 1px;
  line-height: 40px;
}

.edit-comment {
  height: 40px;
  width: 100px;
  /* border-radius: 10px; */
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #19335a;
  margin-right: 70px;
  margin-left: 60px;
}

.edit-comment:hover {
  opacity: 0.5;
}

.delete-comment {
  height: 40px;
  width: 100px;
  /* border-radius: 10px; */
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #19335a;
  margin-right: 55px;
  margin-left: 90px;
}

.delete-comment:hover {
  opacity: 0.5;
}

.save-comment {
  height: 40px;
  width: 100px;
  /* border-radius: 10px; */
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #19335a;
  margin-right: 55px;
  margin-left: 90px;
}

.save-comment:hover {
  opacity: 0.5;
}

.cancle-comment {
  height: 40px;
  width: 100px;
  /* border-radius: 10px; */
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #19335a;
  margin-right: 55px;
  margin-left: 110px;
}

.cancle-comment:hover {
  opacity: 0.5;
}

.line-edit-delete {
  background-color: #ffffff;
  height: 30px;
  width: 2px;
}

.button-edit-delete {
  width: 554px;
  height: 46px;
  background: #ececf2 0% 0% no-repeat padding-box;
  border-radius: 0px 0px 20px 20px;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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

.edit-detail-comment-box {
  color: var(--unnamed-color-697a98);
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0px;
  color: #697a98;
  opacity: 1;
  margin-right: 30px;
  /* margin-bottom: 18px; */
  margin-top: 20px;
  width: 70%;
  height: 35px;
  padding: 10px;
  border-radius: 8px;
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

.line-no-comment-popup {
  background-color: #e6e6e6;
  height: 1px;
  width: 551px;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: 20px;
  transform: translate(-50%, -50%);
}

.no_comment {
  width: 40%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 25%;
  margin-top: 120px;
}

.no-comment-text {
  color: #b8bfd6;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
  padding-bottom: 80px;
  margin-top: 30px;
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
  padding-bottom: 25px;
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
  margin-left: 95px;
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
  margin-right: -100px;
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

.report-detail {
  letter-spacing: 0.8px;
  color: #d20000;
  font-weight: 500;
  /* padding-left: 10px; */
  /* text-decoration: none; */
  width: auto;
  height: 35px;
  /* UI Properties */
  /* box-shadow: 0px 0px 15px #457aef0d; */
  border: 1px solid #d20000;
  padding-right: 10px;
  border-radius: 10px;
  opacity: 1;
  float: right;
  margin-top:5px;
  margin-right: 13px;
}

.report-detail:hover {
  opacity: 0.5;
  cursor: pointer;
}

.report-detail svg {
  /* background-color: #2152a0; */
  padding-left: 10px;
  padding-right: 10px;
  height: 40px;
  width: 40px;
}

.hidereview-detail {
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
  padding-right: 10px;
  border-radius: 10px;
  opacity: 1;
  float: right;
  margin-top: 90px;
  margin-right: 10px;
}

.hidereview-detail:hover {
  opacity: 0.5;
  cursor: pointer;
}

.hidereview-detail svg {
  /* background-color: #2152a0; */
  padding-left: 10px;
  padding-right: 10px;
  height: 40px;
  width: 40px;
}

.inforeport {
  width: 40px;
  margin-top: 12px;
  margin-right: 0px;
  margin-left: 35%;
  z-index: 2;
}

.inforeport:hover {
  opacity: 0.5;
  cursor: pointer;
}

.dropdownreview {
  float: right;
  position: relative;
  margin-top: -10px;
  margin-left: -20px;
  /* display: inline-block; */
  /* position: relative; */
}

</style>
