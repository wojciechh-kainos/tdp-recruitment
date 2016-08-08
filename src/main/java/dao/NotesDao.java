package dao;

import com.google.inject.Inject;
import domain.Notes;
import domain.Persons;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.List;

public class NotesDao extends AbstractDAO<Notes>{

    @Inject
    public NotesDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public long create(Notes note) {
        return persist(note).getId();
    }

    public Notes getById(Long personId) {
        return get(personId);
    }

}
