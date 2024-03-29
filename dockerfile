#Step 1 Build vue Project
FROM node:lts-alpine AS build
WORKDIR /frontend
COPY package*.json ./
RUN npm install
#RUN npm i daisyui
#RUN npm i flowbite
COPY . .
# RUN npm ci
RUN ls
RUN npm run build
# EXPOSE 3000
# CMD ["npm", "run", "dev"]

#Step 2 Create Nginx server
FROM nginx:stable-alpine as production-stage
COPY --from=build /frontend/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
