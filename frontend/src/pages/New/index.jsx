import { Link } from "react-router-dom";

import { Textarea } from "../../components/Textarea";
import { NoteItem } from "../../components/NoteItem";
import { Section } from "../../components/Section";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";

import { Container, Form } from "./styles";

export function New() {
  return (
    <Container>
      <Header />

      <main>
        <Form>
          <header>
            <h1>Create Note</h1>
            <Link to="/">back</Link>
          </header>

          <Input placeholder="title" />
          <Textarea placeholder="Observações" />

          <Section title="Links úteis">
            <NoteItem value="https://www.linkedin.com/in/acraposo/" />
            <NoteItem isNew placeholder="New link" />
          </Section>

          <Section title="Marcadores">
            <div className="tags">
              <NoteItem value="react" />
              <NoteItem isNew placeholder="New tag" />
            </div>
          </Section>

          <Button title="save" />
        </Form>
      </main>
    </Container>
  );
}
