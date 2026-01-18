// utils/quill.ts
import type { QuillOptionsStatic } from "quill"

export const quillModules: QuillOptionsStatic["modules"] = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ],
}
