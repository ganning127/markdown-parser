import { Box, Flex, Text, Img, Button, Icon } from "@chakra-ui/react";
import * as React from "react";
import { NavContent } from "./NavContent";
import { useEffect, useState } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs";

export const NavBar = () => {
  return (
    <Box
      py={4}
      position="sticky"
      top="0"
      id="navbar"
      transition="all 0.4s"
      zIndex={999999}
    >
      <Box as="header" position="relative">
        <Box
          height="100%"
          mx="auto"
          px={{
            base: "8",
            md: "8",
          }}
          pe={{
            base: "8",
            md: "8",
          }}
        >
          <Flex
            as="nav"
            aria-label="Site navigation"
            align="center"
            justify="space-between"
            height="100%"
          >
            <Flex d="flex" alignItems="center" as="a" href="/">
              <Img src="/mp_logo.png" h="10" display="inline" mr="3" />
              <Text
                as="h1"
                fontSize="xl"
                fontWeight="extrabold"
                maxW="48rem"
                display="inline"
                color="brandLight.blue"
              >
                Markdown Parser
              </Text>
            </Flex>
            {/* <NavContent.Desktop
              display={{
                base: "none",
                md: "flex",
              }}
            />
            <NavContent.Mobile
              display={{
                base: "flex",
                md: "none",
              }}
            /> */}
            <Box
              display={{
                base: "none",
                md: "block",
              }}
            >
              <SignedIn>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <Button as="a" href="/sign-in" size="sm" colorScheme="blue">
                  Sign In
                </Button>
              </SignedOut>
              {/* <Link
                href="https://wiki.verste.org/"
                bg="brandLight.caroBlue"
                _hover={{
                  bg: "brandLight.caroBlue",
                }}
                px={2}
                py={1}
                rounded="md"
                d="flex"
                alignItems="center"
                isExternal
              >
                <Text as="span">Start Reading</Text>
              </Link> */}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
