package dao;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import domain.Person;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

import java.util.List;

public class PersonDao extends AbstractDAO<Person>{

    @Inject
    public PersonDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public long create(Person person) {
        return persist(person).getId();
    }

    public Optional<Person> getById(Long id) {
        return Optional.fromNullable(get(id));
    }

    public void deleteById(Long id) {
        namedQuery("Person.delete").setParameter("id", id).executeUpdate();
    }

    public List<Person> findAllActive(){
        return namedQuery("Person.findAllActive").list();
    }

    public List<Person> findAll(){
        return namedQuery("Person.findAll").list();
    }

    public List<Person> findByEmail(String email) { return namedQuery("Person.findByEmail").setParameter("email", email).list(); }

    public void update(Person person){currentSession().update(person);}

    public Person getUserByEmail(String email) {
        Criteria criteria = currentSession().createCriteria(Person.class)
                .add(Restrictions.eq("email", email));
        return uniqueResult(criteria);
    }

    public Optional<Person> getUserByActivationLink(String activationLink) {
        Criteria criteria = currentSession().createCriteria(Person.class)
                .add(Restrictions.eq("activationCode", activationLink));
        return Optional.fromNullable(uniqueResult(criteria));
    }
}
