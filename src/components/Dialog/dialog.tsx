import { FC, ReactNode, useEffect, useRef } from "react";
// import { useAtom } from "jotai";

// import { dialogHeight } from "../../atoms";

import styles from "./dialog.module.scss";
import { useDiealogHeightStore } from "@stores/";

export const Dialog: FC<{
  show: boolean;
  changeShow: (val: boolean) => void;
  children?: ReactNode;
  className?: string;
  closeOnCLick?: boolean;
}> = ({ show, children, className = "", changeShow, closeOnCLick = true }) => {
  
  const {height} = useDiealogHeightStore()
  // const [height] = useAtom(dialogHeight);
  // const [scrolled] = useAtom(scrollHeight);
  
  const ref = useRef<HTMLDialogElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      show ? ref.current.show() : ref.current.close();
    }
  }, [show]);

  return (
    <dialog
      className={`${styles.dialog} ${className}`}
      ref={ref}
      onClose={() => changeShow(false)}
      onClick={(e) => {
        if (e.target === ref.current && closeOnCLick) {
          ref.current.close();
        }
      }}
      open={show}
      style={{height: height}}
      // style={{height: "100vh", top: scrolled}}
    >
      <form 
      method="dialog"
      // style={{top: `calc(50% - 30vh)`}}
      >{children}</form>
    </dialog>
  );
};
