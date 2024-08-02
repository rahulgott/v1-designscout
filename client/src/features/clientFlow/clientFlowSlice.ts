import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MockCommentData } from "../../interfaces/types"

interface ClientState {
  inputVisible: boolean
  inputPosition: { x: number; y: number }
  selectedRectIndex: number | null
  viewCommentOnClick: boolean
  currentQuestion: number
  commentData: MockCommentData
  currentScale: number
}

const initialState: ClientState = {
  inputVisible: false,
  inputPosition: { x: 0, y: 0 },
  selectedRectIndex: null,
  viewCommentOnClick: false,
  currentQuestion: 0,
  commentData: {
    lastUpdated: Date.now(),
    scale: "100%",
    devicePixelRatio: 1,
    displayDimensions: {
      width: 1920,
      height: 1080,
    },
    data: [],
  },
  currentScale: 100,
}

const clientFlowSlice = createSlice({
  name: "clientFlow",
  initialState,
  reducers: {
    setInputVisible(state, action: PayloadAction<boolean>) {
      state.inputVisible = action.payload
    },
    setInputPosition(state, action: PayloadAction<{ x: number; y: number }>) {
      state.inputPosition = action.payload
    },
    setSelectedRectIndex(state, action: PayloadAction<number | null>) {
      state.selectedRectIndex = action.payload
    },
    setViewCommentOnClick(state, action: PayloadAction<boolean>) {
      state.viewCommentOnClick = action.payload
    },
    setCurrentQuestion(state, action: PayloadAction<number>) {
      state.currentQuestion = action.payload
    },
    setCommentData(state, action: PayloadAction<MockCommentData>) {
      state.commentData = action.payload
    },
    setCurrentScale(state, action: PayloadAction<number>) {
      state.currentScale = action.payload
    },
  },
})

export const {
  setInputVisible,
  setInputPosition,
  setSelectedRectIndex,
  setViewCommentOnClick,
  setCurrentQuestion,
  setCommentData,
  setCurrentScale,
} = clientFlowSlice.actions
export default clientFlowSlice.reducer
