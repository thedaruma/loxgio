import EventBus from "Lib/EventBus";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";

const Popover = ({
  trigger,
  popover,
  triggerProps,
}: {
  trigger: JSX.Element;
  popover: JSX.Element;
  triggerProps?: Record<string, unknown>;
}) => {
  const id = new Date().getTime();

  const resetPopover = ({ id: openedId }) => {
    if (openedId !== id && mounted.current) {
      setOpen(false);
    }
  };

  useEffect(() => {
    EventBus.on("popover-opened", resetPopover);
    mounted.current = true;
    return () => {
      mounted.current = false;
      EventBus.remove("popover-opened", resetPopover);
    };
  }, []);

  const referenceElement = useRef(null);
  const popperElement = useRef(null);
  const [open, setOpen] = useState(false);
  const mounted = useRef(false);

  const handleOpen = (open: boolean) => {
    EventBus.dispatch("popover-opened", { id });
    setOpen(open);
  };

  const { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  return (
    <>
      <button
        type="button"
        ref={referenceElement}
        onMouseEnter={() => handleOpen(true)}
        onMouseLeave={() => handleOpen(false)}
        onFocus={() => handleOpen(true)}
        onBlur={() => handleOpen(false)}
        onPointerDown={() => {
          handleOpen(false);
        }}
        {...triggerProps}
      >
        {trigger}
      </button>
      <div
        ref={popperElement}
        style={{
          ...styles.popper,
          zIndex: 1000,
          visibility: open ? "visible" : "hidden",
        }}
        {...attributes.popper}
      >
        {popover}
      </div>
    </>
  );
};

export default Popover;
