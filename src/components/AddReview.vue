<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import BackNavbar from "./BackNavbar.vue";
import ToastSuccess from "../components/ToastSuccess.vue";
import ToastError from "../components/ToastError.vue";

const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("Add Review Failed");
const successMessage = ref("Add Review Success");

const maxYear = computed(() => new Date().getFullYear());


const hideError = () => {
  showError.value = false;
};

const courses = ref([]);
const gradesReceived = ref("");
const instructorName = ref("");
const ratingOfInteresting = ref("");
const ratingOfGroupWork = ref("");
const ratingOfGradeCollect = ref("");
const ratingOfEasyExam = ref("");
const ratingOfIndividualWork = ref("");
const work = ref("");
const reviewDescription = ref("");
const section = ref("");
const semester = ref("");
const year = ref("");

const email = localStorage.getItem("email");

const hasClickedEditButton = ref(false);

const maxInstructorNameLength = 100;
const maxWorkLength = 500;
const maxReviewDescriptionLength = 1000;

const isInvalidInstructorName = computed(() => {
  return instructorName.value.length > maxInstructorNameLength;
});

const isInvalidWork = computed(() => {
  return work.value.length > maxWorkLength;
});

const isInvalidReviewDescription = computed(() => {
  return reviewDescription.value.length > maxReviewDescriptionLength;
});

onBeforeMount(async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}course/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.status === 200) {
    console.log("You have successfully logged in");

    const data = await response.json();
    courses.value = data;
  } else {
    console.error("Login failed");
  }
});

const addReview = async () => {
  hasClickedEditButton.value = true;

  // Validate before submitting the add
  if (!isInputValid()) {
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },

      body: JSON.stringify({
        gradesReceived: gradesReceived.value,
        instructorName: instructorName.value,
        section: section.value,
        semester: semester.value,
        year: year.value,
        ratingOfInteresting: ratingOfInteresting.value,
        ratingOfGroupWork: ratingOfGroupWork.value,
        ratingOfGradeCollect: ratingOfGradeCollect.value,
        ratingOfEasyExam: ratingOfEasyExam.value,
        ratingOfIndividualWork: ratingOfIndividualWork.value,
        work: work.value,
        reviewDescription: reviewDescription.value,
        courseIdcourse: selectedCourseId.value,
        emailOwner: email,
      }),
    });

    if (response.ok) {
      showSuccess.value = true;
      setTimeout(function () {
        Review();
      }, 1500);
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error("Error adding review:", error);
    alert("An error occurred. Please try again later.", "error");
  }
};

const isInputValid = () => {
  return (
    !isInvalidInstructorName.value &&
    !isInvalidWork.value &&
    !isInvalidReviewDescription.value
  );
};

const selectedCourseName = ref("");
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
  } else {
    isDropdownOpen.value = true;
  }
};


const hideDropdown = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 10);
};


const selectOption = (option) => {
  selectedCourseName.value = `${option.courseName} ${option.courseFullName}`;
  isDropdownOpen.value = false;
};

const filteredCourses = computed(() => {
  const query = selectedCourseName.value.trim().toLowerCase();
  return query
    ? courses.value.filter((course) =>
        `${course.courseName} ${course.courseFullName}`
          .toLowerCase()
          .includes(query)
      )
    : courses.value;
});

const selectedCourseId = computed(() => {
  const selectedName = selectedCourseName.value;
  const selectedCourse = courses.value.find(
    (course) => `${course.courseName} ${course.courseFullName}` === selectedName
  );
  return selectedCourse ? selectedCourse.id : "";
});

const clearForm = () => {
  gradesReceived.value = "";
  section.value = "";
  semester.value = "";
  year.value = "";
  instructorName.value = "";
  ratingOfInteresting.value = "";
  ratingOfGroupWork.value = "";
  ratingOfGradeCollect.value = "";
  ratingOfEasyExam.value = "";
  ratingOfIndividualWork.value = "";
  work.value = "";
  reviewDescription.value = "";
  selectedCourseName.value = "";
};

const appRouter = useRouter();
const Review = () => appRouter.push({ name: "Review" });
</script>

<template>
  <div class="container mx-auto mt-18">
    <div class="toast-container">
      <ToastError
        :showError="showError"
        :errorMessage="errorMessage"
        @hide-error="hideError"
      />
      <ToastSuccess
        :showSuccess="showSuccess"
        :successMessage="successMessage"
      />
    </div>
    <!-- ส่วนของ breadcrumb -->
    <div class="navigation text-gray-600 font-light text-sm mt-8 my-6">
      <span style="color: #b8bfd6"
        >Review &nbsp;
        <span style="color: #4675c1"> > &nbsp; Add Review </span>
      </span>
    </div>

    <div class="add-boxs">
      <div class="flex-container">
        <div class="line-review"></div>
        <p class="review">Add Review</p>
      </div>

      <form @submit.prevent="addReview" class="form-container">
        <div class="input-group">
          <label for="courseIdcourse" class="lable"
            >Course <span style="font-size: 12px">( รายวิชา )</span></label
          ><br />
          <!-- <input
            v-model.trim="selectedCourseName"
            list="coursesList"
            placeholder="ค้นหารายวิชา ..."
            required
            class="dropdown"
          />
          <datalist id="coursesList">
            <option
              v-for="course in courses"
              :key="course.id"
              :value="`${course.courseName} ${course.courseFullName}`"
            ></option>
          </datalist> -->
          <input
            class="dropdown"
            type="text"
            v-model="selectedCourseName"
            placeholder="Search Course ..."
            @focus="toggleDropdown"
          />
          <ul v-if="isDropdownOpen" class="ul_list">
            <li
              class="list_course"
              v-for="course in filteredCourses"
              :key="course.id"
              @click="selectOption(course)"
            >
              {{ course.courseName }} {{ course.courseFullName }}
            </li>
            <li v-if="filteredCourses.length === 0" class="list_no_course">
              <p>No course found</p>
            </li>
          </ul>
        </div>

        <div class="input-group">
          <label for="gradesReceived" class="lable"
            >Grades Received
            <span style="font-size: 12px">( เกรดที่ได้รับ )</span></label
          ><br />
          <select v-model="gradesReceived" required class="dropdown">
            <!-- <option value="">เกรดที่ได้รับ</option> -->
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

        <div class="input-group">
          <label for="instructorName" class="lable"
            >Section
            <span style="color: #4675c1; font-size: 12px"
              >( optional )</span
            ></label
          >
          <br />

          <input
            v-model="section"
            type="number"
            class="dropdown"
          />
        </div>

        <div class="input-group">
          <label for="instructorName" class="lable"
            >Semester
            <span style="font-size: 12px">( ภาคการศึกษาที่เรียน )</span></label
          ><br />

          <select v-model="semester" required class="dropdown">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div class="input-group">
          <label for="instructorName" class="lable"
            >Year <span style="font-size: 12px">( ปีที่เรียน )</span></label
          >
          <br />

          <input
            v-model="year"
            type="number"
            required
            placeholder="ห้ามน้อยกว่าปี 2015"
            class="dropdown"
            :min="2015"
            :max="maxYear"
          />
        </div>

        <div class="input-group">
          <label for="instructorName" class="lable"
            >Instructor Name
            <span style="font-size: 12px">( อาจารย์ผู้สอน )</span></label
          ><span
            v-if="hasClickedEditButton && isInvalidInstructorName"
            class="error-tooltip"
          >
            * Maximum 100 characters allowed
          </span>
          <br />

          <input
            v-model.trim="instructorName"
            type="text"
            required
            placeholder="ex. อาจารย์สยาม"
            class="dropdown"
            :style="{
              border:
                isInvalidInstructorName && hasClickedEditButton
                  ? '1px solid red'
                  : '',
            }"
          />
        </div>

        <div class="input-group">
          <label for="work" class="lable"
            >Assignment
            <span style="font-size: 12px">( งานที่มอบหมาย )</span></label
          ><span
            v-if="hasClickedEditButton && isInvalidWork"
            class="error-tooltip"
          >
            * Maximum 500 characters allowed </span
          ><br />
          <input
            v-model.trim="work"
            required
            placeholder="ex. ได้รับงานทั้งหมด 3 งาน"
            class="dropdown"
            :style="{
              border:
                isInvalidWork && hasClickedEditButton ? '1px solid red' : '',
            }"
          />
        </div>

        <div class="input-group">
          <label for="reviewDescription" class="lable"
            >Review Description
            <span style="font-size: 12px">( รายละเอียดรีวิว )</span></label
          ><span
            v-if="hasClickedEditButton && isInvalidReviewDescription"
            class="error-tooltip"
          >
            * Maximum 1000 characters allowed </span
          ><br />
          <input
            v-model.trim="reviewDescription"
            required
            placeholder="ex. อาจารย์ผู้สอนอธิบายงานเข้าใจ"
            class="dropdown"
            :style="{
              border:
                isInvalidReviewDescription && hasClickedEditButton
                  ? '1px solid red'
                  : '',
            }"
          />
        </div>

        <div class="input-group">
          <label for="rating" class="lable"
            >Rating Of Interesting
            <span style="font-size: 12px">( เนื้อหามีความน่าสนใจ )</span></label
          ><br />
          <select v-model="ratingOfInteresting" required class="dropdown">
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div class="input-group">
          <label for="rating" class="lable"
            >Working As Individual Work
            <span style="font-size: 12px">( เน้นการทำงานเดี่ยว )</span></label
          ><br />
          <select v-model="ratingOfIndividualWork" required class="dropdown">
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div class="input-group">
          <label for="rating" class="lable"
            >Rating As Group Work
            <span style="font-size: 12px">( เน้นการทำงานกลุ่ม )</span></label
          ><br />
          <select v-model="ratingOfGroupWork" required class="dropdown">
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div class="input-group">
          <label for="rating" class="lable"
            >Grade Collection Subjects
            <span style="font-size: 12px">( วิชาเก็บเกรด )</span></label
          ><br />
          <select v-model="ratingOfGradeCollect" required class="dropdown">
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div class="input-group">
          <label for="rating" class="lable"
            >Easy To Exam
            <span style="font-size: 12px">( ข้อสอบไม่ยาก )</span></label
          ><br />
          <select v-model="ratingOfEasyExam" required class="dropdown">
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>

        <div class="input-group"></div>

        <button
          type="submit"
          class="addReview"
          :disabled="
            !gradesReceived ||
            !semester ||
            !year ||
            !instructorName ||
            !ratingOfInteresting ||
            !ratingOfGroupWork ||
            !ratingOfGradeCollect ||
            !ratingOfEasyExam ||
            !ratingOfIndividualWork ||
            !work ||
            !reviewDescription ||
            !selectedCourseId
          "
        >
          Add Review
        </button>

        <button
          type="button"
          class="button-clear"
          @click="clearForm"
          :disabled="
            !gradesReceived &&
            !section &&
            !semester &&
            !year &&
            !instructorName &&
            !ratingOfInteresting &&
            !ratingOfGroupWork &&
            !ratingOfGradeCollect &&
            !ratingOfEasyExam &&
            !ratingOfIndividualWork &&
            !work &&
            !reviewDescription &&
            !selectedCourseId
          "
        >
          Clear
        </button>
      </form>
    </div>
  </div>

  <BackNavbar :backToPage="{ name: 'Review' }" />
</template>

<style scoped>
.navigation {
  margin-top: 35px;
  /* margin-left: 10px; */
  font: normal normal 400 14px/22px Poppins;
  letter-spacing: 0.28px;
  margin-left: 190px;
}

.dropdown[style*="border: 1px solid red"] {
  border: 1px solid red !important;
}

button {
  background-color: #4675c1;
  color: #fff;
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;
}

.addReview {
  margin-top: 20px;
  margin-left: 36%;
  background-color: #4675c1;
  height: 40px;
  width: 120px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: white;
}

.button-clear {
  background-color: white;
  border: solid 1px #4675c0;
  height: 40px;
  width: 120px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: #4675c0;
  margin-top: -40px;
  margin-left: 52%;
}

.button-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.addReview:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-boxs {
  display: flex;
  background-color: #4675c1;
  width: 900px;
  height: auto;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
  margin: auto;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 30px;
  margin-bottom: 10%;
}

.line-review {
  position: absolute;
  width: 8px;
  height: 39px;
  border-radius: 15px;
  margin-left: 45px;
  margin-top: 30px;
  background-color: #4675c0;
}

.review {
  color: var(--unnamed-color-19335a);
  text-align: left;
  font: normal normal 600 26px/39px Poppins;
  letter-spacing: 1.04px;
  color: #19335a;
  opacity: 1;
  margin-top: 30px;
  margin-left: 70px;
  margin-bottom: 20px;
}

.lable {
  letter-spacing: 0.28px;
  color: #697a98;
  opacity: 1;
  margin-left: 45px;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 40%;
}

.dropdown {
  margin-top: 8px;
  padding-left: 15px;
  width: 350px;
  height: 40px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
}

.dropdown::placeholder {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.5;
}

.dropdown:valid {
  font-size: 14px;
  font-weight: 500;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.input-group {
  width: 44%; /* You can adjust the width based on your preference */
  margin-right: 50px;
  /* background-color: #19335a; */
}

.input-group input,
.input-group select,
.input-group textarea {
  margin-right: 30px;
  margin-bottom: 20px;
  margin-left: 45px;
}

.error-border {
  border: 1px solid red !important;
}

.error-tooltip {
  margin-left: 45px;
  font-weight: 100;
  font-size: 10px;
  color: red;
  display:inline-block;
  
}

.toast-container {
  position: fixed;
  top: 20px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.ul_list {
  background-color: #ffffff;
  position: absolute;
  z-index: 2;
  width: 350px;
  border: 2px solid #265DC5;
  border-radius: 8px;
  margin-left: 45px;
  margin-top: -13px;
  height: 145px;
  overflow: auto;
  
}

.list_no_course{
  color: #b8bfd6;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.56px;
  padding-left: 15px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  margin-top: 55px;
}

.list_course {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #000000;
  padding-left: 15px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 0.5px solid #e3edff;
}

.list_course:hover {
  background-color: #eef4ff;
  cursor: pointer;
  border-radius: 3px;
  color: #265DC5;
  font-weight: 800;
}

</style>
