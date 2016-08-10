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

    public Notes createOrUpdate(Notes note) {
        persist(note);
        return note;
    }

    public Notes getByIdAndDate(Long personId,Date startDate) {
        return uniqueResult( namedQuery("Notes.getNoteByPersonIdAndDate")
              .setParameter("id", personId)
              .setDate("date", startDate));
    }
}
