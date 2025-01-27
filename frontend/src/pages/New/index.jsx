import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "../../components/Textarea";
import { NoteItem } from "../../components/NoteItem";
import { Section } from "../../components/Section";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Container, Form } from "./styles";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export function New() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState([]);
  const [link, setLink] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();

  function handleDeleteLink(index) {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  }

  function handleAddLink(link) {
    setLinks([...links, link]);
    setLink("");
  }

  function handleAddTag(tag) {
    setTags([...tags, tag]);
    setTag("");
  }

  function handleDeleteTag(index) {
    const updatedTags = [...links];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  }

  async function handleSave() {
    if (!title || !description) {
      return toast.error("Title and description are required!");
    }

    if (tag !== "") {
      return toast.error("Tag was not added, click on the button to add it!");
    }

    if (link !== "") {
      return toast.error("Link was not added, click on the button to add it!");
    }

    try {
      const response = await api.post(`/notes/${user.id}`, {
        title,
        description,
        links,
        tags,
      });
      if (response.status === 201) {
        toast.success("Note created successfully!");

        navigate(-1);
      }
    } catch (err) {
      toast.error("Error creating note!");
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
            <NoteItem
              isNew
              placeholder="New link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onClick={() => handleAddLink(link)}
            />
          </Section>

          <Section title="Tags">
            <div className="tags">
              {tags.map((tag, index) => {
                return (
                  <NoteItem
                    key={index}
                    value={tag}
                    onClick={() => handleDeleteTag(index)}
                  />
                );
              })}
              <NoteItem
                isNew
                placeholder="New tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onClick={() => handleAddTag(tag)}
              />
            </div>
          </Section>

          <Button title="save" onClick={handleSave} />
        </Form>
      </main>
    </Container>
  );
}
