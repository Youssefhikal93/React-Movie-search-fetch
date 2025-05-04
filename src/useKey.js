import { useEffect } from "react";

export default function useKey(onClose) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.addEventListener("keydown", callback);
      };
    },
    [onClose]
  );
}
