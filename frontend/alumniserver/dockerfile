FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]