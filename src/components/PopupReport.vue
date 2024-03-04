<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";

const { show } = defineProps(["show"]);
const emits = defineEmits(["close", "selected"]);

const close = () => {
  emits("close");
};

const selectedOption = ref("");

const emitSelectedOption = () => {
  let optionValue = false;
  if (selectedOption.value === "1" || selectedOption.value === "2") {
    optionValue = true;
  }
  emits("selected", { value: selectedOption.value, selected: optionValue });
  selectedOption.value = "";
};


const clearForm = () => {
  selectedOption.value = "";
};

const isDisabled = computed(() => {
  return selectedOption.value === "";
});
</script>

<template>
  <div v-if="show" class="popup-container bg-black bg-opacity-20 backdrop-blur-sm">
    <div class="popup">
      <div class="popup-content">
        <div class="line-comment-popup"></div>
        <div class="comment_header flex inline-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20.014 18.186"
            class="mr-4 w-7"
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
                  fill="#d20000"
                />
              </g>
            </g>
          </svg>

          Report
        </div>

        <div class="mt-12 ml-5">
          <div class="flex items-center mb-4">
            <input
              type="radio"
              id="radioOption1"
              value="1"
              v-model="selectedOption"
              class="form-radio mr-2"
            />
            <label for="radioOption1" class="cursor-pointer"
              >เนื้อหาไม่เหมาะสม</label
            >
          </div>
          <div class="flex items-center mb-4">
            <input
              type="radio"
              id="radioOption2"
              value="2"
              v-model="selectedOption"
              class="form-radio mr-2"
            />
            <label for="radioOption2" class="cursor-pointer"
              >เนื้อหาไม่ตรงกับรายวิชา</label
            >
          </div>

          <div class="flex justify-center mt-8">
            <button
              @click="emitSelectedOption"
              class="addReport"
              :disabled="isDisabled"
            >
              Submit
            </button>

            <button
              @click="clearForm"
              class="button-clear"
              :disabled="isDisabled"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <div class="close-button" @click="close">
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
</template>

<style scoped>
.popup-container {
  z-index: 1;
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
  z-index: 1;
}

.popup {
  padding: 30px;
  position: relative;
  width: 500px;
  height: auto;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 15px #457aef0d;
  border-radius: 20px;
  opacity: 1;
  top: 0%;
}

.popup-content {
  text-align: center;
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

.line-comment-popup {
  background-color: #e6e6e6;
  height: 1px;
  width: 430px;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-top: 60px;
  transform: translate(-50%, -50%);
}

.comment_header {
  color: var(--unnamed-color-4675c0);
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.8px;
  opacity: 1;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  font: normal normal 600 28px/42px Poppins;
  letter-spacing: 1.12px;
  color: #d20000;
}

input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1.5px solid #c9c9c9;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}

input[type="radio"]:checked {
  background-color: #d20000;
}

/* ตั้งค่ารูปแบบ CSS สำหรับ label */
label {
  cursor: pointer;
  color: #697a98;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.56px;
}

.addReport {
  background-color: #d20000;
  height: 40px;
  width: 120px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: white;
  margin-right: 20px;
}

.addReport:hover {
  background-color: #b10000;
}

.button-clear {
  background-color: white;
  border: solid 1px #d20000;
  height: 40px;
  width: 120px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.56px;
  color: #d20000;
}

.button-clear:hover {
  opacity: 0.5;
}

.button-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.addReport:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
