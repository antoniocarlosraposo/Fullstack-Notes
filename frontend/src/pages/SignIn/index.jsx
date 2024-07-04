import { FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { Container, Form, Background } from "./styles";

export function SignIn() {
  return (
    <Container>
      <Form>
        <h1>Notes</h1>
        <p>App to save and manage useful links.</p>

        <h2>Login</h2>

        <Input placeholder="Email" type="text" icon={FiMail} />

        <Input placeholder="Password" type="password" icon={FiLock} />

        <Button title="Sign in" />

        <Link to="/register">Sign up</Link>
      </Form>

      <Background />
    </Container>
  );
}
