import { configureStore } from "@reduxjs/toolkit";
import compareReducer from "../features/compare/compareSlice";

export const store = configureStore({
reducer: {
compare: compareReducer,
},
});