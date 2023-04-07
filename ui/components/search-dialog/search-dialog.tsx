import { KBarProvider } from "kbar";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { CommandBarMethods } from "../../shared/types/search-dialog.types";
import { CommandBar } from "./command-bar";

interface SearchDialog {
  children: ReactNode;
}

export const SearchDialog = forwardRef((props: SearchDialog, ref) => {
  const commandBarRef = useRef<CommandBarMethods>(null);

  useImperativeHandle(ref, () => ({
    toggle() {
      commandBarRef.current.toggle();
    },
  }));

  return (
    <KBarProvider>
      {props.children}
      <CommandBar ref={commandBarRef} />
    </KBarProvider>
  );
});
