import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Container, Brand, Menu, Search, Content, NewNote } from "./styles";

import { Note } from "../../components/Note";
import { Input } from "../../components/Input";
import { Header } from "../../components/Header";
import { Section } from "../../components/Section";
import { ButtonText } from "../../components/ButtonText";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export function Home() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterByTitle = (searchTerm) => {
    if (searchTerm === "") return setFilteredNotes(notes);

    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredNotes(filtered);
  };

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await api.get(`/notes/getNotes/${user.id}`);
        if (response.status === 200) {
          setNotes(response.data);
          setFilteredNotes(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchNotes();
  }, []);

  return (
    <Container>
      <Brand>
        <h1>Notes</h1>
      </Brand>

      <Header />

      <Menu>
        <li>
          <ButtonText title="Todos" $isactive />
        </li>
        <li>
          <ButtonText title="React" />
        </li>
        <li>
          <ButtonText title="Nodejs" />
        </li>
      </Menu>

      <Search>
        <Input
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilterByTitle(e.target.value);
          }}
        />
      </Search>

      <Content>
        <Section title="My Notes">
          {filteredNotes.map((note) => (
            <Note key={note.id} data={note} />
          ))}
        </Section>
      </Content>

      <NewNote to="/new">
        <FiPlus />
        Create Note
      </NewNote>
    </Container>
  );
}
