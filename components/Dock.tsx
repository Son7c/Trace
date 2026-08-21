"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "motion/react";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  autoHide?: boolean;
  autoHideDelay?: number;
  triggerDistance?: number;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  label?: React.ReactNode;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center justify-center rounded-xl bg-[#120F17] border-neutral-700 border-2 shadow-md ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={typeof label === "string" ? label : undefined}
    >
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(
              child as React.ReactElement<{ isHovered?: MotionValue<number> }>,
              { isHovered },
            )
          : child,
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#120F17] px-2 py-0.5 text-xs text-white`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  autoHide = true,
  autoHideDelay = 50,
  triggerDistance = 100,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseInDockRef = useRef(false);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const showDock = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsDockVisible(true);
  };

  const hideDock = (delay = autoHideDelay) => {
    if (!autoHide || isMouseInDockRef.current) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      if (!isMouseInDockRef.current) {
        setIsDockVisible(false);
      }
    }, delay);
  };

  useEffect(() => {
    if (!autoHide) {
      setIsDockVisible(true);
      return;
    }

    // Initial timeout to hide dock after load if mouse is not at bottom
    hideDock(2000);

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseInDockRef.current) {
        showDock();
        return;
      }
      const distanceFromBottom = window.innerHeight - e.clientY;
      if (distanceFromBottom <= triggerDistance) {
        showDock();
      } else {
        hideDock();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [autoHide, autoHideDelay, triggerDistance]);

  return (
    <>
      {/* Bottom handle indicator when dock is autohidden */}
      {autoHide && (
        <motion.div
          initial={false}
          animate={{
            opacity: isDockVisible ? 0 : 1,
            y: isDockVisible ? 12 : 0,
            scale: isDockVisible ? 0.8 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onMouseEnter={showDock}
          onClick={showDock}
          className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-50 cursor-pointer group flex flex-col items-center gap-1 p-2 ${
            isDockVisible ? "pointer-events-none" : "pointer-events-auto"
          }`}
          aria-label="Show Dock"
        >
          <div className="h-1.5 w-16 rounded-full bg-neutral-400/40 group-hover:bg-purple-500/80 transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.4)] group-hover:w-20" />
        </motion.div>
      )}

      {/* Main Dock Container */}
      <motion.div
        initial={false}
        animate={{
          y: isDockVisible ? 0 : 90,
          opacity: isDockVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end justify-center ${
          isDockVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onMouseEnter={() => {
          isMouseInDockRef.current = true;
          showDock();
        }}
        onMouseLeave={() => {
          isMouseInDockRef.current = false;
          hideDock();
        }}
        onFocusCapture={() => {
          showDock();
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            hideDock(300);
          }
        }}
      >
        <motion.div
          style={{ height, scrollbarWidth: "none" }}
          className="flex max-w-full items-end"
        >
          <motion.div
            onMouseMove={({ pageX }) => {
              isHovered.set(1);
              mouseX.set(pageX);
              showDock();
            }}
            onMouseLeave={() => {
              isHovered.set(0);
              mouseX.set(Infinity);
            }}
            className={`${className} relative flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4 bg-[#120F17]/90 backdrop-blur-md shadow-2xl`}
            style={{ height: panelHeight }}
            role="toolbar"
            aria-label="Application dock"
          >
            {items.map((item, index) => (
              <DockItem
                key={index}
                onClick={item.onClick}
                className={item.className}
                mouseX={mouseX}
                spring={spring}
                distance={distance}
                magnification={magnification}
                baseItemSize={baseItemSize}
                label={item.label}
              >
                <DockIcon>{item.icon}</DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
