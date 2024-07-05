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
import { useNavigate } from "react-router-dom";

export function Home() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [notesFilteredByTag, setNotesFilteredByTag] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  const handleFilterByTitle = (searchTerm) => {
    let notesToFilter = notes;

    if (selectedTag) {
      notesToFilter = notes.filter((note) =>
        note.tags.some((t) => t.id === selectedTag.id)
      );
    }

    const filtered = notesToFilter.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredNotes(filtered);
  };

  function handleSelectTag(tag) {
    if (tag.id === selectedTag?.id) {
      setSelectedTag(null);
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter((note) => {
      return note.tags.some((t) => t.id === tag.id);
    });

    setFilteredNotes(filtered);
    setSelectedTag(tag);
  }

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

    async function fetchTags() {
      try {
        const response = await api.get(`/tags/${user.id}`);
        if (response.status === 200) {
          setTags(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchNotes();
    fetchTags();
  }, []);

  return (
    <Container>
      <Brand>
        <h1>Notes</h1>
      </Brand>

      <Header />

      <Menu>
        {tags.map((tag) => {
          return (
            <li key={tag.id}>
              <ButtonText
                title={tag.name}
                onClick={() => handleSelectTag(tag)}
                isActive={selectedTag?.id === tag.id}
              />
            </li>
          );
        })}
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
            <Note
              key={note.id}
              data={note}
              onClick={() => navigate(`/details/${note.id}`)}
            />
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
