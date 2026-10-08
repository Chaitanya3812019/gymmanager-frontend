import api from "./api";
export async function registerStaff(data) {
return api.post("/staff", data);
}
export async function loginStaff(email, password) {
const response = await api.get(
`/staff?email=${email}&password=${password}`
);
return response.data[0];
}
