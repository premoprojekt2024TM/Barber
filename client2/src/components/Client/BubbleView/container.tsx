"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
//@ts-ignore
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import HairdresserBubble from "./bubble";
import type { Hairdresser } from "./hairdresser";
import AppointmentPopover from "./popover";

interface BubbleContainerProps {
  items: Hairdresser[];
  selectedHairdresserId?: number | null;
  onSelectHairdresser: (hairdresser: Hairdresser | null) => void;
}

export default function BubbleContainer({
  items,
  selectedHairdresserId,
  onSelectHairdresser,
}: BubbleContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [selectedHairdresser, setSelectedHairdresser] =
    useState<Hairdresser | null>(null);
  const [selectedBubbleElement, setSelectedBubbleElement] =
    useState<HTMLElement | null>(null);

  const options = {
    size: 120,
    minSize: 40,
    gutter: 16,
    provideProps: true,
    numCols: 5,
    fringeWidth: 60,
    yRadius: 180,
    xRadius: 180,
    cornerRadius: 60,
    showGuides: false,
    compact: true,
    gravitation: 5,
  };

  useEffect(() => {
    if (selectedHairdresserId) {
      const hairdresser = items.find((h) => h.id === selectedHairdresserId);
      if (hairdresser) {
        setSelectedHairdresser(hairdresser);

        setTimeout(() => {
          const bubbleElements = document.querySelectorAll(".bubble-item");
          const index = items.findIndex((h) => h.id === selectedHairdresserId);

          if (index >= 0 && index < bubbleElements.length) {
            const element = bubbleElements[index] as HTMLElement;
            setSelectedBubbleElement(element);

            // Get the bubble container
            const container = document.querySelector("._2MD0k") as HTMLElement;
            if (container && element) {
              // Calculate the center position of the element relative to the container
              const rect = element.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              // Scroll to center the element
              container.scrollTo({
                left:
                  rect.left -
                  containerRect.left -
                  containerRect.width / 2 +
                  rect.width / 2,
                top:
                  rect.top -
                  containerRect.top -
                  containerRect.height / 2 +
                  rect.height / 2,
                behavior: "smooth",
              });

              // Highlight the bubble
              element.classList.add("scale-110");
              setTimeout(() => {
                element.classList.remove("scale-110");
              }, 1000);

              // Set popover position based on the bubble's position
              const bubbleRect = element.getBoundingClientRect();
              setPopoverPosition({
                x: bubbleRect.left + bubbleRect.width / 2,
                y: bubbleRect.top + bubbleRect.height / 2,
              });
            }
          }
        }, 100);
      }
    }
  }, [selectedHairdresserId, items]);

  useEffect(() => {
    const bubbles = document.querySelector("._2MD0k") as HTMLElement;
    if (!bubbles) return;

    bubblesRef.current = bubbles;

    const images = document.querySelectorAll(".bubble-item");
    images.forEach((img) => {
      img.ondragstart = () => false;
    });

    const dragSpeed = 2;
    let isDown = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;

    bubbles.addEventListener("mousedown", (e) => {
      isDown = true;
      bubbles.classList.add("active");
      startX = e.pageX - bubbles.offsetLeft;
      startY = e.pageY - bubbles.offsetTop;
      scrollLeft = bubbles.scrollLeft;
      scrollTop = bubbles.scrollTop;
    });

    bubbles.addEventListener("mouseleave", () => {
      isDown = false;
      bubbles.classList.remove("active");
    });

    bubbles.addEventListener("mouseup", () => {
      isDown = false;
      bubbles.classList.remove("active");
    });

    bubbles.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - bubbles.offsetLeft;
      const y = e.pageY - bubbles.offsetTop;
      const walkX = (x - startX) * dragSpeed;
      const walkY = (y - startY) * dragSpeed;
      bubbles.scrollLeft = scrollLeft - walkX;
      bubbles.scrollTop = scrollTop - walkY;
    });
  }, []);

  const handleBubbleClick = (
    hairdresser: Hairdresser,
    event: React.MouseEvent,
  ) => {
    // Close popover if clicking the same hairdresser again
    if (selectedHairdresser?.id === hairdresser.id) {
      setSelectedHairdresser(null);
      setSelectedBubbleElement(null);
      onSelectHairdresser(null);
      return;
    }

    // Set the selected bubble element
    const element = event.currentTarget as HTMLElement;
    setSelectedBubbleElement(element);

    // Set position for popover based on the bubble's position
    const rect = element.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    // Set selected hairdresser
    setSelectedHairdresser(hairdresser);
    onSelectHairdresser(hairdresser);
  };

  const closePopover = () => {
    setSelectedHairdresser(null);
    setSelectedBubbleElement(null);
    onSelectHairdresser(null);
  };

  // Update popover position when scrolling or resizing
  useEffect(() => {
    const updatePopoverPosition = () => {
      if (selectedBubbleElement && selectedHairdresser) {
        const rect = selectedBubbleElement.getBoundingClientRect();
        setPopoverPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    window.addEventListener("scroll", updatePopoverPosition);
    window.addEventListener("resize", updatePopoverPosition);

    const bubbles = document.querySelector("._2MD0k") as HTMLElement;
    if (bubbles) {
      bubbles.addEventListener("scroll", updatePopoverPosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePopoverPosition);
      window.removeEventListener("resize", updatePopoverPosition);
      if (bubbles) {
        bubbles.removeEventListener("scroll", updatePopoverPosition);
      }
    };
  }, [selectedBubbleElement, selectedHairdresser]);

  const children = items.map((item, i) => (
    <HairdresserBubble
      key={i}
      hairdresser={item}
      onClick={(e) => handleBubbleClick(item, e)}
      isSelected={selectedHairdresser?.id === item.id}
    />
  ));

  return (
    <div ref={containerRef} className="w-full relative">
      <BubbleUI
        options={options}
        className="w-full h-[700px] bg-gray-50 rounded-xl"
      >
        {children}
      </BubbleUI>

      {selectedHairdresser && selectedBubbleElement && (
        <AppointmentPopover
          hairdresser={selectedHairdresser}
          position={popoverPosition}
          onClose={closePopover}
        />
      )}
    </div>
  );
}
