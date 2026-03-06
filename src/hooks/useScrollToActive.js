import { useEffect, useCallback, useRef } from "react";

export function useScrollToActive(activeItem) {
  const scrollContainerRef = useRef(null);

  const scrollToActive = useCallback(() => {
    if (!activeItem?.stationuuid || !scrollContainerRef.current) {
      return;
    }

    const element = scrollContainerRef.current.querySelector(
      `[data-station-uuid="${activeItem.stationuuid}"]`,
    );

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [activeItem]);

  useEffect(() => {
    if (activeItem?.stationuuid) {
      setTimeout(() => {
        scrollToActive();
      }, 50);
    }
  }, [activeItem?.stationuuid]);

  return {
    scrollContainerRef,
    scrollToActive,
  };
}
