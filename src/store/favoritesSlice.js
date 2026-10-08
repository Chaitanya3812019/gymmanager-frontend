import { createSlice } from "@reduxjs/toolkit";
const stored = localStorage.getItem("favorites");
const initialState = {
items: stored ? JSON.parse(stored) : []
};
const favoritesSlice = createSlice({
name: "favorites",
initialState,
reducers: {
toggleFavorite: (state, action) => {
const exists = state.items.find(
(m) => m.id === action.payload.id
);
if (exists) {
state.items = state.items.filter(
(m) => m.id !== action.payload.id
);
} else {
state.items.push(action.payload);
}
localStorage.setItem(
"favorites",
JSON.stringify(state.items)
);
}
}
});
export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
