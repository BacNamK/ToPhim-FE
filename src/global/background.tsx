import { useState, createContext, type SetStateAction } from "react";
import { Toaster } from "sonner";

interface BgContextType {
  background: boolean;
  setBackground: React.Dispatch<SetStateAction<boolean>>;
}

export const BgGlobal = createContext<BgContextType | null>(null);

const BgProvider = ({ children }: any) => {
  const [background, setBackground] = useState(true);

  return (
    <BgGlobal.Provider value={{ background, setBackground }}>
      {children}
      <Toaster />
    </BgGlobal.Provider>
  );
};

export default BgProvider;
