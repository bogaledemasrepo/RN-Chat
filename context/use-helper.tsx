import { createContext, ReactNode, useContext, useState } from "react";

// 1. Define the Interface for the Context Value
interface HelperContextType<T> {
  fetchData: (url: string,method: string, headers:HeadersInit | undefined,body:BodyInit | null | undefined) => Promise<void>;
  isLoading: boolean;
  isError: string | null;
  data: T | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// 2. Create the Context with a default value of undefined
// We use 'any' here for the default, but the Provider will enforce types.
const HelperContext = createContext<HelperContextType<any> | undefined>(undefined);

export const HelperProvider = <T,>({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const fetchData = async (url: string,method: string, headers:HeadersInit | undefined,body:BodyInit | null | undefined) => {
    setIsLoading(true);
    setIsError(null); // Reset error state on new fetch
    try {
      const response = await fetch(url, {
        method: method??"GET",
        headers,body,
      });

      if (!response.ok) {
        console.log(response)
        const errorMsg = `Error: ${response.status} ${response.statusText}`;
       return setIsError(errorMsg);
      }

      const result = await response.json();
     return setData(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fetch error occurred";
      setIsError(message);
      console.log("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HelperContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        fetchData,
        isLoading,
        isError,
        data,
      }}
    >
      {children}
    </HelperContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
export const useHelper = <T,>() => {
  const context = useContext(HelperContext);
  if (context === undefined) {
    throw new Error("useHelper must be used within a HelperProvider");
  }
  return context as HelperContextType<T>;
};