package dao;

import com.google.inject.Inject;
import domain.Notes;
import domain.Persons;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.Date;
import java.util.List;

public class NotesDao extends AbstractDAO<Notes>{

    @Inject
    public NotesDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public void deleteNoteForWeek(Long id, Date date) {
        namedQuery("Notes.deleteNoteForWeek").setParameter("id", id).setDate("date", date).executeUpdate();
    }

    public Notes createOrUpdate(Notes note) {
        deleteNoteForWeek(note.getPerson().getId(), note.getDate());
        persist(note);
        return note;
    }

    public Notes getByPersonIdAndDate(Long personId, Date startDate) {
        return uniqueResult( namedQuery("Notes.getNoteByPersonIdAndDate")
              .setParameter("id", personId)
              .setDate("date", startDate));
    }
}
