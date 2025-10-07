import { AuthContext } from "../context/AuthContext.jsx";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  VStack,
  CloseButton,
  Button,
  Menu,
  Portal,
  NativeSelect,
  Icon,
  Container,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FiMenu } from "react-icons/fi"
import { GoChevronDown } from "react-icons/go";
import { useNavigate } from "react-router";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  let { user, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();


  const commonLinks = [


  ];

  user = user || JSON.parse(localStorage.getItem("user"));
  let authLinks = null;

  if (!user) {
    authLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" }
    ]
  };

  if (user && user.role == "ROLE_FREELANCER") {

    authLinks = [
      {
        name: "My Business", href: "#",
        subMenu: [
          { name: "Orders", href: "/users/" + String(user.firstName).toLowerCase() + String(user.lastName).toLowerCase() + "/orders" },
          { name: "Gigs", href: "/users/" + String(user.firstName).toLowerCase() + String(user.lastName).toLowerCase() + "/gigs" }
        ]
      },
      { name: user.firstName + " " + user.lastName, href: "/profile" },
      { name: "Logout", href: "/logout" }
    ]
  }

  if (user && user.role == "ROLE_CLIENT") {
    authLinks = [
      { name: "My Orders", href: "#" },
      { name: "Messages", href: "#" },
      { name: "Logout", href: "/logout" }
    ]
  }

  if (user && user.role == "ROLE_ADMIN") {
    authLinks = [
      {
        name: "Logout",
        href: "/logout"
      }
    ];
  }




  const links = [...commonLinks, ...authLinks];

  const logoutHandler = () => {
    dispatch({ action: "LOGOUT" });
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Box bg="gray.100" shadow="sm">
      <Container>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo / Brand */}
          <Box fontWeight="bold" fontSize="lg">
            FreelancerHub
          </Box>

          {/* Desktop Links */}
          <HStack as="nav" display={{ base: "none", md: "flex" }}>
            {links.map((link) => {
              if (link.name === "Logout") {
                return (
                  <Button key={link.name} onClick={logoutHandler}>
                    {link.name}
                  </Button>
                )
              }
              if (link.name === "My Business") {
                return (
                  <Menu.Root key={link.name}>
                    <Menu.Trigger asChild>
                      <Button variant="outline" size="sm">
                        {link.name}
                        <Icon as={GoChevronDown} />
                      </Button>
                    </Menu.Trigger>

                    <Menu.Positioner>
                      <Menu.Content>
                        {link.subMenu.map((sItem) => (
                          <Menu.Item key={sItem.name} value={sItem.href} onClick={() => navigate(sItem.href)}>
                            <Link href={sItem.href}>{sItem.name}</Link>
                          </Menu.Item>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                )
              }
              else
                return (
                  <Link key={link.name} href={link.href} margin={2}>
                    {link.name}
                  </Link>
                );

            })}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            colorPalette={"blue"}
            size="md"
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={() => setOpen(true)}
          >
            <FiMenu />
          </IconButton>
        </Flex>

        {/* Mobile Menu Drawer */}
        {open && (
          <Box pb={4} display={{ md: "none" }}>
            <VStack as="nav" spacing={4} align="stretch">
              <CloseButton alignSelf="flex-end" onClick={() => setOpen(false)} />
              {links.map((link) => {
                if (link.name === "Logout") {
                  return (
                    <Button key={link.name} onClick={logoutHandler}>
                      {link.name}
                    </Button>
                  )
                }
                else
                  return (
                    <Link key={link.name} href={link.href} margin={2}>
                      {link.name}
                    </Link>
                  );

              })}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  )
}
