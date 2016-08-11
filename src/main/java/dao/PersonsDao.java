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

    public long create(Persons person) {
        return persist(person).getId();
    }

    public Persons getById(Long id) {
        return get(id);
    }

    public void deleteById(Long id) {
        namedQuery("Persons.delete").setParameter("id", id).executeUpdate();
    }

    public List<Persons> findAll(){
        return namedQuery("Persons.findAll").list();
    }

    public void update(Persons person){currentSession().update(person);}
}
