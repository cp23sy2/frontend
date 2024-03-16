<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import Spinner from "../components/Spinner.vue";

const courses = ref([]);
const loading = ref(false);

const filteredCourses = ref([]);
const searchQuery = ref("");
const filterCriteria = ref("all");
const role = localStorage.getItem("role");

const currentPage = ref(1);
const itemsPerPage = 9;

const totalPages = computed(() =>
  Math.ceil(filteredCourses.value.length / itemsPerPage)
);
const paginatedCourses = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredCourses.value.slice(startIndex, endIndex);
});

const updatePage = (direction) => {
  if (direction === "prev" && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === "next" && currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onBeforeMount(async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}course/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      courses.value = data;
      filteredCourses.value = data;
      // totalPages.value = data.totalPages;
    } else if (response.status === 401) {
      signout();
    } else {
      console.error("Failed to fetch courses");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    loading.value = false;
  }
});

// const filterCourses = () => {
//   if (filterCriteria.value === "all") {
//     // Filter by course name
//     filteredCourses.value = courses.value.filter((course) =>
//       `${course.courseName} ${course.courseFullName}`
//         .toLowerCase()
//         .includes(searchQuery.value.toLowerCase())
//     );
//   } else {
//     // Filter by criteria (int, gen, ssc)
//     filteredCourses.value = courses.value.filter(
//       (course) =>
//         course.courseName.toLowerCase().startsWith(filterCriteria.value) &&
//         course.courseFullName
//           .toLowerCase()
//           .includes(searchQuery.value.toLowerCase())
//     );
//   }
//   currentPage.value = 1;
// };

const showHasPost = ref(false); // กำหนดให้เริ่มต้นเป็น false

const updateShowHasPost = (value) => {
  showHasPost.value = value;
};

const filterCourses = () => {
  const category = filterCriteria.value.toLowerCase();
  const search = searchQuery.value.toLowerCase();

  filteredCourses.value = courses.value.filter((course) => {
    const courseName = course.courseName.toLowerCase();
    const courseFullName = course.courseFullName.toLowerCase();

    const categoryMatch = category === "all" || courseName.startsWith(category);
    const searchMatch =
      courseName.includes(search) || courseFullName.includes(search);
    const hasPostMatch = showHasPost.value ? course.reviewsCount > 0 : true;

    return categoryMatch && searchMatch && hasPostMatch;
  });

  currentPage.value = 1;
};


// const isSearchDisabled = computed(() => {
//   return !searchQuery.value && filterCriteria.value === "all";
// });

const clearFilter = () => {
  searchQuery.value = "";
  filterCriteria.value = "all";
  showHasPost.value = false;
  filterCourses();
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
  <div class="container mx-auto mt-28 mb-10">
    <div class="search">
      <p class="topic">Search</p>
      <div class="line"></div>

      <div class="filter-container">
        <div class="filter-item">
          <p class="second">Category Course</p>
          <select
            v-model="filterCriteria"
            class="dropdown appearance-none cursor-pointer border focus:border-blue-500 focus:outline-none"
          >
            <option value="all">ALL</option>
            <option value="int">INT</option>
            <option value="gen">GEN</option>
            <option value="ssc">SSC</option>
            <option value="lng">LNG</option>
          </select>
        </div>

        <div class="filter-item">
          <p class="second">Course Name</p>

          <input
            v-model.trim="searchQuery"
            list="coursesList"
            placeholder="Search Course ..."
            class="dropdown"
            required
          />

          <!-- <datalist id="coursesList" class="dropdown-list">
            <option
              v-for="course in filteredCourses"
              :key="course.id"
              :value="`${course.courseName} ${course.courseFullName}`"
            ></option>
          </datalist> -->
        </div>
        <div class="filter-item">
          <p class="second">Show only has post</p>
          
          <div class="inline-flex items-center">
            <label
              class="relative flex ml-5 cursor-pointer items-center rounded-full p-3"
              for="checkbox-8"
              data-ripple-dark="true"
            >
            <input
                type="checkbox"
                class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                id="bordered-checkbox-2"
                v-model="showHasPost"
                @change="updateShowHasPost($event.target.checked)"
              />
              <div
                class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </label>
          </div>
        </div>

        <div class="button-2">
          <button @click="filterCourses" class="button-search">Search</button>
          <button @click="clearFilter" class="button-clear">Clear</button>
        </div>
      </div>
    </div>

    <!-- ส่วนของแสดง course -->
    <div class="box-review">
      <div class="review-page">
        <div class="line-review"></div>
        <p class="review">Summary</p>
      </div>

      <router-link :to="{ name: 'AddSummary' }"
        ><button class="button-add-summary" v-if="role === 'st_group'">
          <img src="../assets/add.png" class="add-icon" />
          Add
        </button>
      </router-link>

      <div v-if="paginatedCourses.length > 0" class="flex flex-wrap">
        <div
          v-for="course in paginatedCourses"
          :key="course.id"
          class="w-full sm:w-1/2 md:w-1/3 p-2"
        >
          <div class="course-card mx-auto">
            <div
              class="categoryname"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'GEN'"
            >
              G
            </div>
            <div
              class="categoryname"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'INT'"
            >
              I
            </div>
            <div
              class="categoryname"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'SSC'"
            >
              S
            </div>
            <div
              class="categoryname"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'LNG'"
            >
              L
            </div>

            <div class="course-detail">
              <h3 class="coursename">{{ course.courseName }}</h3>
              <p class="coursefullname">{{ course.courseFullName }}</p>
            </div>
            <div class="line-course"></div>
            <div class="credit">
              <img src="../assets/score.png" class="credit-icon" />
              Credit : {{ course.courseCredit }}
            </div>

            <!-- จำนวน post -->
            <div
              class="count_comment flex items-center"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'GEN'"
            >
              <span>Post : {{ course.summariesCount }}</span>
            </div>

            <div
              class="count_comment flex items-center"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'INT'"
            >
              <span>Post : {{ course.summariesCount }}</span>
            </div>

            <div
              class="count_comment flex items-center"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'SSC'"
            >
              <span>Post : {{ course.summariesCount }}</span>
            </div>

            <div
              class="count_comment flex items-center"
              :style="{
                backgroundColor: getCategoryColor(course.categoryName),
              }"
              v-if="course.categoryName === 'LNG'"
            >
              <span>Post : {{ course.summariesCount }}</span>
            </div>

            <router-link
              :to="{ name: 'SummaryDetail', params: { courseid: course.id } }"
              ><div class="see-detail">
                See Summary

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  class="arrow"
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
                      stroke="#4675c1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                    />
                    <path
                      id="Path_135"
                      data-name="Path 135"
                      d="M18,24l6-6-6-6"
                      fill="none"
                      stroke="#4675c1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                    />
                    <path
                      id="Path_136"
                      data-name="Path 136"
                      d="M12,18H24"
                      fill="none"
                      stroke="#4675c1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                    />
                  </g>
                </svg></div
            ></router-link>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="!loading && paginatedCourses.length > 0">
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

      <div v-if="loading">
        <Spinner :loading="loading" />
      </div>

      <div v-else-if="paginatedCourses.length === 0">
        <div class="no-review mb-20">
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

          <p>No Course</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown::placeholder {
  font-size: 14px;
  font-weight: 200;
  opacity: 0.5;
}

.dropdown:valid {
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
  margin-left: 140px;
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
.search {
  position: absolute;
  left: 50%;
  right: 50%;
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

.dropdown {
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

.button {
  margin-top: -97px;
  margin-left: 730px;
  width: 100px;
  height: 42px;
  font: normal normal 400 14px/21px Poppins;
  color: white;
  background: var(--unnamed-color-4675c0) 0% 0% no-repeat padding-box;
  background: #4675c0 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 8px;
  opacity: 1;
}

.searchbutton {
  margin-top: -34px;
  margin-left: 2px;
}

.box-review {
  margin-top: 80px;
  padding-top: 120px;
}

.semi-transparent {
  opacity: 0.3;
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

.course-card {
  width: 390px;
  height: 236px;
  background-color: white;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
  margin-bottom: 20px;
  position: relative;
}

.categoryname {
  width: 71px;
  height: 70px;
  background: #77d8dd 0% 0% no-repeat padding-box;
  border-radius: 15px;
  opacity: 1;
  text-align: center;
  font: normal normal 600 40px/60px Poppins;
  color: #ffffff;
  padding-top: 6px;
  position: absolute;
  margin-left: 20px;
  margin-top: 20px;
}

.coursename {
  color: var(--unnamed-color-19335a);
  text-align: left;
  font: normal normal 600 20px/30px Poppins;
  letter-spacing: 0.4px;
  color: #19335a;
  opacity: 1;
  margin-left: 110px;
}

.coursefullname {
  color: var(--unnamed-color-b8bfd6);
  text-align: left;
  font: normal normal lighter 14px/22px Poppins;
  letter-spacing: 0.28px;
  color: #b8bfd6;
  text-transform: uppercase;
  opacity: 1;
  margin-left: 110px;
  margin-top: 3px;
  /* width: 250px; */
  width: auto;
  /* background-color: #2152a0; */
  /* padding-right: 20px; */
  margin-right: 20px;
}

.course-detail {
  padding-top: 17px;
}

.line-course {
  border: 1px solid #4675c11a;
  height: 1.5px;
  width: 88%;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  margin-top: -5px;
}

.see-detail:hover {
  background-color: #2152a0;
  background: #c3daff 0% 0% no-repeat padding-box;
}

.see-detail {
  width: 88%;
  height: 44px;
  background: #d8e7ff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 15px;
  opacity: 1;
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: #4675c1;
  opacity: 1;
}

.credit {
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
  position: absolute;
  bottom: 85px;
  margin-left: 75px;

  transform: translateX(-50%);
  color: var(--unnamed-color-b8bfd6);
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: #b8bfd6;
  opacity: 1;
}

.credit-icon {
  width: 25px;
  margin-right: 5px;
}

.add-icon {
  width: 13px;
  margin-right: 8px;
  margin-top: 0; /* Remove this line */
}

.button-add-summary {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: white;

  width: 100px;
  height: 40px;
  background: var(--unnamed-color-4675c0) 0% 0% no-repeat padding-box;
  background: #4675c0 0% 0% no-repeat padding-box;
  border: 1px solid #4675c126;
  border-radius: 10px;
  opacity: 1;
  margin-left: 1162px;
  /* float: right;
margin-right: 10px; */
  position: absolute;
  margin-top: -60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.button-add-summary:hover {
  background-color: #2152a0;
}

.button-add-summary:active {
  transform: scale(0.92);
  transition: transform 0.2s ease-in-out;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 50px;
}

.pagination-container ul {
  display: inline-flex;
}

.no-review {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  margin-top: 5%;
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

.arrow {
  width: 20px;
  margin-left: 10px;
}

.pagination {
  /* margin-top: 20px; */
  text-align: center;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
}

.count_comment {
  letter-spacing: 0.8px;
  color: #ffffff;
  background-color: #b8bfd6;
  font-weight: 900;
  font-size: 12px;
  width: auto;
  height: 25px;
  box-shadow: 0px 0px 15px #457aef0d;
  /* border: 1px solid #697b98; */
  border-radius: 10px;
  position: absolute;
  bottom: 203px;
  right: 0;
  width: auto;
  padding-right: 15px;
  padding-left: 15px;
  height: 33px;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 0px 15px;
  opacity: 1;
}
.count_comment svg {
  margin-right: 8px;
  margin-left: 12px;
}
</style>
