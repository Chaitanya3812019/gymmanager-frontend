import axios from "axios";
const api = axios.create({
baseURL: "https://gymmanager-backend-xerq.onrender.com/"
});
export default api;
