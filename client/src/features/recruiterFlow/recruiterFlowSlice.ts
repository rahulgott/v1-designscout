import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface RecruiterState {
  currentProfile: number
}

const initialState: RecruiterState = {
  currentProfile: 0,
}

const recruiterFlowSlice = createSlice({
  name: "recruiterFlow",
  initialState,
  reducers: {
    setCurrentProfile(state, action: PayloadAction<number>) {
      state.currentProfile = action.payload
    },
  },
})

export const { setCurrentProfile } = recruiterFlowSlice.actions
export default recruiterFlowSlice.reducer
