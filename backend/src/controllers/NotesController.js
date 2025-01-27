const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const linksInsert = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });

    if (linksInsert.length > 0) {
      await knex("links").insert(linksInsert);
    }

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    if (tagsInsert.length > 0) {
      await knex("tags").insert(tagsInsert);
    }

    return response.status(201).json();
  }

  async getNote(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWhithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWhithTags);
  }

  async getNotes(request, response) {
    const { user_id } = request.params;

    const notes = await knex("notes")
      .where({ user_id })
      .orderBy("created_at", "desc");
    const notesWithTagsAndLinks = await Promise.all(
      notes.map(async (note) => {
        const tags = await knex("tags")
          .where({ note_id: note.id })
          .orderBy("name");
        const links = await knex("links").where({ note_id: note.id });

        return { ...note, tags, links };
      })
    );

    return response.status(200).json(notesWithTagsAndLinks);
  }
}

module.exports = NotesController;
