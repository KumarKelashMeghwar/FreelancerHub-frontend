import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Box,
    Image,
    Heading,
    Text,
    HStack,
    Tag,
    TagLabel,
    VStack,
    Spinner,
    Button,
    Avatar,
} from "@chakra-ui/react";
import axios from "axios";

export default function GigDetails() {
    const { id } = useParams();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);

    const searchGig = async () => {
        const response = await axios.get(`http://localhost:8080/api/gigs/search/${id}`);

        setGig(response.data);
        setLoading(false);
        console.log(response)
    }

    useEffect(() => {
        searchGig();
    }, [id]);

    if (loading)
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
            </Box>
        );

    if (!gig)
        return (
            <Box textAlign="center" mt={10}>
                <Text>Gig not found.</Text>
            </Box>
        );

    return (
        <Box maxW="5xl" mx="auto" p={5} mt={"10"} >
            <Heading>{gig.title}</Heading>

            <HStack>
                <Avatar.Root my={"3"} size={"lg"}>
                    <Avatar.Fallback>{gig.sellerName}</Avatar.Fallback>
                    <Avatar.Image src="https://avatar.iran.liara.run/public" />
                </Avatar.Root>
                <Link to={`/users/${gig.sellerId}`}>{gig.sellerName}</Link>
            </HStack>


            <HStack mt={2} spacing={2}>
                {gig.tags.map((tag, i) => (
                    <Tag.Root key={i} colorScheme="green">
                        <Tag.Label>{tag}</Tag.Label>
                    </Tag.Root>
                ))}
            </HStack>

            <HStack mt={5} spacing={3} overflowX="auto">
                {gig.images.map((img, i) => (
                    <Image
                        key={i}
                        src={`http://localhost:8080${img}`}
                        alt={gig.title}
                        h="250px"
                        borderRadius="md"
                    />
                ))}
            </HStack>

            <VStack align="start" mt={6} spacing={3}>
                <Text fontSize="lg" fontWeight="bold">
                    Description
                </Text>
                <Text>{gig.description}</Text>

                <Text fontSize="lg" fontWeight="bold">
                    Category:{" "}
                    <Text as="span" color="teal.500">
                        {gig.categoryName}
                    </Text>
                </Text>

                <Text fontSize="2xl" color="green.500" fontWeight="bold">
                    ${gig.price}
                </Text>

                <Button colorScheme="teal" size="lg">
                    Order Now
                </Button>
            </VStack>
        </Box>
    );
}
