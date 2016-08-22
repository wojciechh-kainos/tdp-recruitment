package dao;

import com.google.inject.Inject;
import domain.Person;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.List;

public class PersonDao extends AbstractDAO<Person>{

    @Inject
    public PersonDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public long create(Person person) {
        return persist(person).getId();
    }

    public Person getById(Long id) {
        return get(id);
    }

    public void deleteById(Long id) {
        namedQuery("Person.delete").setParameter("id", id).executeUpdate();
    }

    public List<Person> findAll(){
        return namedQuery("Person.findAll").list();
    }

    public List<Person> findAllForManaging(){
        return namedQuery("Person.findAllForManaging").list();
    }

    public void update(Person person){currentSession().update(person);}
}
