import { atom } from "recoil";

let defaultUser;

try {
    defaultUser = JSON.parse(localStorage.getItem('user')) || {};
} catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    defaultUser ={}; // fallback to an empty object in case of error
}

const userAtom = atom({
    key: "userAtom",
    default: defaultUser,
});

export default userAtom;
