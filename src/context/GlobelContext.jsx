import { createContext, useState } from "react";
export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [pageLevelLoader, setPageLevelLoader] = useState(false);
  const [price, setPrice] = useState();
  const [realprice, setRealPrice] = useState();
  // const [isAuthUser, setIsAuthUser] = useState({});

  return (
    <GlobalContext.Provider
      value={{
        pageLevelLoader,
        setPageLevelLoader,
        realprice,
        setRealPrice,
        price,
        setPrice,
        // isAuthUser,
        // setIsAuthUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
