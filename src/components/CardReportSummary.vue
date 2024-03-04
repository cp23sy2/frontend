<script setup>
import { ref, defineEmits } from "vue";
import moment from "moment";

import { defineProps } from "vue";

const emits = defineEmits(["detail-report-clicked"]);

const props = defineProps({
  summaries: {
    type: Array,
    required: true,
  },
});

const role = localStorage.getItem("role");


// const handleDetailReportClick = (id) => {
//   emits("detail-report-clicked", id);
// };

const handleDetailReportClicked = (id) => {
  console.log('Detail report clicked with id:', id);
  alert(`Detail report clicked with id:, ${id}`)
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

const isDropdownOpen = ref([]);

const toggleDropdown = (index) => {
  // ตรวจสอบว่า Object มีค่าหรือยัง ถ้าไม่มีให้สร้าง Object ใหม่
  if (!isDropdownOpen.value[index]) {
    isDropdownOpen.value[index] = false;
  }
  isDropdownOpen.value[index] = !isDropdownOpen.value[index];
};

const deletes = (id) => {
  alert(`Delete id: ${id}`);
};
</script>

<template>
  <div
    class="report-box"
    v-for="(summary, index) in summaries"
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
          @click="deletes(summary.id)"
          v-if="role === 'staff_group'"
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
              @click="deletes(summary.id)"
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
      ><br />
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
          <span class="text-sm pl-2" style="color: #4675c1; cursor: pointer">
            {{ extractFileName(summary.fileUpload).slice(14, 36) }}
          </span>
        </div>
        <span class="tooltip-text">Click To Download File</span>
      </a>
    </p>

    <div
      class="report-detail flex items-center"
      @click="handleDetailReportClicked(summary.id)"
    >

      <span class="text-sm font-light flex items-center">Detail Report</span>
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
  </div>
</template>

<style scope>
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
  padding-top: 10px;
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
  margin-left: 10px;
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

</style>
