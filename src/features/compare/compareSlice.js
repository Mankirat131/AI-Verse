import { createSlice } from "@reduxjs/toolkit";

const compareSlice = createSlice({
    name: "compare",

    initialState: {
    savedComparisons: [],
    },

    reducers: {
    saveComparison: (state, action) => {
        const comparison = action.payload;

        const alreadyExists = state.savedComparisons.some(
        (item) =>
            (item.tool1Id === comparison.tool1Id &&
            item.tool2Id === comparison.tool2Id) ||
            (item.tool1Id === comparison.tool2Id &&
            item.tool2Id === comparison.tool1Id)
        );

        if (!alreadyExists) {
        state.savedComparisons.push(comparison);
        }
    },

    removeComparison: (state, action) => {
        state.savedComparisons = state.savedComparisons.filter(
        (item) => item.id !== action.payload
        );
    },
    },
});

export const { saveComparison, removeComparison } =
    compareSlice.actions;

export default compareSlice.reducer;