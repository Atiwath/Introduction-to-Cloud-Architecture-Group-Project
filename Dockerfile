FROM node:16
WORKDIR /usr/src/app
COPY package.json package*.json ./
##RUN npm install --only=production
RUN npm install npm install bcrypt  
RUN npm install npm install cookie-session 
RUN npm install npm install ejs 
RUN npm install npm install express  
RUN npm install npm install express-validator 
RUN npm install npm install mysql2  
RUN npm install npm install nodemon  
##RUN npm install child_process
##RUN npm install @google-cloud/storage
COPY . .
CMD [ "npm", "start" ]