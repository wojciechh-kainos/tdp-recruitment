package dao;

import com.google.inject.Inject;
import domain.Persons;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.List;

public class PersonsDao extends AbstractDAO<Persons>{

    @Inject
    public PersonsDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public void create(Persons person) {

    }

    public List<Persons> findAll() {
        return null;
    }
}
