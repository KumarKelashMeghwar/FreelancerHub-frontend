import { AuthContext } from "../context/AuthContext.jsx";
import {
  Button,
  Center,
  Container,
  Field,
  Heading,
  Input,
  InputGroup,
  Stack
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useContext(AuthContext);

  // 👇 Handle redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.role === "ROLE_FREELANCER") {
        navigate(
          `/users/${storedUser.firstName.toLowerCase()}${storedUser.lastName.toLowerCase()}/seller_dashboard`,
          { replace: true }
        );
      } else if (storedUser.role === "ROLE_CLIENT") {
        navigate("/users/client_dashboard", { replace: true });
      } else if (storedUser.role === "ROLE_ADMIN") {
        navigate("/super-admin", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { token, user } = response.data;


    if (response.status === 200) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: { token, user } });

      

      // 👇 Navigate immediately after login
      if (user.role === "ROLE_FREELANCER") {
        navigate(
          `/users/${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}/seller_dashboard`
        );
      } else if (user.role === "ROLE_CLIENT") {
        navigate("/users/client_dashboard");
      } else if (user.role === "ROLE_ADMIN") {
        navigate("/super-admin");
      }
    }
  };

  return (
    <Container maxW={"sm"} marginTop={"10"}>
      <Center>
        <Heading size={"xl"}>Login</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <Stack maxW="sm" gap="4" align="flex-start">
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input
              placeholder="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Password</Field.Label>
            <InputGroup
              endElement={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? <IoMdEyeOff /> : <IoMdEye />}
                </Button>
              }
            >
              <Input
                type={show ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          <Button type="submit" variant="solid" mt="3">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Login;
