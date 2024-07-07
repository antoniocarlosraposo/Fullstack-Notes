import { Container, Links, Content } from "./styles";

import { Tag } from "../../components/Tag";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { Section } from "../../components/Section";
import { ButtonText } from "../../components/ButtonText";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: "",
    description: "",
    links: [],
    tags: [],
  });

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await api.get(`/notes/${id}`);
        if (response.status === 200) {
          setNote(response.data);
        }
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }

    fetchNote();
  }, []);

  async function handleDeleteNote() {
    try {
      const response = await api.delete(`/notes/${id}`);
      if (response.status === 200) {
        toast.success("Note deleted successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Error deleting note!");
    }
  }

  return (
    <Container>
      <Header />

      <main>
        <Content>
          <ButtonText title="Delete Note" onClick={() => handleDeleteNote()} />

          <h1>{note.title}</h1>

          <p>{note.description}</p>

          <Section title="Useful Links">
            <Links>
              {note.links.map((link) => {
                return (
                  <li>
                    <a href="#">{link.url}</a>
                  </li>
                );
              })}
            </Links>
          </Section>

          <Section title="Tags">
            {note.tags.map((tag) => {
              return <Tag title={tag.name} />;
            })}
          </Section>

          <Button title="Back" onClick={() => navigate("/")} />
        </Content>
      </main>
    </Container>
  );
}
