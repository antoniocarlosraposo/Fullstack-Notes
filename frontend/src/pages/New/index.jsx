import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Textarea } from "../../components/Textarea";
import { NoteItem } from "../../components/NoteItem";
import { Section } from "../../components/Section";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Container, Form } from "./styles";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export function New() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState(["https://www.linkedin.com/in/acraposo/"]);
  const [tags, setTags] = useState([]);

  const { user } = useAuth();

  function handleDeleteLink(index) {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  }

  async function handleSave() {
    console.log(`/notes/${user.id}`);
    try {
      const response = await api.post(`/notes/${user.id}`, {
        title,
        description,
        links,
        tags,
      });
      if (response.status === 201) {
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <Header />

      <main>
        <Form>
          <header>
            <h1>Create Note</h1>
            <Link to="/">Back</Link>
          </header>

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <Section title="Useful links">
            {links.map((link, index) => {
              return (
                <NoteItem
                  key={index}
                  value={link}
                  onClick={() => handleDeleteLink(index)}
                />
              );
            })}
            <NoteItem isNew placeholder="New link" />
          </Section>

          <Section title="Tags">
            <div className="tags">
              <NoteItem value="react" />
              <NoteItem isNew placeholder="New tag" />
            </div>
          </Section>

          <Button title="save" onClick={handleSave} />
        </Form>
      </main>
    </Container>
  );
}
