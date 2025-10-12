import React from "react";
import {
    Box,
    Image,
    Text,
    Flex,
    Tag,
    Button,
    VStack,
    HStack,
    
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

const GigCard = ({gig}) => {

    const firstImage = gig.images?.[0] || "/placeholder.jpg";

    const navigate = useNavigate();

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
            transition="all 0.2s"
            bg="white"
            width="270px"
            cursor="pointer"
        >
            {/* Gig Image */}
            <Image
                src={`http://localhost:8080${firstImage}`}
                alt={gig.title}
                objectFit="cover"
                width="100%"
                height="180px"
            />

            <VStack align="start" spacing={2} p={4}>
                {/* Gig Title */}
                <Text fontWeight="bold" noOfLines={2}>
                    {gig.title}
                </Text>

                {/* Category */}
                {gig.categoryName && (
                    <Text fontSize="sm" color="gray.500">
                        {gig.categoryName}
                    </Text>
                )}

                {/* Tags */}
                <HStack spacing={1} wrap="wrap">
                    {gig.tags?.slice(0, 2).map((tag, index) => (
                        <Tag.Root key={index} size="sm" colorScheme="green">
                            <Tag.Label>{tag}</Tag.Label>
                        </Tag.Root>
                    ))}
                    {gig.tags?.length > 2 && (
                        <Tag.Root size="sm" colorScheme="gray">
                            <Tag.Label>+{gig.tags.length - 2}</Tag.Label>
                        </Tag.Root>
                    )}
                </HStack>

                {/* Price & Button */}
                <Flex justify="space-between" align="center" width="100%">
                    <Text fontWeight="bold">${gig.price}</Text>
                    <Button
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        onClick={() => navigate(`/gigs/${gig.id}`)}
                    >
                        View
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
};

export default GigCard;
