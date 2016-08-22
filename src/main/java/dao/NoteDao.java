package dao;

import com.google.inject.Inject;
import domain.Note;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.Date;

public class NoteDao extends AbstractDAO<Note>{

    @Inject
    public NoteDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public void deleteNoteForWeek(Long id, Date date) {
        namedQuery("Note.deleteNoteForWeek").setParameter("id", id).setDate("date", date).executeUpdate();
    }

    public Note createOrUpdate(Note note) {
        deleteNoteForWeek(note.getPerson().getId(), note.getDate());
        persist(note);
        return note;
    }

    public Note getByPersonIdAndDate(Long personId, Date startDate) {
        return uniqueResult( namedQuery("Note.getNoteByPersonIdAndDate")
              .setParameter("id", personId)
              .setDate("date", startDate));
    }
}
