import { useEffect } from "react";

type KeyBindings = {
  [key: string]: () => void;
};

export const useKeyboardShortcut = (keyBindings: KeyBindings) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key;
      keyBindings[key]?.();
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [keyBindings]);
};
