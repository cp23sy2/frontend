<script setup></script>

<template>
  <div class="nopage-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="57"
      height="32.926"
      viewBox="0 0 57 32.926"
      class="empty"
    >
      <g id="Exp-2.-F" transform="translate(-3.5 -15.499)">
        <g id="Group_29525" data-name="Group 29525">
          <path
            id="Path_19789"
            data-name="Path 19789"
            d="M11.648,19.185l-8,13A1,1,0,0,0,4.5,33.709h9a1,1,0,1,0,0-2H6.29l7.062-11.476a1,1,0,0,0-1.7-1.048Z"
            fill="#4675c0"
            fill-rule="evenodd"
          />
          <path
            id="Path_19790"
            data-name="Path 19790"
            d="M12.5,27.709v14a1,1,0,0,0,2,0v-14a1,1,0,0,0-2,0Z"
            fill="#4675c0"
            fill-rule="evenodd"
          />
          <path
            id="Path_19791"
            data-name="Path 19791"
            d="M57.648,19.185l-8,13a1,1,0,0,0,.852,1.524h9a1,1,0,0,0,0-2H52.29l7.062-11.476a1,1,0,1,0-1.7-1.048Z"
            fill="#4675c0"
            fill-rule="evenodd"
          />
          <path
            id="Path_19792"
            data-name="Path 19792"
            d="M58.5,27.709v14a1,1,0,0,0,2,0v-14a1,1,0,0,0-2,0Z"
            fill="#4675c0"
            fill-rule="evenodd"
          />
        </g>
        <path
          id="Path_19793"
          data-name="Path 19793"
          d="M19.25,27.312c1.195-.69,3.173.5,4.415,2.647s1.28,4.457.085,5.147-3.173-.5-4.415-2.647S18.055,28,19.25,27.312Z"
          fill="#cadcf0"
          fill-rule="evenodd"
        />
        <path
          id="Path_19794"
          data-name="Path 19794"
          d="M44.75,27.312c-1.195-.69-3.173.5-4.415,2.647s-1.28,4.457-.085,5.147,3.173-.5,4.415-2.647S45.945,28,44.75,27.312Z"
          fill="#cadcf0"
          fill-rule="evenodd"
        />
        <path
          id="Path_19795"
          data-name="Path 19795"
          d="M33,15.5c5.4.09,10.406,4.711,10,13-.25,5.088-3.4,6.476-5.148,12a22.154,22.154,0,0,0-.909,6.886,1,1,0,0,1-1.1,1.034C29.34,47.457,21,38.828,21,30.5c0-8.831,5.378-15.111,12-15Z"
          fill="#cadcf0"
          fill-rule="evenodd"
        />
        <path
          id="Path_19796"
          data-name="Path 19796"
          d="M21.582,34.43A14.169,14.169,0,0,1,21,30.5c0-8.831,5.378-15.111,12-15,4.094.068,7.958,2.737,9.413,7.631-.773,7.559-6.634,13.444-13.739,13.444A12.868,12.868,0,0,1,21.582,34.43Z"
          fill="#e9f3fc"
          fill-rule="evenodd"
        />
        <ellipse
          id="Ellipse_1625"
          data-name="Ellipse 1625"
          cx="2"
          cy="3"
          rx="2"
          ry="3"
          transform="translate(30 26.709)"
          fill="#738bab"
        />
        <path
          id="Path_19797"
          data-name="Path 19797"
          d="M28.962,22.841a2.188,2.188,0,0,1-.8,2.454.5.5,0,1,0,.559.828,3.181,3.181,0,0,0,1.2-3.545.5.5,0,1,0-.965.263Z"
          fill="#738bab"
          fill-rule="evenodd"
        />
        <path
          id="Path_19798"
          data-name="Path 19798"
          d="M34.073,22.578a3.181,3.181,0,0,0,1.2,3.545.5.5,0,1,0,.559-.828,2.188,2.188,0,0,1-.8-2.454.5.5,0,0,0-.965-.263Z"
          fill="#738bab"
          fill-rule="evenodd"
        />
      </g>
    </svg>

    <h1>Page Not Found</h1>
    <p>Sorry, the page you are looking for could not be found.</p>
    <router-link to="/dashboard" class="button_home flex items-center">
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
      </svg>

      Home Page</router-link
    >
  </div>
</template>

<style scoped>
.nopage-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 85vh; /* ให้ container มีความสูงเต็มหน้าจอ */
}

h1 {
  font-size: 3em;
  color: #697a98;
  font-size: 38px;
  font-weight: 500;
  letter-spacing: 1.28px;
  margin-bottom: 10px;
}

p {
  font-size: 1.5em;
  color: #666;
  margin-bottom: 50px;
  color: #b8bfd6;
  font: normal normal 400 18px/22px Poppins;
  letter-spacing: 0.28px;
}

router-link {
  font-size: 1.2em;
  color: #007bff;
  text-decoration: none;
}

.button_home {
  background-color: white;
  border: solid 1px #4675c0;
  height: auto;
  width: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.56px;
  color: #4675c0;
}

.button_home:hover {
  /* border: 1px solid #4675c158; */
  cursor: pointer;
  border: 1px solid #4675c0;
  background-color: #eef4ff;
}

.empty {
  width: 35%;
  height: 35%;
  margin-bottom: 50px;
}

.arrow {
  width: 20px;
  margin-right: 10px;
  transform: rotate(180deg);
}
</style>
