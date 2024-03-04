<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onBeforeMount, computed, onMounted, watch } from "vue";
import moment from "moment";
import BackNavbar from "./BackNavbar.vue";
import ToastSuccess from "../components/ToastSuccess.vue";
import ToastError from "../components/ToastError.vue";
import PopupReport from "../components/PopupReport.vue";
const params = useRoute().params;

const summarys = ref([]);
const course = ref([]);
const showNoData = ref(false);
const isDropdownOpen = ref([]);
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");
const commentofsummary = ref([]);
const comments = ref([]);
// const showPopup = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("Add Comment Failed");
const successMessage = ref();
const filteredSummarys = ref([]);
const searchQuery = ref("");

const hideError = () => {
  showError.value = false;
};

const hideSuccess = () => {
  showSuccess.value = false;
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



// const isPopupVisible = ref(false);

// const openPopupReport = () => {
//   isPopupVisible.value = true;
// };

// const closePopup = () => {
//   isPopupVisible.value = false;
// };

// report -----------------------------------------------------------
const idreport = ref(); //ค่า id summary ที่จะส่งไป report

const isPopupVisible = ref(false);

const closePopup = () => {
  isPopupVisible.value = false;
};

const openPopupReport = (summaryId) => {
  idreport.value = summaryId;
  isPopupVisible.value = true;
};

const handleSelectedOption = async (option) => {
  console.log("Selected option:", option.value);
  console.log("Selected option:", option.selected);
  console.log("Selected summaryid:", idreport.value);

  let data = {};
  if (option.value === "1") {
    data = {
      inappropriateCourseFile: option.selected,
      notMatchCourseFile: false,
      emailReportCourseFile: email,
      courseFileIdcourseFile: idreport.value,
    };
  } else if (option.value === "2") {
    data = {
      inappropriateCourseFile: false,
      notMatchCourseFile: option.selected,
      emailReportCourseFile: email,
      courseFileIdcourseFile: idreport.value,
    };
  }

  // api report -----------------------------------------------------------

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}ReportCourseFile`,
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
      console.log("Report Summary success");
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
  Math.ceil(filteredSummarys.value.length / itemsPerPage)
);
const paginatedSummarys = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredSummarys.value.slice(startIndex, endIndex);
});

const updatePage = (direction) => {
  if (direction === "prev" && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === "next" && currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// const isSearchDisabled = computed(() => searchQuery.value === "");

// const filterData = () => {
//   // กรองข้อมูลตาม Title Summary
//   const filteredSummarys = summarys.value.filter((summary) =>
//     summary.title.toLowerCase().includes(searchQuery.value.toLowerCase())
//   );

//   // อัปเดต summarys ที่ได้รับผลกรอง
//   summarys.value = filteredSummarys;

//   // รีเซ็ตหน้าปัจจุบันเพื่อที่จะแสดงผลข้อมูลใหม่หลังจากการกรอง
//   currentPage.value = 1;
// };

const clearFilter = () => {
  // รีเซ็ตคำค้นหา
  searchQuery.value = "";

  // รีเซ็ตข้อมูลกรองและแสดงข้อมูลทั้งหมด
  fetchSummary();
  currentPage.value = 1;
};

const filterData = () => {
  if (searchQuery.value === "") {
    clearFilter();
  }
  filteredSummarys.value = summarys.value.filter((summary) =>
    `${summary.title}`.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  currentPage.value = 1;
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

const editComment = (comment) => {
  comment.isEditing = true;
  comment.editingComment = comment.commentDetail;
};

const saveComment = async (commentId, newComment) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          commentDetail: newComment,
        }),
      }
    );

    if (response.status === 200) {
      console.log("Comment updated successfully");
      const editedComment = commentofsummary.value.find(
        (comment) => comment.id === commentId
      );
      if (editedComment) {
        editedComment.commentDetail = newComment;
        editedComment.isEditing = false;
      }
    } else {
      console.error("Failed to update comment");
    }
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

const cancelEdit = (comment) => {
  comment.isEditing = false;
};

const sendComment = async (index, summaryId) => {
  const commentValue = comments.value[index];

  if (commentValue.trim() !== "") {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          commentDetail: commentValue,
          courseFileIdcourseFile: summaryId,
          emailOwner: email,
        }),
      });

      if (response.status === 201) {
        console.log("Comment posted successfully");
        comments.value[index] = "";
        successMessage.value = "Add Comment Success";
        showSuccess.value = true;
        setTimeout(() => {
          hideSuccess();
        }, 1500);
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  } else {
    console.log("Comment is empty");
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

const fetchSummary = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}course/${params.courseid}/summary`,
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
        summarys.value = data;
        filteredSummarys.value = data;

        isDropdownOpen.value = Array(summarys.value.length).fill(false);

        // if (searchQuery.value !== "") {
        //   filterData();
        // }
      } else {
        console.error("Error: Failed to parse data");
      }
    } else {
      console.error("Error:", response.status);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onBeforeMount(async () => {
  try {
    const responsesummary = await fetch(
      `${import.meta.env.VITE_BASE_URL}course/${params.courseid}/summary`,
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

    if (responsesummary.status === 401 || responsecourse.status === 401) {
      signout();
      return;
    }

    const data_summary = await responsesummary.json();
    const data_course = await responsecourse.json();

    if (data_summary) {
      summarys.value = data_summary;
      filteredSummarys.value = data_summary;
    } else {
      console.error("Error: Failed to fetch summary data");
    }
    course.value = data_course;
    isDropdownOpen.value = Array(summarys.value.length).fill(false);

    setTimeout(() => {
      showNoData.value = true;
    }, 10);
  } catch (error) {
    console.error("Error in onBeforeMount:", error);
  }
  await fetchSummary();
});

const toggleDropdown = (index) => {
  if (isDropdownOpen.value && isDropdownOpen.value[index] !== undefined) {
    isDropdownOpen.value[index] = !isDropdownOpen.value[index];
  }
};

const deleteSummary = async (id, index) => {
  if (confirm("You want to delete") == true) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}summary/${id}`,
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
      alert("Delete!!!", `You delete summary success`, "success");

      // setTimeout(function () {
      //   summarys.value = summarys.value.filter((e) => e.idCourse_File !== id);
      // }, 500);   
      
      setTimeout(function () {
        const indexToDelete = summarys.value.findIndex((e) => e.idCourse_File === id);
        if (indexToDelete !== -1) {
          summarys.value.splice(indexToDelete, 1);
        }
      }, 500);


    } else console.log("cannot delete");
  }
};

const deletecomment = async (id) => {
  if (confirm("You want to delete comment") == true) {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}comment/${id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (response.status === 200) {
      alert("Delete!!!", `You delete summary success`, "success");

      commentofsummary.value = commentofsummary.value.filter(
        (e) => e.id !== id
      );
    } else console.log("cannot delete");
  }
};

const hidesummary = async (id) => {
  try {
    const confirmed = confirm("คุณแน่ใจหรือไม่ที่ต้องการซ่อนข้อมูลนี้?");

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
      fetchSummary();
      alert("ซ่อนข้อมูลสำเร็จ");
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการซ่อนข้อมูล:", error);
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
        >Summary &nbsp;
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
          <p class="second">Title Summary</p>

          <input
            v-model.trim="searchQuery"
            placeholder="Search title ..."
            class="dropdowns-search"
            required
          />
        </div>

        <div class="button-2">
          <button @click="filterData" class="button-search">Search</button>
          <button @click="clearFilter" class="button-clear">Clear</button>
        </div>
      </div>
    </div>

    <!-- ส่วนของกรอบ box -->
    <div class="box" v-if="paginatedSummarys.length > 0">
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
        v-for="(summary, index) in paginatedSummarys"
        :key="summary.id"
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
                name: 'EditSummary',
                params: { summaryid: summary.idCourse_File },
              }"
              tag="a"
              class="text-gray-700 block px-4 py-2.5 text-sm font-light flex items-center hover:bg-gray-100 dark dark:hover:bg-gray-200"
              v-if="role === 'st_group' && summary.emailOwner === email"
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
              @click="() => deleteSummary(summary.idCourse_File, index)"
              v-if="role === 'st_group' && summary.emailOwner === email"
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
              @click="hidesummary(summary.idCourse_File)"
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
              v-if="role === 'st_group' && email !== summary.emailOwner"
              @click="() => openPopupReport(summary.idCourse_File, index)"
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

        <!-- ส่วนของ summary แต่ละกล่อง -->
        <img src="../assets/student.png" id="profile" />
        <div class="box-title">
          <p class="title_summary">{{ summary.title }}</p>
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
            {{ moment(summary.fileCreatedOn).locale("th").fromNow() }}

            <!-- {{
              moment(summary.fileCreatedOn).diff(moment(), "days") > -7
                ? moment(summary.fileCreatedOn).locale("th").fromNow()
                : moment(summary.fileCreatedOn)
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
          @click="togglePopup(summary.idCourse_File)"
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
          <span class="text-sm font-light flex items-center">Comment</span>
        </div>

        <!-- comment popup -->
        <div v-if="showPopup === summary.idCourse_File" class="popup-container bg-black bg-opacity-20 backdrop-blur-sm" >
          <div class="popup">
            <div class="popup-content">
              <div v-if="commentofsummary.length > 0">
                <div class="line-comment-popup"></div>
                <div class="comment_header">
                  ({{ commentofsummary.length }}) Comments
                </div>
                <div
                  v-for="(comment, commentIndex) in commentofsummary"
                  :key="commentIndex"
                >
                  <div v-if="comment.isEditing" class="detail-comment">
                    <img src="../assets/student.png" id="profile_comment" />

                    <input
                      class="edit-detail-comment-box"
                      v-model.trim="comment.editingComment"
                    /><br />

                    <div
                      class="button-edit-delete flex items-center"
                      v-if="role === 'st_group' && email === comment.emailOwner"
                    >
                      <button
                        v-if="
                          role === 'st_group' && email === comment.emailOwner
                        "
                        class="save-comment flex items-center"
                        @click="saveComment(comment.id, comment.editingComment)"
                      >
                        Save
                      </button>
                      <div class="line-edit-delete"></div>
                      <button
                        v-if="
                          role === 'st_group' && email === comment.emailOwner
                        "
                        class="cancle-comment flex items-center"
                        @click="cancelEdit(comment)"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div class="detail-comment" v-else>
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
                        moment(summary.fileCreatedOn)
                          .locale("th")
                          .format("DD MMMM YYYY")
                      }} -->

                      {{
                        moment(comment.commentCreatedOn).locale("th").fromNow()
                      }} </span
                    ><br /><br />
                    <div class="detail-comment-box">
                      {{ comment.commentDetail }}
                    </div>
                    <br />

                    <div
                      class="button-edit-delete flex items-center"
                      v-if="
                        role === 'staff_group' ||
                        (role === 'st_group' && email === comment.emailOwner)
                      "
                    >
                      <button
                        v-if="
                          role === 'st_group' && email === comment.emailOwner
                        "
                        class="edit-comment flex items-center"
                        @click="editComment(comment)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19.5"
                          height="18.94"
                          viewBox="0 0 19.5 18.94"
                          style="
                            margin-right: 10px;
                            margin-left: 8px;
                            width: 16px;
                          "
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
                      </button>

                      <div
                        class="line-edit-delete"
                        v-if="
                          role === 'st_group' && email === comment.emailOwner
                        "
                      ></div>

                      <button
                        v-if="
                          role === 'staff_group' ||
                          (role === 'st_group' && email === comment.emailOwner)
                        "
                        class="delete-comment flex items-center"
                        @click="deletecomment(comment.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18.458"
                          height="20"
                          viewBox="0 0 18.458 20"
                          style="
                            margin-right: 10px;
                            margin-left: 8px;
                            width: 15px;
                          "
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
                        Delete
                      </button>
                    </div>
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
              <div class="close-button" @click="togglePopup(summary.idCourse_File, false)">
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

        <div class="box-comment-1" v-if="role === 'st_group'">
          <p class="line-comment"></p>

          <form @submit.prevent="sendComment(index, summary.idCourse_File)">
            <div class="box-comment">
              <input
                placeholder="แสดงความคิดเห็น . . ."
                class="input-comment"
                v-model.trim="comments[index]"
                required
              />
              <button class="button-sendcomment">
                <svg
                  id="Send"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20.756"
                  height="20.69"
                  viewBox="0 0 25.756 25.69"
                >
                  <path
                    id="Fill-1"
                    d="M11.63,15.57l4.83,7.817a.663.663,0,0,0,.675.32.671.671,0,0,0,.571-.489l6.04-20.348a.686.686,0,0,0-.176-.692A.678.678,0,0,0,22.894,2L2.479,7.966a.7.7,0,0,0-.172,1.257l7.927,4.944,7-7.059A.99.99,0,0,1,18.647,8.5Zm5.4,10.121a2.639,2.639,0,0,1-2.259-1.267L9.653,16.135,1.257,10.9a2.67,2.67,0,0,1,.664-4.827L22.337.108A2.667,2.667,0,0,1,25.644,3.43L19.6,23.777A2.636,2.636,0,0,1,17.4,25.665a2.878,2.878,0,0,1-.366.025Z"
                    transform="translate(0 0)"
                    fill="#fff"
                    fill-rule="evenodd"
                  />
                </svg>
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>

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
        <p>No Summary</p>
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
  height: auto;
  /* UI Properties */
  background: #fafafa 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 5px #efefef;
  border: 1px solid #efefef;
  border-radius: 20px;
  opacity: 1;
  margin-top: 10px;
  margin-bottom: 20px;
  /* padding: 0; */
}

.box {
  margin-bottom: 100px;
}

.dropdown {
  float: right;
  position: relative;
  /* display: inline-block; */
}

.dropdown-click {
  position: relative;
  top: 40px;
  margin-top: 10px;
  margin-right: 10px;
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

.dropdowns-search::placeholder {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.5;
}

.dropdowns-search:valid {
  font-size: 14px;
  font-weight: 500;
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
.filter-container {
  display: flex;
  gap: 30px;
}

.filter-item {
  /* flex: 1; */
  margin-right: -20px;
}

.filter-item button {
  /* flex: 1; */
  margin-left: 50px;
}
.spinner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}
/* .search {
  position: absolute;
  left: 50%;
  right: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  width: 1255px;
  height: 175px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
} */

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

#profile {
  width: 70px;
  height: 70px;
  margin-left: 30px;
  margin-top: 20px;
}

.title_summary {
  top: 510px;
  left: 207px;
  /* width: 169px; */
  /* height: 28px; */
  color: var(--unnamed-color-4675c0);
  text-align: left;
  /* font: normal normal 600 20px/30px Poppins; */
  letter-spacing: 0.8px;
  color: #4675c0;
  opacity: 1;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 3px;
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
  margin-left: 35px;
  margin-right: 30px;
  margin-bottom: 18px;
  margin-top: 25px;
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
  margin-left: 35px;
  margin-bottom: 30px;
}

.filedownload:hover {
  /* border: 1px solid #4675c158; */
  cursor: pointer;
  border: 1px solid #4675c0;
  background-color: #eef4ff;
}

.box-title {
  margin-top: -65px;
  margin-left: 125px;
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
  margin-top: -20px;
  margin-left: -8px;
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

.line-comment {
  background-color: #e6e6e6;
  height: 1px;
  width: 95%;
  position: absolute;
  left: 50%;
  right: 50%;
  /* margin-top: 20px; */
  transform: translate(-50%, -50%);
}

.input-comment {
  margin-left: 35px;
  margin-top: 25px;
  padding-left: 15px;
  width: 81.5%;
  height: 50px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
  margin-bottom: 30px;
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
  margin-top: 25px;
  padding: 10px;
  padding-right: 50px;
  padding-left: 12px;
}

.button-sendcomment svg {
  margin-right: 10px; /* เพิ่ม margin ระหว่าง SVG กับข้อความ */
  margin-left: 5px;
}

.button-sendcomment:hover {
  background-color: #2152a0;
}

/* .button-sendcomment svg {
  margin-left: 18px;
} */

.box-comment {
  display: flex;
}

.count_comment {
  letter-spacing: 0.8px;
  color: #4675c0;
  font-weight: 500;
  /* padding-left: 10px; */
  /* text-decoration: none; */
  width: 130px;
  height: 35px;
  /* UI Properties */
  box-shadow: 0px 0px 15px #457aef0d;
  border: 1px solid #4675c158;
  border-radius: 10px;
  opacity: 1;
  float: right;
  margin-top: 20px;
  margin-right: 30px;
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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
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
  overflow: auto;
  top: 0%;
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
  /* overflow: auto; */
  margin-bottom: 25px;
  top: 50px;
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
  margin-top: 60px;
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

#profile_comment {
  width: 70px;
  height: 70px;
  float: left;
  margin: 15px;
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

  margin-left: -12px;
  /* padding-left: -70%; */
}

.user_comment {
  width: 12px;
  height: 12px;
  opacity: 1;
  display: flex inline;
  z-index: 1;
  float: left;
  margin-top: 23px;
  margin-left: 10px;
  margin-right: 20px;
  /* margin-right: -50px; */
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
</style>
