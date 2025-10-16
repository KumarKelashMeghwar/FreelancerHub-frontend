"use client";

import {
    Box,
    Avatar,
    Text,
    Flex,
    VStack,
    HStack,
    Icon,
    SimpleGrid,
    Card,
    Heading,
    Button,
    Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { useParams } from "react-router";

export default function UserDetails() {
    const [user, setUser] = useState(null);
    const [userNotFound, setUserNotFound] = useState(true);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    async function findUser(userId) {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/users/getUser?userId=" + userId
            );

            if (response.status == 200) {

                setUser(response.data)
                setUserNotFound(false);
            } else {

                setUserNotFound(true);
            }

        } catch (error) {
            console.log("Error while fetching user", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        findUser(id);
    }, []);



    if (loading) {
        return (
            <Flex justify="center" align="center" h="80vh">
                <Text fontSize="lg" color="gray.600">
                    Loading...
                </Text>
            </Flex>
        );
    }

    if (userNotFound || !user) {
        return (
            <Flex justify="center" align="center" h="80vh">
                <Text fontSize="lg" color="gray.600">
                    User Not Found!
                </Text>
            </Flex>
        );
    }

    const { firstName, lastName, profile } = user;
    const fullName = `${firstName} ${lastName}`;

    return (
        <Box p={{ base: 4, md: 10 }} bgGradient="linear(to-b, teal.50, teal.100)" minH="100vh">
            {/* HEADER SECTION */}
            <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                gap={8}
                bg="white"
                p={8}
                borderRadius="2xl"
                boxShadow="md"
            >
                <HStack spacing={6} align="center">
                    <Avatar.Root size="2xl">
                        <Avatar.Fallback name={fullName} />
                        <Avatar.Image
                            src={
                                profile.avatar ||
                                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                            }
                        />
                    </Avatar.Root>
                    <VStack align="start" spacing={1}>
                        <Heading fontSize="2xl" color="teal.700">
                            {fullName}
                        </Heading>
                        <Text fontSize="md" color="gray.500">
                            {profile.tagline || "No tagline yet"}
                        </Text>

                        <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    as={CiStar}
                                    color={i < Math.round(profile.averageRating) ? "yellow.400" : "gray.300"}
                                />
                            ))}
                            <Text fontSize="sm" color="gray.600">
                                {profile.averageRating.toFixed(1)} ({profile.totalReviews} reviews)
                            </Text>
                        </HStack>
                    </VStack>
                </HStack>

                <Button colorScheme="teal" size="md" variant="solid">
                    Contact
                </Button>
            </Flex>

            {/* DESCRIPTION SECTION */}
            <Box
                mt={10}
                bg="white"
                p={6}
                borderRadius="2xl"
                boxShadow="sm"
                border="1px solid"
                borderColor="teal.100"
            >
                <Heading fontSize="xl" mb={3} color="teal.700">
                    About
                </Heading>
                <Text color="gray.700" fontSize="md">
                    {profile.description || "This freelancer hasn't added a description yet."}
                </Text>
            </Box>

            {/* GIGS SECTION */}
            <Box mt={10}>
                <Heading fontSize="xl" mb={4} color="teal.700">
                    Gigs
                </Heading>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                    {profile.gigs.map((gig) => (
                        <Card.Root
                            key={gig.id}
                            bg="white"
                            borderRadius="xl"
                            boxShadow="md"
                            border="1px solid"
                            borderColor="teal.100"
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                        >
                            <Card.Header>
                                <Heading fontSize="lg" noOfLines={2} color="teal.600">
                                    {gig.title}
                                </Heading>
                            </Card.Header>
                            <Card.Body>
                                <Stack spacing={3}>
                                    <Text fontSize="sm" color="gray.600" noOfLines={3}>
                                        {gig.description}
                                    </Text>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold" color="teal.700">
                                            ${gig.price}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500" fontStyle="italic">
                                            {gig.categoryName}
                                        </Text>
                                    </HStack>
                                    <Button colorScheme="teal" size="sm" variant="outline">
                                        View Gig
                                    </Button>
                                </Stack>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </SimpleGrid>
            </Box>
        </Box>
    );
}
