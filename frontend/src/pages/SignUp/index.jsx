import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { Container, Form, Background } from "./styles";
import { toast } from "react-toastify";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    if (!name || !email || !password) {
      return toast.error("All fields are required!");
    }

    try {
      const response = await api.post("/users", { name, email, password });
      if (response.status === 201) {
        toast.success("User created successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Error creating user!");
    }
  }

  return (
    <Container>
      <Background />

      <Form>
        <h1>Notes</h1>
        <p>App to save and manage useful links.</p>

        <h2>Create your account</h2>

        <Input
          placeholder="Name"
          type="text"
          icon={FiUser}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Email"
          type="text"
          icon={FiMail}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          icon={FiLock}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button title="Register" onClick={handleRegister} />

        <Link to="/">Back to Sign In</Link>
      </Form>
    </Container>
  );
}
