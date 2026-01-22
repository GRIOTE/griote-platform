// utils/quill.ts
import type { QuillOptions } from "quill"

export const quillModules: QuillOptions["modules"] = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"]
  ],
}
