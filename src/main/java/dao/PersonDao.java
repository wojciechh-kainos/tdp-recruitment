package dao;

import com.google.inject.Inject;
import domain.Person;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

import java.util.List;
import java.util.Optional;

public class PersonDao extends AbstractDAO<Person>{

    @Inject
    public PersonDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public long create(Person person) {
        return persist(person).getId();
    }

    public Optional<Person> getById(Long id) {
        return Optional.ofNullable(get(id));
    }

    public void deleteById(Long id) {
        namedQuery("Person.delete").setParameter("id", id).executeUpdate();
    }

    public List<Person> findAllActive(){
        return list(namedQuery("Person.findAllActive"));
    }

    public List<Person> findAll(){
        return list(namedQuery("Person.findAll"));
    }

    public List<Person> findAllRecruiters(){
        Criteria criteria = criteria()
                .add(Restrictions.eq("admin", true))
                .add(Restrictions.eq("active", true));
        return list(criteria);
    }

    public List<Person> findByEmail(String email) { return list(namedQuery("Person.findByEmail").setParameter("email", email)); }

    public void update(Person person){currentSession().update(person);}

    public Optional<Person> getUserByEmail(String email) {
        Criteria criteria = currentSession().createCriteria(Person.class)
                .add(Restrictions.eq("email", email));
        return Optional.ofNullable(uniqueResult(criteria));
    }

    public Optional<Person> getUserByActivationLink(String activationLink) {
        Criteria criteria = currentSession().createCriteria(Person.class)
                .add(Restrictions.eq("activationCode", activationLink));
        return Optional.ofNullable(uniqueResult(criteria));
    }
}
