"use client"

import {
    Flex,
    Box,
    Stack,
    Button,
    Heading,
    Text,
    Link,
    Field,
    Input,
    InputGroup,
    NativeSelect,
    HStack,
} from "@chakra-ui/react"
import axios from "axios";
import { useState } from "react"
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Navigate, useNavigate } from "react-router";

export default function Register() {

    if (JSON.parse(localStorage.getItem("user"))) {
        return <Navigate to={"/"} replace />
    }


    const [show, setShow] = useState(false);

    const [role, setRole] = useState("ROLE_FREELANCER");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(email, role, password);

        const response = await axios.post("http://localhost:8080/api/auth/register", {
            role, email, password, firstName, lastName
        }, {
            "Content-Type": "application/json",
            "withCredentials": true
        });


        if (response.status == 200 && !response.data.token) {
            alert("Account created successfully!");
            navigate("/login");
        }
    }


    return (
        <Flex>
            <Stack spacing={8} mx="auto" maxW="2xl" py={15} px={10}>
                <Stack align="center">
                    <Heading fontSize="xl" textAlign="center">
                        Sign up
                    </Heading>

                </Stack>
                <Box
                    rounded="lg"
                    bg={{ base: "white", _dark: "gray.700" }}
                    boxShadow="lg"
                    p={8}
                    marginTop={8}
                    w={{ base: "full", md: "400px" }}

                >
                    <Stack spacing={4}>
                        <form onSubmit={handleSubmit}>

                            <HStack gap="10" width="full" marginBottom={4}>
                                <Field.Root required>
                                    <Field.Label>
                                        First Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="Ben" name="firstName" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>
                                        Last Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="Alex" name="lastName" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} />
                                </Field.Root>
                            </HStack>

                            <Field.Root required marginBottom={4}>
                                <Field.Label>Email address  <Field.RequiredIndicator /></Field.Label>
                                <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Password  <Field.RequiredIndicator /></Field.Label>
                                <InputGroup endElement={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShow((prev) => !prev)}
                                    >
                                        {show ? <IoMdEyeOff /> : <IoMdEye />}
                                    </Button>
                                } >
                                    <Input type={show ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
                                </InputGroup>
                            </Field.Root>

                            <Field.Root required marginTop={"4"} marginBottom={"4"} >
                                <Field.Label>What brings you to FreelancerHub?  <Field.RequiredIndicator /></Field.Label>
                                <NativeSelect.Root required>
                                    <NativeSelect.Field
                                        value={role}
                                        onChange={(e) => setRole(e.currentTarget.value)}
                                        name="role"
                                    >
                                        <option value="ROLE_FREELANCER">I am a freelancer</option>
                                        <option value="ROLE_CLIENT">I want to buy services</option>
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Field.Root>

                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    type="submit"
                                    size="lg"
                                    bg="blue.400"
                                    color="white"
                                    _hover={{ bg: "blue.500" }}
                                >
                                    Sign up
                                </Button>
                            </Stack>

                            <Stack pt={6}>
                                <Text align="center">
                                    Already a user? <Link color="blue.400" href="/login">Login</Link>
                                </Text>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
