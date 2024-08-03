import { useCallback, useEffect, useRef, useState } from "react"
import SpeechRecognition from "react-speech-recognition"
import { toPng } from "html-to-image"
import { uploadImage } from "../api/apiService"
import { Comment, MockCommentData } from "../interfaces/types"
import { useDispatch, useSelector } from "react-redux"
import {
  setCommentData,
  setInputPosition,
  setInputValue,
  setInputVisible,
  setSelectedRectIndex,
  setViewCommentOnClick,
} from "../features/clientFlow/clientFlowSlice"
import { AppDispatch, RootState } from "../store"

export function useDraggableArea() {
  const dispatch = useDispatch<AppDispatch>()

  const {
    inputVisible,
    inputPosition,
    inputValue,
    selectedRectIndex,
    viewCommentOnClick,
    currentQuestion,
    commentData,
  } = useSelector((state: RootState) => state.clientFlow)

  const [rectangles, setRectangles] = useState<Comment[]>([])
  const [currentRect, setCurrentRect] = useState<Comment | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [endPosition, setEndPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [rectIndex, setRectIndex] = useState<number>(0)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [recentImageUrl, setRecentImageUrl] = useState<string | null>()
  const screenshotRef = useRef<HTMLDivElement>(null)
  const devicePixelRatio = window.devicePixelRatio || 1

  useEffect(() => {
    const existingIndex = commentData.data.findIndex(
      (item) => item.index === currentQuestion
    )
    if (existingIndex === -1) {
      const newCommentData: MockCommentData = {
        ...commentData,
        data: [
          ...commentData.data,
          { index: currentQuestion, commentData: [] },
        ],
      }
      dispatch(setCommentData(newCommentData))
    }
    // Update rectangles from the Redux store to ensure they are in sync
    setRectangles(
      commentData.data.find((item) => item.index === currentQuestion)
        ?.commentData || []
    )
  }, [currentQuestion, commentData, rectangles, dispatch])

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      const inputArea = target.closest(".input-area") // Assuming you add a class to identify input areas
      const viewCommentArea = target.closest("view-comment-area")

      if (!viewCommentArea) {
        dispatch(setViewCommentOnClick(false))
      }
      // Click is outside and input is visible
      if (!inputArea) {
        if (inputVisible) {
          if (inputValue.trim() !== "") {
            submitComment(inputValue) // Submit if there's text
          } else {
            // Optionally handle empty input cases, e.g., removing an unfinished rectangle
            if (selectedRectIndex != null) {
              const updatedCommentData = {
                ...commentData,
                data: commentData.data.map((item) =>
                  item.index === currentQuestion
                    ? {
                        ...item,
                        commentData: item.commentData.filter(
                          (_, idx) => idx !== selectedRectIndex
                        ),
                      }
                    : item
                ),
              }
              dispatch(setCommentData(updatedCommentData))
            }
          }

          dispatch(setInputVisible(false))
          setCurrentRect(null)
          dispatch(setInputValue(""))
          dispatch(setSelectedRectIndex(null))
        } else {
          const rect = e.currentTarget.getBoundingClientRect()
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop
          const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft
          setStartPosition({
            x: e.clientX - rect.left - scrollLeft,
            y: e.clientY - rect.top - scrollTop,
          })
          setEndPosition({
            x: e.clientX - rect.left - scrollLeft,
            y: e.clientY - rect.top - scrollTop,
          })
          setIsDragging(true)
          setCurrentRect(null) // Reset current rectangle
          SpeechRecognition.stopListening()
        }
      }
    },
    [inputVisible, inputValue, setInputVisible, setInputValue, dispatch]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !startPosition) return
      const rect = e.currentTarget.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft
      const currentX = e.clientX - rect.left - scrollLeft
      const currentY = e.clientY - rect.top - scrollTop
      const width = Math.abs(currentX - startPosition.x)
      const height = Math.abs(currentY - startPosition.y)

      setEndPosition({ x: e.clientX, y: e.clientY })

      if (width > 12 || height > 12) {
        setCurrentRect({
          x: Math.min(startPosition.x, currentX),
          y: Math.min(startPosition.y, currentY),
          width: width,
          height: height,
          index: rectIndex,
          displayOrder: rectIndex,
          imageUrl: "",
          comment: "",
          lastUpdated: Date.now(),
        })
      }
    },
    [isDragging, startPosition]
  )

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      if (
        currentRect &&
        startPosition &&
        Math.abs(mouseX - startPosition.x) > 12 &&
        Math.abs(mouseY - startPosition.y) > 12
      ) {
        takeScreenshot()

        const updatedRectangles = [
          ...rectangles,
          {
            ...currentRect,
            x: Math.min(startPosition.x, mouseX),
            y: Math.min(startPosition.y, mouseY),
            width: Math.abs(mouseX - startPosition.x),
            height: Math.abs(mouseY - startPosition.y),
            comment: inputValue,
            lastUpdated: Date.now(),
          },
        ]

        dispatch(
          setCommentData({
            ...commentData,
            data: commentData.data.map((d) =>
              d.index === currentQuestion
                ? { ...d, commentData: updatedRectangles }
                : d
            ),
          })
        )

        setRectangles(updatedRectangles)

        dispatch(
          setSelectedRectIndex(
            commentData.data[currentQuestion].commentData.length
          )
        )

        dispatch(
          setInputPosition({
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top,
          })
        )
        dispatch(setInputVisible(true))
        dispatch(setInputValue("")) // Clear input after setting
      }
      setIsDragging(false)
      setStartPosition(null)
      setRectIndex(rectIndex + 1)
    },
    [
      currentRect,
      inputValue,
      setInputValue,
      commentData,
      rectIndex,
      setRectIndex,
      rectangles,
      setRectangles,
      dispatch,
    ]
  )

  const takeScreenshot = useCallback(async () => {
    if (
      !screenshotRef.current ||
      !currentRect ||
      !startPosition ||
      !endPosition
    )
      return

    const rect = screenshotRef.current.getBoundingClientRect()
    const offsetX =
      (Math.min(startPosition.x, endPosition.x) - rect.left) * devicePixelRatio
    const offsetY =
      (Math.min(startPosition.y, endPosition.y) - rect.top) * devicePixelRatio
    const width = Math.abs(endPosition.x - startPosition.x) * devicePixelRatio
    const height = Math.abs(endPosition.y - startPosition.y) * devicePixelRatio

    const dataUrl = await toPng(screenshotRef.current)
    const cropCanvas = document.createElement("canvas")
    const ctx = cropCanvas.getContext("2d")
    if (ctx) {
      const img = new Image()
      img.onload = async () => {
        cropCanvas.width = width
        cropCanvas.height = height
        ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, width, height)
        cropCanvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const data = await uploadImage(blob)
              if (data && data.url) {
                setRecentImageUrl(data.url)
                setImageUploaded(true) // Set the flag when upload is successful
              }
            } catch (error) {
              console.error("Error uploading image to S3:", error)
              setImageUploaded(false)
            }
          }
        }, "image/png")
      }
      img.src = dataUrl
    } else {
      throw new Error("Failed to get drawing context from canvas")
    }
  }, [screenshotRef, currentRect, startPosition, endPosition, devicePixelRatio])

  const submitComment = useCallback(
    (inputValue: string) => {
      if (inputValue.trim() !== "" && selectedRectIndex !== null) {
        // Directly update the local rectangles array
        const updatedRectangles = rectangles.map((rect, index) => {
          if (index === selectedRectIndex) {
            return {
              ...rect,
              comment: inputValue,
              time: Date.now(),
              imageUrl: imageUploaded ? recentImageUrl : rect.imageUrl,
            }
          }
          return rect
        })

        // Update the local state for rectangles
        setRectangles(updatedRectangles)

        // Prepare updated comment data for Redux
        const updatedCommentData = {
          ...commentData,
          data: commentData.data.map((item) =>
            item.index === currentQuestion
              ? { ...item, commentData: updatedRectangles }
              : item
          ),
        }

        // Dispatch updated comment data to Redux
        dispatch(setCommentData(updatedCommentData))

        // Reset UI related states
        dispatch(setInputVisible(false))
        setCurrentRect(null)
        setImageUploaded(false)
        dispatch(setInputValue("")) // Clear the input field after submitting
      }
    },
    [
      dispatch,
      rectangles,
      selectedRectIndex,
      commentData,
      currentQuestion,
      imageUploaded,
      recentImageUrl,
      setRectangles,
      setInputVisible,
      setCurrentRect,
      setImageUploaded,
      setInputValue,
    ]
  )

  const showInputOnClick = useCallback(
    (index: number) => {
      const rect = commentData.data[currentQuestion].commentData[index]
      if (rect) {
        dispatch(setViewCommentOnClick(false))
        dispatch(
          setInputPosition({
            x: +rect.x + +rect.width,
            y: +rect.y + +rect.height,
          })
        )
        dispatch(setInputVisible(true))
        dispatch(setSelectedRectIndex(index))
        dispatch(setInputValue(rect.comment)) // Set inputValue when an existing rectangle is clicked
      }
    },
    [
      commentData,
      setInputVisible,
      setInputValue,
      setSelectedRectIndex,
      dispatch,
    ]
  )

  return {
    currentRect,
    setCurrentRect,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    inputVisible,
    setInputVisible,
    inputPosition,
    submitComment,
    showInputOnClick,
    inputValue,
    setInputValue,
    selectedRectIndex,
    setSelectedRectIndex,
    screenshotRef,
    commentData,
    viewCommentOnClick,
    setViewCommentOnClick,
  }
}
