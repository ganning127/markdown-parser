// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import { useEffect } from "react";

function ForceLightMode({ children }) {
  // force light mode b/c of ChakraUI bug
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") return;
    toggleColorMode();
  }, [colorMode]);

  return children;
}

const GlobalStyle = ({ children }) => {
  let { colorMode } = useColorMode();
  return (
    <>
      <Global
        styles={css`
          html {
            min-width: 356px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: #fffff;
          }
        `}
      />
      {children}
    </>
  );
};

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <GlobalStyle>
        <ForceLightMode>
          <Component {...pageProps} />
        </ForceLightMode>
      </GlobalStyle>
    </ChakraProvider>
  );
}

export default MyApp;
