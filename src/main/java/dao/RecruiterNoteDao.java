package dao;

import com.google.inject.Inject;
import domain.RecruiterNote;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.List;

public class RecruiterNoteDao extends AbstractDAO<RecruiterNote>{

    @Inject
    public RecruiterNoteDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public List<RecruiterNote> findAll(int limit){
        return namedQuery("RecruiterNote.findAll").setMaxResults(limit).list();
    }

    public Long create(RecruiterNote recruiterNote){ return persist(recruiterNote).getId(); }
}