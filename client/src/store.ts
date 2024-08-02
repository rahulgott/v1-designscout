import { configureStore } from "@reduxjs/toolkit"
import appStateReducer from "./features/appState/appStateSlice"
import clientFlowReducer from "./features/clientFlow/clientFlowSlice"
import recruiterFlowReducer from "./features/recruiterFlow/recruiterFlowSlice"

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    clientFlow: clientFlowReducer,
    recruiterFlow: recruiterFlowReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
