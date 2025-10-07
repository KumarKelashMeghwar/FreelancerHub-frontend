import { AuthContext } from "@/context/AuthContext";
import {
  Box,
  Container,
  Flex,
  Heading,
  Tabs,
  Table,
  Checkbox,
  Image,
  Text,
  Select,
  Menu,
  Icon,
  Portal,
  NativeSelect,
  Button,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link as RouterLink } from "react-router";



const Gigs = () => {

  const [gigs, setGigs] = useState([]);

  let { user, token } = useContext(AuthContext);

  user = user || JSON.parse(localStorage.getItem("user"));
  token = token || localStorage.getItem("token");


  const fetchGigs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gigs/my-gigs", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      if (response.status == 200) {
        setGigs(response.data)
      }
    } catch (er) {
      console.error("Error while fetching gigs", er);
    }
  }

  useEffect(() => {
    fetchGigs();
  }, [])

  const handleDelete = async (gigId) => {

    try {
      let isConfirmed = confirm("Do you want to delete this gig?");

      if (!isConfirmed) {
        return;
      }

      const response = await axios.delete("http://localhost:8080/api/gigs/delete/" + gigId, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response.status == 201) {
        alert(response.data);
        window.location.reload()
      }
      else {
        alert("Something went wrong.")
      }

    } catch (error) {
      console.error("Error deleting gig: " + error);
    }


  }



  return (
    <Container mt={10}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Heading size="2xl" fontWeight="light">
          Gigs
        </Heading>
        <Button as={RouterLink} to={`/users/${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}/create_gig`}>
          Create Gig
        </Button>
      </Flex>


      <Box mt={6} borderWidth="1px" rounded="md" overflowX="auto">
        <Table.Root>
          <Table.Header>
            <Table.Row>

              <Table.ColumnHeader>Gig</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {gigs.map((gig, i) => (
              <Table.Row key={gig.id}>

                <Table.Cell>
                  <Flex alignItems={"center"}>
                    <Image src={`http://localhost:8080${gig.images[0]}`} maxW={"85px"} maxH={"72px"} mr={"1rem"} />
                    <Text fontSize={"xl"}>{gig.title}</Text>
                  </Flex>
                </Table.Cell>


                <Table.Cell>
                  <Menu.Root>
                    <Menu.Trigger>
                      <Icon size={"xl"} cursor={"pointer"} border={"2px solid grey"}>
                        <MdOutlineArrowDropDown />
                      </Icon>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="gig_preview">Preview</Menu.Item>
                          <Menu.Item value="gig_edit" as={RouterLink} to={`/users/${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}/create_gig?edit=1&gigId=${gig.id}`}>Edit</Menu.Item>
                          <Menu.Item onClick={() => handleDelete(gig.id)} value="gig_delete">Delete</Menu.Item>

                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>


        </Table.Root>
      </Box>





      <Spacer />



    </Container>
  );
};

export default Gigs;
