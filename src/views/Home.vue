<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const review = ref([]);
const summary = ref([]);

onBeforeMount(async () => {
  try {
    const reviewResponse = await fetch(
      `${import.meta.env.VITE_BASE_URL}review/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (reviewResponse.status === 200) {
      console.log("You have successfully logged in");

      const reviewData = await reviewResponse.json();
      // review.value = reviewData;
      review.value = reviewData.filter((review) => !review.hide);
    }
    if (reviewResponse.status === 401) {
      // login();
      signout();
    }

    const summaryResponse = await fetch(
      `${import.meta.env.VITE_BASE_URL}summary/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (summaryResponse.status === 200) {
      console.log("Summary data fetched successfully");

      const summaryData = await summaryResponse.json();
      // summary.value = summaryData;
      summary.value = summaryData.filter((summary) => !summary.hide);
    }
    if (summaryResponse.status === 401) {
      // login();
      // signout()
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

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
  <div class="container mx-auto px-4">
    <section class="grid gap-7 grid-cols-2 grid-rows-2 mt-14">
      <div id="item-1">
        <div class="box-line" style="background-color: #ea5355"></div>
        <p class="item-name" style="color: #ea5355">Summary</p>
        <p class="item-number" v-if="summary.length > 0">
          {{ summary.length }}
        </p>
        <p class="item-number" v-else>0</p>
        <div class="box-icon" style="background-color: #ea5355">
          <img src="../assets/summary.png" />
        </div>
      </div>

      <div id="item-2">
        <div class="box-line" style="background-color: #f7b54c"></div>
        <p class="item-name" style="color: #f7b54c">Review</p>
        <p class="item-number" v-if="review.length > 0">{{ review.length }}</p>
        <p class="item-number" v-else>0</p>
        <div class="box-icon" style="background-color: #f7b54c">
          <img src="../assets/review.png" />
        </div>
      </div>

      <div id="item-3">
        <!-- <img src="../assets/userdashboard.png" /> -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="1008"
          height="358"
          viewBox="0 0 1008 358"
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="0.768"
              y1="0.5"
              x2="0.237"
              y2="0.5"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0" stop-color="#5379e8" />
              <stop offset="1" stop-color="#897add" />
            </linearGradient>
            <filter
              id="Rectangle_92"
              x="0"
              y="16"
              width="1008"
              height="342"
              filterUnits="userSpaceOnUse"
            >
              <feOffset dy="3" input="SourceAlpha" />
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feFlood flood-color="#457aef" flood-opacity="0.353" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter
              id="Rectangle_95"
              x="45"
              y="193"
              width="260"
              height="110"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="10" result="blur-2" />
              <feFlood flood-color="#457aef" flood-opacity="0.149" />
              <feComposite operator="in" in2="blur-2" />
              <feComposite in="SourceGraphic" />
            </filter>
            <clipPath id="clip-path">
              <rect
                id="Rectangle_93"
                data-name="Rectangle 93"
                width="810"
                height="319"
                rx="20"
                transform="translate(3734 288)"
                fill="#457aef"
              />
            </clipPath>
          </defs>
          <g
            id="Group_334"
            data-name="Group 334"
            transform="translate(-344 -75)"
          >
            <g
              transform="matrix(1, 0, 0, 1, 344, 75)"
              filter="url(#Rectangle_92)"
            >
              <rect
                id="Rectangle_92-2"
                data-name="Rectangle 92"
                width="936"
                height="270"
                rx="20"
                transform="translate(36 49)"
                fill="url(#linear-gradient)"
              />
            </g>
            <path
              id="Path_177"
              data-name="Path 177"
              d="M126.561,44.35c118.747-66.069,143.823-57.62,255.994-56.986,35.71,5.738,21.417,45.943,21.7,89.783-3.366,57.706,0,125.271,0,143.676,0,35.554-6.208,36.307-39.969,36.4-43.482,3.2-119.412,0-175.4,0-52.932,0-133.341.955-192.991,0-20.255-.5-11.305-1.318-54.981,0-20.9-3.478-26.359-12.387-26.359-36.019C-85.444,135.328,7.815,110.42,126.561,44.35Z"
              transform="translate(912 137)"
              fill="rgba(255,255,255,0.15)"
            />
            <g
              id="Group_305"
              data-name="Group 305"
              transform="translate(0 -21)"
            >
              <line
                id="Line_13"
                data-name="Line 13"
                x2="83"
                transform="translate(760.5 371.5)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_14"
                data-name="Line 14"
                x2="83"
                transform="translate(910.5 371.5)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_15"
                data-name="Line 15"
                x2="8.5"
                transform="translate(872.5 371.932)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_16"
                data-name="Line 16"
                x2="9"
                transform="translate(786.5 331.932)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_17"
                data-name="Line 17"
                x2="41"
                transform="translate(817.5 331.932)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_18"
                data-name="Line 18"
                x2="44"
                transform="translate(962.5 268.5)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_20"
                data-name="Line 20"
                x2="8.5"
                transform="translate(1034.5 268.932)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
              <line
                id="Line_21"
                data-name="Line 21"
                x2="78.5"
                transform="translate(1233 313.5)"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                stroke-linecap="round"
                stroke-width="10"
              />
            </g>
            <g
              transform="matrix(1, 0, 0, 1, 344, 75)"
              filter="url(#Rectangle_95)"
            >
              <rect
                id="Rectangle_95-2"
                data-name="Rectangle 95"
                width="200"
                height="50"
                rx="25"
                transform="translate(75 223)"
                fill="rgba(12,0,92,0.38)"
              />
            </g>
            <text
              id="STYDENT"
              transform="translate(470 332)"
              fill="#fff"
              font-size="24"
              font-family="Poppins-SemiBold, Poppins"
              font-weight="600"
              letter-spacing="0.03em"
            >
              <tspan x="0" y="0">Stydent</tspan>
            </text>
            <text
              id="A_website_that_collects_"
              data-name="A website that collects "
              transform="translate(419 186)"
              fill="#fff"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.05em"
            >
              <tspan x="0" y="0">A website that collects</tspan>
            </text>
            <text
              id="summary_information_and_review_"
              data-name="summary information and review "
              transform="translate(419 224)"
              fill="#fff"
              font-size="26"
              font-family="Poppins-Bold, Poppins"
              font-weight="700"
              letter-spacing="0.05em"
            >
              <tspan x="0" y="0">summary information and review</tspan>
            </text>
            <text
              id="in_the_faculty_of_information_Technology"
              data-name="in the faculty of information Technology"
              transform="translate(419 255)"
              fill="#fff"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.05em"
            >
              <tspan x="0" y="0">
                in the faculty of information Technology
              </tspan>
            </text>
            <g
              id="Mask_Group_5"
              data-name="Mask Group 5"
              transform="translate(-3228 -213)"
              clip-path="url(#clip-path)"
            >
              <g
                id="_6622372_3361499"
                data-name="6622372_3361499"
                transform="translate(4154 309.221)"
              >
                <g id="OBJECTS">
                  <path
                    id="Path_148"
                    data-name="Path 148"
                    d="M445.028,263.206"
                    transform="translate(-280.824 -68.044)"
                    fill="#f19a99"
                  />
                  <g id="Group_300" data-name="Group 300">
                    <g
                      id="Group_267"
                      data-name="Group 267"
                      transform="translate(184.866 251.825)"
                    >
                      <path
                        id="Path_149"
                        data-name="Path 149"
                        d="M288.439,317.786c28.562-.364,112.589,1.754,117.351,1.762,3.5,8.535,25.184,187.517,25.184,187.517H363.726l-14.118-77.034-9.234,77.034h-64.9S287.371,325.265,288.439,317.786Z"
                        transform="translate(-275.474 -317.744)"
                        fill="#ff7686"
                      />
                      <path
                        id="Path_150"
                        data-name="Path 150"
                        d="M353.787,363.676l23.734,17.835,6.208,46.73"
                        transform="translate(-309.594 -315.954)"
                        fill="none"
                        stroke="#031932"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        stroke-width="2.072"
                      />
                    </g>
                    <g
                      id="Group_288"
                      data-name="Group 288"
                      transform="translate(222.468)"
                    >
                      <g
                        id="Group_268"
                        data-name="Group 268"
                        transform="translate(0)"
                      >
                        <path
                          id="Path_151"
                          data-name="Path 151"
                          d="M371.861,127.26s-.341,6.166,2.044,8.685c7.117,7.519,29.2,14.948,14.084,43.658L281.4,168.9s-4.125-12.449,8.452-18.183c0,0,4.4-2.267,2.642-10.606s5.128-13.446,13.735-21.3L323.741,97.3Z"
                          transform="translate(-280.751 -74.51)"
                          fill="#37305d"
                        />
                        <path
                          id="Path_152"
                          data-name="Path 152"
                          d="M327.168,171.038l52.384,7.018s18.957-81.91-16.655-97.239c-37.81-16.275-53.767,7.43-61.745,24.766Z"
                          transform="translate(-293.375 -75.365)"
                          fill="#37305d"
                        />
                      </g>
                      <g
                        id="Group_287"
                        data-name="Group 287"
                        transform="translate(0.706 0.225)"
                      >
                        <g id="Group_286" data-name="Group 286">
                          <g id="Group_285" data-name="Group 285">
                            <g id="Group_284" data-name="Group 284">
                              <g id="Group_277" data-name="Group 277">
                                <g id="Group_270" data-name="Group 270">
                                  <g id="Group_269" data-name="Group 269">
                                    <path
                                      id="Path_153"
                                      data-name="Path 153"
                                      d="M375.19,78.228a25.54,25.54,0,0,1,6.529,4.54c17.98,17.148,6.789,50.627-9.186,65.779-8.842,8.388-21.8,12.32-33.146,8.115-16.594-6.149-21.86-24.9-18.566-41.623,2.455-12.462,9.3-24.251,19.471-31.613S364.212,72.921,375.19,78.228Z"
                                      transform="translate(-319.889 -75.581)"
                                      fill="#f3b6b5"
                                    />
                                  </g>
                                </g>
                                <g
                                  id="Group_272"
                                  data-name="Group 272"
                                  transform="translate(58.537 42.639)"
                                >
                                  <g
                                    id="Group_271"
                                    data-name="Group 271"
                                    transform="translate(0)"
                                  >
                                    <path
                                      id="Path_154"
                                      data-name="Path 154"
                                      d="M310.922,136.847a13.076,13.076,0,0,0,12.805,2.841,14.207,14.207,0,0,0,8.683-10.056c.952-4.121-.12-8.8-3.162-11.3s-8.482-2.323-11.053.965Z"
                                      transform="translate(-310.922 -116.621)"
                                      fill="#f3b6b5"
                                    />
                                  </g>
                                </g>
                                <g
                                  id="Group_274"
                                  data-name="Group 274"
                                  transform="translate(18.724 51.913)"
                                >
                                  <g
                                    id="Group_273"
                                    data-name="Group 273"
                                    transform="translate(0)"
                                  >
                                    <path
                                      id="Path_155"
                                      data-name="Path 155"
                                      d="M371.911,125.547l-3.038,59.1a20.663,20.663,0,0,1-20.148,19.915h0a20.661,20.661,0,0,1-21.006-23.2l6.425-54.9Z"
                                      transform="translate(-327.559 -125.547)"
                                      fill="#f3b6b5"
                                    />
                                  </g>
                                </g>
                                <g
                                  id="Group_276"
                                  data-name="Group 276"
                                  transform="translate(20.97 72.967)"
                                >
                                  <g
                                    id="Group_275"
                                    data-name="Group 275"
                                    transform="translate(0)"
                                  >
                                    <path
                                      id="Path_156"
                                      data-name="Path 156"
                                      d="M337.6,162.748l.792-8.1s16.284,4.927,30.882-8.842C369.274,145.811,360.91,161.249,337.6,162.748Z"
                                      transform="translate(-337.6 -145.811)"
                                      fill="#111010"
                                    />
                                  </g>
                                </g>
                              </g>
                              <g
                                id="Group_283"
                                data-name="Group 283"
                                transform="translate(4.41 32.259)"
                              >
                                <g
                                  id="Group_282"
                                  data-name="Group 282"
                                  transform="translate(0)"
                                >
                                  <g
                                    id="Group_278"
                                    data-name="Group 278"
                                    transform="translate(7.219 12.513)"
                                  >
                                    <path
                                      id="Path_157"
                                      data-name="Path 157"
                                      d="M375.9,126.041a7.577,7.577,0,0,0-.926-2.052,11.6,11.6,0,0,0-1.3-1.747l-.5,1.624a5.779,5.779,0,0,0,2.788-2.211,8.341,8.341,0,0,0,.833-1.424,6.994,6.994,0,0,0,.518-1.558c-.866.679-1.642,1.356-2.425,1.953a7.381,7.381,0,0,1-2.287,1.282l-1.436.375.932,1.249a11.658,11.658,0,0,0,1.448,1.625,7.575,7.575,0,0,0,1.823,1.319.378.378,0,0,0,.508-.17A.369.369,0,0,0,375.9,126.041Z"
                                      transform="translate(-371.16 -118.673)"
                                      fill="#d87778"
                                    />
                                  </g>
                                  <g
                                    id="Group_279"
                                    data-name="Group 279"
                                    transform="translate(7.197 22.267)"
                                  >
                                    <path
                                      id="Path_158"
                                      data-name="Path 158"
                                      d="M363.524,130.888a6.834,6.834,0,0,0,3.164,3.254,6.523,6.523,0,0,0,4.808.425,8.834,8.834,0,0,0,3.911-2.615,19.226,19.226,0,0,0,1.309-1.845,18.234,18.234,0,0,0,.911-2.045,20.979,20.979,0,0,0-1.685,1.4c-.542.46-1.116.863-1.624,1.318a12.176,12.176,0,0,1-3.407,1.822,6.7,6.7,0,0,1-3.643.055A13.3,13.3,0,0,1,363.524,130.888Z"
                                      transform="translate(-363.524 -128.062)"
                                      fill="#d87778"
                                    />
                                  </g>
                                  <path
                                    id="Path_159"
                                    data-name="Path 159"
                                    d="M318.989,130.259c2.436.238,4.56-1.091,4.744-2.969a3.534,3.534,0,0,0-2.388-3.4"
                                    transform="translate(-256.174 -105.957)"
                                    fill="none"
                                    stroke="#d87778"
                                    stroke-linecap="round"
                                    stroke-miterlimit="10"
                                    stroke-width="1.744"
                                  />
                                  <g
                                    id="Group_280"
                                    data-name="Group 280"
                                    transform="translate(23.546 3.599)"
                                  >
                                    <path
                                      id="Path_160"
                                      data-name="Path 160"
                                      d="M351.617,110.314a15.829,15.829,0,0,0-.713,5.856,5.373,5.373,0,0,0,1.056,2.962c.186.21.41.4.62.591a5.934,5.934,0,0,0,.753.414,3.8,3.8,0,0,0,.809.215,2.623,2.623,0,0,0,.824.057,4.607,4.607,0,0,0,2.959-1.2,8.964,8.964,0,0,0,1.9-2.39,18.273,18.273,0,0,0,1.937-5.569.366.366,0,0,0-.712-.165l-.005.018a21.7,21.7,0,0,1-2.143,5.175,8.9,8.9,0,0,1-1.7,2.071,3.476,3.476,0,0,1-2.271.909,2.535,2.535,0,0,1-2.13-.823,4.7,4.7,0,0,1-.892-2.383,18.119,18.119,0,0,1,.306-5.574l0-.017a.31.31,0,0,0-.6-.146Z"
                                      transform="translate(-350.859 -110.093)"
                                      fill="#222c44"
                                    />
                                  </g>
                                  <g id="Group_281" data-name="Group 281">
                                    <path
                                      id="Path_161"
                                      data-name="Path 161"
                                      d="M376.348,106.854a15.175,15.175,0,0,0-.656,4.9,5.211,5.211,0,0,0,.711,2.553,2.657,2.657,0,0,0,1.086,1,2,2,0,0,0,.705.241c.121.026.242.056.364.074l.365-.008a3.725,3.725,0,0,0,2.5-1.169,8.386,8.386,0,0,0,1.467-2.118,16.883,16.883,0,0,0,1.452-4.728.366.366,0,0,0-.715-.155l0,.016a21.594,21.594,0,0,1-1.683,4.373,8.625,8.625,0,0,1-1.3,1.81,2.585,2.585,0,0,1-1.756.82,1.675,1.675,0,0,1-1.565-.756,4.646,4.646,0,0,1-.616-2.034,18.767,18.767,0,0,1,.248-4.672l0-.015a.31.31,0,0,0-.258-.355A.314.314,0,0,0,376.348,106.854Z"
                                      transform="translate(-375.682 -106.63)"
                                      fill="#222c44"
                                    />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                      <path
                        id="Path_162"
                        data-name="Path 162"
                        d="M317.538,85.563a11.06,11.06,0,0,0-4.427,6.425c-1.2,5.147,1.211,12.547,24.827,12.809,21.966.244,17.239,15.035,32.219,13.4l9.028-3.424s-6.465-49.681-46.691-37.353C327.1,79.075,320.748,83.28,317.538,85.563Z"
                        transform="translate(-300.136 -75.361)"
                        fill="#37305d"
                      />
                    </g>
                    <g
                      id="Group_299"
                      data-name="Group 299"
                      transform="translate(0 81.03)"
                    >
                      <g id="Group_298" data-name="Group 298">
                        <g
                          id="Group_289"
                          data-name="Group 289"
                          transform="translate(61.613 77.286)"
                        >
                          <path
                            id="Path_163"
                            data-name="Path 163"
                            d="M449.178,268.581l-41.154,40.756,6.429,7.214a30.253,30.253,0,0,0,14.1,9.1c13,3.734,26.555-1.862,36.039-15.6l14.952-21.5Z"
                            transform="translate(-338.506 -226.15)"
                            fill="#f3b6b5"
                          />
                          <path
                            id="Path_164"
                            data-name="Path 164"
                            d="M523.016,321.594,443.544,246l19.563-18.259,81.653,66.373C552.363,300.3,545.1,333.249,523.016,321.594Z"
                            transform="translate(-443.544 -227.742)"
                            fill="#f3b6b5"
                          />
                        </g>
                        <path
                          id="Path_165"
                          data-name="Path 165"
                          d="M289.208,280.015c-14.117-18.522,32.49-92.912,51.929-105.1,11.127-6.975,24-5.489,32.736-5.718.473,3.981,4.3,9.313,14.333,11.524,15.2,3.348,24.792-1.56,29.259-3.843a145.265,145.265,0,0,1,30.14,9.839c12.11,5.72,21.11,96.713,3.333,105.619,2.7,19.213,5.267,48.165,5.267,48.165l-131.352-9.934,3.776-26.128S295.758,288.608,289.208,280.015Z"
                          transform="translate(-132.114 -152.738)"
                          fill="#fbe4e9"
                        />
                        <line
                          id="Line_12"
                          data-name="Line 12"
                          x1="3.398"
                          y2="33.128"
                          transform="translate(195.783 112.908)"
                          fill="none"
                          stroke="#031932"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-miterlimit="10"
                          stroke-width="2.072"
                        />
                        <g
                          id="Group_293"
                          data-name="Group 293"
                          transform="translate(200.464 24.143)"
                        >
                          <g
                            id="Group_292"
                            data-name="Group 292"
                            transform="translate(0 91.282)"
                          >
                            <path
                              id="Path_166"
                              data-name="Path 166"
                              d="M404.29,296.771l8.133,3.822c.773.337-13.476,18.8-13.476,18.8s-38.48-9.413-40.792-11.281,12.769-.525,12.769-.525-13.982-4-17.388-7.073c-2.712-2.446,16.762-.477,16.762-.477-6.993-2.493-20.259-6.306-19.823-8.663.549-2.954,22.869,3.451,22.869,3.451s-15.261-5.752-15.536-8.685,29.934,4.828,29.934,4.828-4.162-5.891-2.547-12.364c.41-1.647,2.5-2.556,3.756-2.468C389.754,284.708,404.29,296.771,404.29,296.771Z"
                              transform="translate(-350.464 -263.996)"
                              fill="#f3b6b5"
                            />
                            <g
                              id="Group_291"
                              data-name="Group 291"
                              transform="translate(35.376)"
                            >
                              <g
                                id="Group_290"
                                data-name="Group 290"
                                transform="translate(0)"
                              >
                                <path
                                  id="Path_167"
                                  data-name="Path 167"
                                  d="M375.391,264.451s9.625,37.945,2.7,65.9c-11.542,46.6-117.942-16.986-117.942-16.986l7.146-21.185s77.269,18.687,76.795,15.728c-1.2-7.465-4.217-32.478-4.217-32.478Z"
                                  transform="translate(-260.149 -264.451)"
                                  fill="#f3b6b5"
                                />
                              </g>
                            </g>
                          </g>
                          <path
                            id="Path_168"
                            data-name="Path 168"
                            d="M266.115,300.435s66.714,19.1,65.4,1.691c-2.367-31.242-30.062-94.893-49.047-113.879-6.2-6.2-28.645-11.689-33.707-11.654Z"
                            transform="translate(-163.869 -176.593)"
                            fill="#fbe4e9"
                          />
                          <path
                            id="Path_169"
                            data-name="Path 169"
                            d="M310.972,298.464s-1.611-12.084-6.445-38.669"
                            transform="translate(-201.255 -173.35)"
                            fill="none"
                            stroke="#031932"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="2.072"
                          />
                        </g>
                        <g id="Group_297" data-name="Group 297">
                          <g id="Group_295" data-name="Group 295">
                            <path
                              id="Path_170"
                              data-name="Path 170"
                              d="M476.94,246.686H420.972v-8.964H476.94a4.482,4.482,0,0,1,4.482,4.482h0A4.482,4.482,0,0,1,476.94,246.686Z"
                              transform="translate(-292.225 -150.067)"
                              fill="#d8dcf3"
                            />
                            <g id="Group_294" data-name="Group 294">
                              <path
                                id="Path_171"
                                data-name="Path 171"
                                d="M608.294,249.974H503.01A13.506,13.506,0,0,1,490,240.089l-20.53-73.759a10.232,10.232,0,0,1,9.857-12.976h96.7A8.908,8.908,0,0,1,584.64,160Z"
                                transform="translate(-469.088 -153.355)"
                                fill="#d8dcf3"
                              />
                              <path
                                id="Path_172"
                                data-name="Path 172"
                                d="M550.707,204.2a9.961,9.961,0,1,1-9.96-9.961A9.96,9.96,0,0,1,550.707,204.2Z"
                                transform="translate(-475.604 -151.762)"
                                fill="#fff"
                              />
                            </g>
                          </g>
                          <g
                            id="Group_296"
                            data-name="Group 296"
                            transform="translate(61.438 81.671)"
                          >
                            <path
                              id="Path_173"
                              data-name="Path 173"
                              d="M524.379,246.359s.039,10.778-13.075,9.086c0,0-6.7-3.675-5.856-20.019.1-1.927,2.052-3.455,4.4-3.463h0a4.267,4.267,0,0,1,4.35,2.963l2.573,11.46Z"
                              transform="translate(-484.311 -231.963)"
                              fill="#f3b6b5"
                            />
                            <path
                              id="Path_174"
                              data-name="Path 174"
                              d="M544.735,255.425s-5.469,2.565-10.733.01c0,0-4.881,1.169-8.5-1.254a6.253,6.253,0,0,1-4.568-.545,5.561,5.561,0,0,1-3.176-4.922c-.1-3.376.277-9.2,3.537-12.632a3.054,3.054,0,0,1,3-.842c.875.231,1.366.024,1.9,1.115,0,0,1.256-2.209,3.368-2.216a3.573,3.573,0,0,1,3.707,2.461s-.908-5.229,6.22-3.913S544.735,255.425,544.735,255.425Z"
                              transform="translate(-517.743 -231.943)"
                              fill="#f3b6b5"
                            />
                          </g>
                        </g>
                      </g>
                      <path
                        id="Path_175"
                        data-name="Path 175"
                        d="M372.016,176.88s-7.236,7.157-24.132,5.105a26.862,26.862,0,0,1-14.4-6.133,18.117,18.117,0,0,1-5.06-6.654"
                        transform="translate(-86.665 -152.738)"
                        fill="none"
                        stroke="#031932"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        stroke-width="2.072"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div class="feature">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="1128"
          height="475.5"
          viewBox="0 0 1128 475.5"
        >
          <defs>
            <filter
              id="Rectangle_100"
              x="958"
              y="227.5"
              width="170"
              height="170"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feFlood flood-color="#fed363" flood-opacity="0.29" />
              <feComposite operator="in" in2="blur" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter
              id="Rectangle_99"
              x="641"
              y="227.5"
              width="170"
              height="170"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="12" result="blur-2" />
              <feFlood flood-color="#02bbb6" flood-opacity="0.29" />
              <feComposite operator="in" in2="blur-2" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter
              id="Rectangle_98"
              x="327"
              y="226.5"
              width="170"
              height="170"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="12" result="blur-3" />
              <feFlood flood-color="#fe6b74" flood-opacity="0.29" />
              <feComposite operator="in" in2="blur-3" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter
              id="Rectangle_96"
              x="479.5"
              y="0"
              width="180"
              height="85"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="7.5" result="blur-4" />
              <feFlood flood-color="#457aef" flood-opacity="0.149" />
              <feComposite operator="in" in2="blur-4" />
              <feComposite in="SourceGraphic" />
            </filter>
            <filter
              id="Rectangle_97"
              x="9"
              y="226.5"
              width="170"
              height="170"
              filterUnits="userSpaceOnUse"
            >
              <feOffset input="SourceAlpha" />
              <feGaussianBlur stdDeviation="12" result="blur-5" />
              <feFlood flood-color="#457aef" flood-opacity="0.29" />
              <feComposite operator="in" in2="blur-5" />
              <feComposite in="SourceGraphic" />
            </filter>
          </defs>
          <g
            id="Group_357"
            data-name="Group 357"
            transform="translate(-114 -474.5)"
          >
            <g
              transform="matrix(1, 0, 0, 1, 114, 474.5)"
              filter="url(#Rectangle_100)"
            >
              <rect
                id="Rectangle_100-2"
                data-name="Rectangle 100"
                width="98"
                height="98"
                rx="20"
                transform="translate(994 263.5)"
                fill="#fff"
              />
            </g>
            <g
              transform="matrix(1, 0, 0, 1, 114, 474.5)"
              filter="url(#Rectangle_99)"
            >
              <rect
                id="Rectangle_99-2"
                data-name="Rectangle 99"
                width="98"
                height="98"
                rx="20"
                transform="translate(677 263.5)"
                fill="#fff"
              />
            </g>
            <g
              transform="matrix(1, 0, 0, 1, 114, 474.5)"
              filter="url(#Rectangle_98)"
            >
              <rect
                id="Rectangle_98-2"
                data-name="Rectangle 98"
                width="98"
                height="98"
                rx="20"
                transform="translate(363 262.5)"
                fill="#fff"
              />
            </g>
            <text
              id="Manage_your_study_in_a_single_system"
              data-name="Manage your study in a single system"
              transform="translate(367 604)"
              fill="#19335a"
              font-size="32"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Manage your study in a single system</tspan>
            </text>
            <g id="Group_312" data-name="Group 312" transform="translate(13)">
              <g
                transform="matrix(1, 0, 0, 1, 101, 474.5)"
                filter="url(#Rectangle_96)"
              >
                <rect
                  id="Rectangle_96-2"
                  data-name="Rectangle 96"
                  width="135"
                  height="40"
                  rx="20"
                  transform="translate(502 22.5)"
                  fill="rgba(69,122,239,0.17)"
                />
              </g>
              <text
                id="Features"
                transform="translate(632 523)"
                fill="#4675c0"
                font-size="16"
                font-family="Poppins-Medium, Poppins"
                font-weight="500"
                letter-spacing="0.02em"
              >
                <tspan x="0" y="0">FEATURES</tspan>
              </text>
            </g>
            <text
              id="Stydent_made_for_"
              data-name="Stydent made for ?"
              transform="translate(585 650)"
              fill="#b8bfd6"
              font-size="20"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Stydent made for ?</tspan>
            </text>
            <g
              transform="matrix(1, 0, 0, 1, 114, 474.5)"
              filter="url(#Rectangle_97)"
            >
              <rect
                id="Rectangle_97-2"
                data-name="Rectangle 97"
                width="98"
                height="98"
                rx="20"
                transform="translate(45 262.5)"
                fill="#fff"
              />
            </g>
            <text
              id="Summary"
              transform="translate(157 880)"
              fill="#19335a"
              font-size="20"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Summary</tspan>
            </text>
            <circle
              id="Ellipse_32"
              data-name="Ellipse 32"
              cx="12"
              cy="12"
              r="12"
              transform="translate(218 753)"
              fill="rgba(69,122,239,0.4)"
            />
            <path
              id="Icon_ionic-md-book"
              data-name="Icon ionic-md-book"
              d="M50.471,5.673,29.277,9.658,8.082,5.673c-2.715-.423-4.707,2.1-4.707,4.682V40.8c0,2.578,1.992,4.06,4.707,4.682l21.194,3.972,21.194-3.985c2.715-.623,4.707-2.1,4.707-4.682V10.356C55.178,7.778,53.186,5.25,50.471,5.673Zm0,35.117L31.643,44.775V14.328l18.828-3.985Zm-23.56,3.985L8.082,40.79V10.356l18.828,3.985Z"
              transform="translate(179.625 759.373)"
              fill="#5189d3"
            />
            <text
              id="Summary_information_for_each_course"
              data-name="Summary information 
for each course"
              transform="translate(209 914)"
              fill="#697a98"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="-94.256" y="0">Summary information</tspan>
              <tspan x="-64.96" y="30">for each course</tspan>
            </text>
            <text
              id="Reviews"
              transform="translate(484 879)"
              fill="#19335a"
              font-size="20"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Reviews</tspan>
            </text>
            <circle
              id="Ellipse_32-2"
              data-name="Ellipse 32"
              cx="12"
              cy="12"
              r="12"
              transform="translate(534 752)"
              fill="rgba(254,107,116,0.4)"
            />
            <text
              id="Reviews_of_interesting_courses"
              data-name="Reviews of interesting 
courses"
              transform="translate(526 914)"
              fill="#697a98"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="-93.24" y="0">Reviews of interesting</tspan>
              <tspan x="-32.608" y="30">courses</tspan>
            </text>
            <text
              id="Comments"
              transform="translate(783 880)"
              fill="#19335a"
              font-size="20"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Comments</tspan>
            </text>
            <circle
              id="Ellipse_32-3"
              data-name="Ellipse 32"
              cx="12"
              cy="12"
              r="12"
              transform="translate(849 753)"
              fill="rgba(81,207,205,0.4)"
            />
            <text
              id="Can_express_your_own_opinions"
              data-name="Can express your 
own opinions"
              transform="translate(840 914)"
              fill="#697a98"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="-74.528" y="0">Can express your</tspan>
              <tspan x="-55.248" y="30">own opinions</tspan>
            </text>
            <text
              id="Report"
              transform="translate(1123 880)"
              fill="#19335a"
              font-size="20"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="0" y="0">Report</tspan>
            </text>
            <circle
              id="Ellipse_32-4"
              data-name="Ellipse 32"
              cx="12"
              cy="12"
              r="12"
              transform="translate(1171 755)"
              fill="rgba(254,211,99,0.2)"
            />
            <text
              id="Inappropriate_posts_can_be_reported"
              data-name="Inappropriate posts 
can be reported"
              transform="translate(1157 914)"
              fill="#697a98"
              font-size="16"
              font-family="Poppins-Medium, Poppins"
              font-weight="500"
              letter-spacing="0.02em"
            >
              <tspan x="-84.944" y="0">Inappropriate posts</tspan>
              <tspan x="-67.12" y="30">can be reported</tspan>
            </text>
            <g
              id="product-starred-svgrepo-com_1_"
              data-name="product-starred-svgrepo-com (1)"
              transform="translate(497.865 759.33)"
            >
              <path
                id="Path_188"
                data-name="Path 188"
                d="M18.019,2.385l-1.57-.791,0,.01Zm1.018-.627v0Zm1.018.627L21.629,1.6l0-.01ZM22.42,7.154l-1.575.781,0,.005Zm.851.614.251-1.74h0Zm5.308.767-.251,1.74h.007Zm.912.757,1.669-.552,0-.008Zm-.284,1.142-1.217-1.27-.01.009Zm-3.841,3.737,1.221,1.265.005-.005Zm-.324.982-1.734.292v.007Zm.91,5.268,1.735-.289,0-.01Zm-.455,1.09-1.015-1.436-.007,0Zm-1.193.082.816-1.558,0,0Zm-4.739-2.471-.824,1.553.011.006Zm-1.06,0,.815,1.558.01-.005ZM13.78,21.595l-.815-1.558h0Zm-1.193-.082,1.022-1.431-.007,0Zm-.455-1.09-1.733-.3,0,.01Zm.91-5.268,1.733.3v-.007Zm-.324-.982-1.224,1.262,0,0ZM8.865,10.434,10.09,9.172l-.008-.007ZM8.582,9.292,6.915,8.732l0,.008Zm.912-.757.245,1.741h.007ZM14.8,7.768l-.251-1.74h0Zm.851-.614,1.573.787,0-.005Zm3.936-3.978a.619.619,0,0,1-.228.248L17.517.43a2.9,2.9,0,0,0-1.068,1.163Zm-.228.248a.619.619,0,0,1-.325.092V0a2.9,2.9,0,0,0-1.52.43Zm-.325.092a.619.619,0,0,1-.324-.092L20.556.43A2.9,2.9,0,0,0,19.036,0Zm-.324-.092a.619.619,0,0,1-.228-.248l3.141-1.583A2.9,2.9,0,0,0,20.556.43Zm-.233-.258,2.366,4.769L24,6.373,21.629,1.6Zm2.368,4.774a2.892,2.892,0,0,0,.894,1.051L23.8,6.14a.627.627,0,0,1,.193.228Zm.894,1.051a2.891,2.891,0,0,0,1.279.517l.5-3.481a.627.627,0,0,1,.277.112Zm1.279.517,5.308.767.5-3.481-5.308-.767Zm5.315.768a.632.632,0,0,1-.315-.139l2.247-2.706a2.888,2.888,0,0,0-1.442-.638Zm-.315-.139a.631.631,0,0,1-.195-.284l3.334-1.121a2.888,2.888,0,0,0-.892-1.3Zm-.2-.292a.656.656,0,0,1-.014-.365l3.413.848a2.861,2.861,0,0,0-.06-1.588Zm-.014-.365a.655.655,0,0,1,.183-.316L30.424,11.7a2.859,2.859,0,0,0,.8-1.375Zm.173-.306-3.84,3.737,2.453,2.52,3.84-3.737Zm-3.835,3.732a2.866,2.866,0,0,0-.733,1.167l3.34,1.1a.649.649,0,0,1-.166.264Zm-.733,1.167a2.867,2.867,0,0,0-.1,1.374l3.468-.584a.648.648,0,0,1-.024.311Zm-.1,1.381.91,5.268,3.466-.6-.91-5.268Zm.908,5.258a.649.649,0,0,1,.041-.356l3.246,1.354a2.87,2.87,0,0,0,.182-1.577Zm.041-.356a.648.648,0,0,1,.224-.279l2.03,2.872a2.869,2.869,0,0,0,.992-1.239Zm.217-.274a.617.617,0,0,1,.316-.113l.241,3.509a2.9,2.9,0,0,0,1.486-.533Zm.316-.113a.617.617,0,0,1,.328.069l-1.632,3.115a2.9,2.9,0,0,0,1.545.325Zm.325.067-4.739-2.471-1.626,3.118,4.739,2.471ZM20.391,17.57a2.889,2.889,0,0,0-1.355-.337V20.75a.628.628,0,0,1-.294-.073Zm-1.355-.337a2.888,2.888,0,0,0-1.354.337l1.649,3.106a.628.628,0,0,1-.295.073Zm-1.344.332-4.727,2.471,1.63,3.117,4.727-2.471Zm-4.728,2.472a.617.617,0,0,1,.329-.069l-.241,3.509a2.9,2.9,0,0,0,1.545-.325Zm.329-.069a.617.617,0,0,1,.316.113l-2.043,2.862a2.9,2.9,0,0,0,1.486.533Zm.309.108a.647.647,0,0,1,.224.279L10.579,21.71a2.87,2.87,0,0,0,.992,1.239Zm.224.279a.647.647,0,0,1,.041.356L10.4,20.133a2.87,2.87,0,0,0,.182,1.577Zm.039.366.91-5.268-3.466-.6-.91,5.268Zm.911-5.275a2.867,2.867,0,0,0-.1-1.374l-3.341,1.1a.65.65,0,0,1-.024-.311Zm-.1-1.374a2.868,2.868,0,0,0-.733-1.167L11.5,15.437a.65.65,0,0,1-.166-.264Zm-.729-1.163L10.09,9.172,7.641,11.7l3.852,3.737Zm-3.86-3.745a.656.656,0,0,1,.183.316l-3.413.848a2.861,2.861,0,0,0,.8,1.375Zm.183.316a.656.656,0,0,1-.014.365L6.912,8.74a2.86,2.86,0,0,0-.06,1.588Zm-.017.373a.631.631,0,0,1-.195.284L7.807,7.431a2.886,2.886,0,0,0-.892,1.3Zm-.195.284a.631.631,0,0,1-.315.139L9.249,6.794a2.886,2.886,0,0,0-1.442.638Zm-.308.138,5.308-.767-.5-3.481-5.308.767Zm5.308-.767a2.892,2.892,0,0,0,1.279-.517L14.274,6.14a.626.626,0,0,1,.277-.112Zm1.279-.517a2.892,2.892,0,0,0,.894-1.051L14.08,6.368a.626.626,0,0,1,.194-.228Zm.9-1.056,2.366-4.769L16.444,1.6,14.078,6.373Z"
                transform="translate(9.099)"
                fill="#fe6b74"
              />
              <path
                id="Path_189"
                data-name="Path 189"
                d="M12.8,20.617l.813-1.559h0Zm-.531-.13v0Zm-.531.13.813,1.56h0ZM7.013,23.079,6.2,21.519h0ZM5.817,23,4.8,24.433l0,0Zm-.453-1.093-1.733-.3v0Zm.907-5.266-1.733-.3h0Zm-.321-.982L4.728,16.922l0,0ZM2.1,11.928.873,13.191h0Zm-.281-1.142L.148,10.225l0,.01Zm.912-.757.245,1.741h.007Zm5.306-.767L7.785,7.521h0Zm.853-.614,1.572.787,0-.005Zm2.368-4.769L9.682,3.09l0,.006Zm1.013,1.132a1.758,1.758,0,1,0,.01-3.517ZM13.942,23.2a1.759,1.759,0,0,0,1.626-3.119Zm-.33-4.139a2.907,2.907,0,0,0-1.344-.329v3.517a.608.608,0,0,1-.282-.069Zm-1.344-.329a2.907,2.907,0,0,0-1.344.329l1.626,3.119a.608.608,0,0,1-.282.069Zm-1.344.329L6.2,21.519l1.625,3.119,4.724-2.462ZM6.2,21.52a.606.606,0,0,1,.321-.068l-.234,3.509a2.911,2.911,0,0,0,1.539-.324Zm.321-.068a.608.608,0,0,1,.309.109L4.8,24.436a2.911,2.911,0,0,0,1.483.525Zm.314.113a.648.648,0,0,1,.223.28L3.809,23.191A2.869,2.869,0,0,0,4.8,24.433Zm.223.28a.647.647,0,0,1,.04.356l-3.467-.589a2.869,2.869,0,0,0,.178,1.579Zm.039.36L8,16.939l-3.466-.6-.907,5.266ZM8,16.94a2.863,2.863,0,0,0-.1-1.377L4.562,16.656a.654.654,0,0,1-.023-.315Zm-.1-1.377a2.863,2.863,0,0,0-.733-1.17l-2.443,2.53a.654.654,0,0,1-.167-.267Zm-.731-1.168-3.855-3.73L.873,13.191l3.855,3.73Zm-3.855-3.73a.652.652,0,0,1,.18.312l-3.415.841a2.865,2.865,0,0,0,.789,1.373Zm.18.312a.652.652,0,0,1-.014.36l-3.34-1.1a2.865,2.865,0,0,0-.061,1.583Zm-.017.37a.631.631,0,0,1-.195.284L1.04,8.925a2.886,2.886,0,0,0-.892,1.3Zm-.195.284a.631.631,0,0,1-.315.139L2.482,8.287a2.886,2.886,0,0,0-1.442.638Zm-.308.138L8.284,11l-.5-3.481-5.306.767ZM8.28,11a2.891,2.891,0,0,0,1.282-.516L7.508,7.633a.626.626,0,0,1,.278-.112Zm1.282-.516a2.891,2.891,0,0,0,.9-1.052L7.314,7.861a.626.626,0,0,1,.194-.228Zm.9-1.057,2.368-4.769L9.679,3.1,7.311,7.866Zm2.365-4.763a.624.624,0,0,1-.231.252l-1.843-3A2.894,2.894,0,0,0,9.682,3.09Zm-.231.252a.624.624,0,0,1-.329.092l.01-3.517a2.893,2.893,0,0,0-1.524.429Zm2.973,15.159-1.956-1.02-1.626,3.119,1.956,1.02Z"
                transform="translate(0 2.009)"
                fill="#fe6b74"
              />
              <path
                id="Path_190"
                data-name="Path 190"
                d="M20.684,20.615l-.813-1.559h0Zm1.062,0,.813-1.559h0Zm4.724,2.464.813-1.559h0Zm1.2-.08,1.013,1.437,0,0Zm.453-1.093,1.734-.294v0Zm-.907-5.266,1.733-.3h0Zm.321-.982,1.221,1.265,0,0Zm3.855-3.74-1.223-1.264v0Zm.281-1.142,1.67-.551,0-.01Zm-.912-.757-.251,1.74h.007Zm-5.306-.767.252-1.74h0ZM24.6,8.638l-1.574.783,0,0Zm-2.368-4.76L23.8,3.1l0-.005ZM21.207,1.494a1.758,1.758,0,0,0,.01,3.517Zm-3.315,18.6a1.758,1.758,0,0,0,1.629,3.117ZM21.5,22.174a.608.608,0,0,1-.282.069V18.726a2.908,2.908,0,0,0-1.344.329Zm-.282.069a.608.608,0,0,1-.282-.069l1.626-3.119a2.907,2.907,0,0,0-1.344-.329Zm-.282-.069,4.724,2.464,1.626-3.118L22.56,19.056Zm4.724,2.464a2.912,2.912,0,0,0,1.54.324l-.234-3.509a.606.606,0,0,1,.321.068Zm1.54.324a2.91,2.91,0,0,0,1.483-.525l-2.026-2.875a.609.609,0,0,1,.309-.109Zm1.487-.528a2.87,2.87,0,0,0,.991-1.242l-3.249-1.346a.648.648,0,0,1,.223-.28Zm.991-1.242a2.871,2.871,0,0,0,.178-1.579l-3.467.589a.649.649,0,0,1,.04-.356Zm.177-1.583-.907-5.266-3.466.6.907,5.266Zm-.907-5.267a.654.654,0,0,1-.023.315l-3.343-1.093a2.863,2.863,0,0,0-.1,1.377Zm-.023.315a.652.652,0,0,1-.167.267l-2.443-2.53a2.863,2.863,0,0,0-.733,1.17Zm-.164.264,3.855-3.74-2.449-2.524L26.308,14.4Zm3.853-3.738a2.867,2.867,0,0,0,.789-1.373l-3.415-.841a.653.653,0,0,1,.18-.312Zm.789-1.373a2.867,2.867,0,0,0-.061-1.583L30,11.327a.651.651,0,0,1-.014-.36Zm-.064-1.593a2.888,2.888,0,0,0-.892-1.3L30.2,11.621a.631.631,0,0,1-.2-.284Zm-.892-1.3A2.886,2.886,0,0,0,31,8.278l-.489,3.483a.63.63,0,0,1-.315-.139Zm-1.435-.637L25.7,7.512l-.5,3.481,5.306.767ZM25.7,7.512a.626.626,0,0,1,.278.112l-2.054,2.854a2.89,2.89,0,0,0,1.282.516Zm.278.112a.624.624,0,0,1,.194.228L23.025,9.425a2.889,2.889,0,0,0,.9,1.052Zm.2.232L23.8,3.1,20.655,4.662l2.368,4.76ZM23.8,3.09a2.893,2.893,0,0,0-1.07-1.167l-1.843,3a.621.621,0,0,1-.231-.252Zm-1.07-1.167a2.893,2.893,0,0,0-1.524-.429l.01,3.517a.623.623,0,0,1-.328-.092ZM19.52,23.207,21.5,22.173,19.87,19.056,17.891,20.09Z"
                transform="translate(22.787 2.009)"
                fill="#fe6b74"
              />
              <path
                id="Path_191"
                data-name="Path 191"
                d="M4.008,13.25a1.758,1.758,0,0,0,0,3.517Zm42.2,3.517a1.758,1.758,0,0,0,0-3.517Zm-42.2,0h42.2V13.25H4.008Z"
                transform="translate(3.025 17.817)"
                fill="#fe6b74"
              />
              <path
                id="Path_192"
                data-name="Path 192"
                d="M4.008,21.25a1.758,1.758,0,1,0,0,3.517Zm42.2,3.517a1.758,1.758,0,1,0,0-3.517Zm-42.2,0h42.2V21.25H4.008Z"
                transform="translate(3.025 28.574)"
                fill="#fe6b74"
              />
              <path
                id="Path_193"
                data-name="Path 193"
                d="M4.008,17.25a1.758,1.758,0,1,0,0,3.517Zm32.825,3.517a1.758,1.758,0,0,0,0-3.517Zm-32.825,0H36.833V17.25H4.008Z"
                transform="translate(3.025 23.195)"
                fill="#fe6b74"
              />
            </g>
            <path
              id="comment-line-svgrepo-com"
              d="M28.037,1.854c-14.091,0-25.556,9.812-25.556,21.873A19.833,19.833,0,0,0,7.5,36.634l-.017-.021A21.973,21.973,0,0,1,1.374,47.19l-.007.007a2.169,2.169,0,0,0,1.554,3.682,2.131,2.131,0,0,0,.449-.047l-.014,0a35.993,35.993,0,0,0,15.8-6.717l-.094.068A28.653,28.653,0,0,0,28.039,45.6h0C42.13,45.6,53.6,35.785,53.6,23.725S42.13,1.852,28.039,1.852Zm0,39.415h-.09A24.765,24.765,0,0,1,19.232,39.7l.172.055a1.892,1.892,0,0,0-.269-.043h-.009a2.045,2.045,0,0,0-.49-.078h0a1.916,1.916,0,0,0-.359.057l.014,0a2.019,2.019,0,0,0-.476.118l.014-.005a2.172,2.172,0,0,0-.362.224l.005,0a2.06,2.06,0,0,0-.293.182l.005,0a23.867,23.867,0,0,1-8.3,4.661l-.17.047a22.871,22.871,0,0,0,3.243-8.278l.021-.142c.009-.054-.009-.1,0-.159s.005-.1.005-.161a2.3,2.3,0,0,0-.5-1.428l0,.005c-.033-.04-.043-.088-.08-.126A15.533,15.533,0,0,1,6.813,23.732v-.009c0-9.671,9.521-17.541,21.225-17.541s21.225,7.87,21.225,17.541S39.739,41.266,28.037,41.266Zm14.727-24H15.043a2.166,2.166,0,1,0,0,4.332H42.765a2.166,2.166,0,0,0,0-4.332Zm-15.594,10.4H15.043a2.166,2.166,0,0,0,0,4.332H27.171a2.166,2.166,0,1,0,0-4.332Z"
              transform="translate(813.827 759.635)"
              fill="#02bbb6"
            />
            <path
              id="report-svgrepo-com"
              d="M5.322,1A2.322,2.322,0,0,0,3,3.322V49.763a2.322,2.322,0,1,0,4.644,0V30.254a23.737,23.737,0,0,1,4.627-1.748c3.289-.822,5.929-.519,7.374,1.648,2.7,4.044,7.844,4.4,11.807,4.005A44.62,44.62,0,0,0,41.861,31.6,4.522,4.522,0,0,0,44.8,27.334V11.968a4.847,4.847,0,0,0-6.853-4.327,33.93,33.93,0,0,1-8.7,2.778c-3.1.431-4.894-.152-5.738-1.418C20.462,4.431,15.25,3.89,11.515,4.2a25.926,25.926,0,0,0-3.871.636V3.322A2.322,2.322,0,0,0,5.322,1ZM7.644,9.641V25.16a26.078,26.078,0,0,1,3.5-1.16c3.677-.919,9.164-1.223,12.364,3.577,1.111,1.667,3.672,2.34,7.482,1.96a39.913,39.913,0,0,0,9.162-2.258V11.968c0-.105-.213-.133-.29-.1a38.44,38.44,0,0,1-9.975,3.148c-3.487.486-7.822.189-10.243-3.442-1.6-2.4-4.513-3.016-7.744-2.747A22.293,22.293,0,0,0,7.644,9.641Z"
              transform="translate(1141.9 760.079) rotate(8)"
              fill="#fed363"
              fill-rule="evenodd"
            />
          </g>
        </svg>
      </div>
    </section>
  </div>
</template>

<style scoped>
#item-1 {
  grid-row-start: 1;
  grid-column-start: 1;
  grid-row-end: 2;
  grid-column-end: 3;
  width: 320px;
  height: 120px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 20px #457aef26;
  border-radius: 20px;
  opacity: 1;
  margin-left: -30px;
  /* border: 1px solid red; */
}
#item-2 {
  grid-row-start: 2;
  grid-column-start: 1;
  grid-row-end: 3;
  grid-column-end: 3;
  width: 320px;
  height: 120px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 0px 20px #457aef26;
  border-radius: 20px;
  opacity: 1;
  margin-left: -30px;
}
#item-3 {
  grid-row-start: 1;
  grid-column-start: 3;
  grid-row-end: 3;
  grid-column-end: 6;
  width: 900px;
  height: 270px;
  border-radius: 20px;
  opacity: 1;
  margin-top: -51px;
  margin-left: -5%;
}

#item-1 .item-name,
#item-2 .item-name {
  position: absolute;
  letter-spacing: 0.18px;
  opacity: 1;
  font: normal normal medium 18px/27px Poppins;
  font-family: Poppins;
  font-size: 18px;
  font-weight: 400;
  margin-top: 22px;
}

#item-1 .item-number,
#item-2 .item-number {
  position: absolute;
  font: normal normal 550 40px/60px Poppins;
  letter-spacing: 1.2px;
  color: #19335a;
  opacity: 1;
  margin-top: 45px;
}

#item-1 p,
#item-2 p {
  margin-left: 52px;
  /* margin-top:30px; */
}

#item-3 img {
  width: 340px;
  float: right;
  margin-right: 50px;
  margin-top: -40px;
}

.box-icon {
  width: 58px;
  height: 58px;
  border-radius: 15px;
  opacity: 1;
  float: right;
  margin-top: 10%;
  margin-bottom: 10%;
  margin-right: 8%;
}

.box-icon img {
  height: 35px;
  width: 35px;
  margin: auto auto;
  margin-top: 20%;
  margin-bottom: 20%;
  display: block;
}

.box-line {
  width: 8px;
  height: 75px;
  border-radius: 15px;
  float: left;
  margin-left: 8%;
  margin-top: 22px;
  margin-bottom: 22px;
}

.feature {
  margin-left: 50px;
  margin-top: 60px;
  margin-bottom: 150px;
}
</style>
