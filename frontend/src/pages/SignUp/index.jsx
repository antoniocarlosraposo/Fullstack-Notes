import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { Container, Form, Background } from "./styles";

export function SignUp() {
  return (
    <Container>
      <Background />

      <Form>
        <h1>Notes</h1>
        <p>App to save and manage useful links.</p>

        <h2>Create your account</h2>

        <Input placeholder="Name" type="text" icon={FiUser} />

        <Input placeholder="Email" type="text" icon={FiMail} />

        <Input placeholder="Password" type="password" icon={FiLock} />

        <Button title="Register" />

        <Link to="/">Back to Sign In</Link>
      </Form>
    </Container>
  );
}