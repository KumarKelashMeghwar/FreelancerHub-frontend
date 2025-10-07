"use client";
import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";
import { Outlet, Link as RouterLink } from "react-router"

export default function Admin() {

  const {dispatch} = useContext(AuthContext);
  const logoutHandler =() =>{
    dispatch({ action: "LOGOUT"});
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w="260px"
        bg="white"
        shadow="md"
        p={5}
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Flex height={"95%"} direction={"column"}>
          <Box>
            <Heading size="md" mb={6}>
              Admin
            </Heading>

            <VStack align="stretch" spacing={3}>
              <Button
                justifyContent="flex-start"
                variant="ghost"
                as={RouterLink}
                to="/super-admin/"
              >
                <FiHome /> Dashboard
              </Button>
              <Button
                justifyContent="flex-start"
                variant="ghost"
                as={RouterLink}
                to="/super-admin/users"
              >
                <FiUsers /> Users
              </Button>
              <Button
                justifyContent="flex-start"
                variant="ghost"
                as={RouterLink}
                to="/super-admin/settings"
              >
                <FiSettings /> Settings
              </Button>

            </VStack>
          </Box>
        </Flex>

        <Button
          justifyContent="flex-start"
          variant="subtle"
          colorPalette={"red"}
          width={"100%"}
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={8}>
        <Outlet />
      </Box>
    </Flex>
  );
}
