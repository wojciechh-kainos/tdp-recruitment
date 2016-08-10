package dao;

import com.google.inject.Inject;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.joda.time.DateTime;

import java.util.Date;
import java.util.List;

import static org.postgresql.hostchooser.HostRequirement.master;

public class SlotsDao extends AbstractDAO<Slots> {

    @Inject
    public SlotsDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public Slots findById(Long id) {
        return get(id);
    }

    public long create(Slots slot) {
        return persist(slot).getId();
    }

    public void deleteById(Long id) {
        namedQuery("Slots.delete").setParameter("id", id).executeUpdate();
    }

    public List<Slots> findBetween(String startDate, String endDate) {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        Criteria criteria = criteria();
        addRestrictionIfNotNull(criteria, Restrictions.ge("slotsDate", start), start);
        addRestrictionIfNotNull(criteria, Restrictions.le("slotsDate", end), end);

        return list(criteria);
    }

    public List<Slots> findBetweenPerJobProfile(String startDate, String endDate, Boolean isDev, Boolean isTest, Boolean isOps){
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        Criteria criteria = criteria();
        Criteria criteriaPerson = criteria.createCriteria("person");

        criteria.add(Restrictions.ge("slotsDate", start));
        criteria.add(Restrictions.le("slotsDate", end));

        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isDev", isDev), isDev);
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isTest", isTest), isTest);
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isOps", isOps), isOps);

        return list(criteria);
    }

    public void deleteForPersonBetweenDates(Long personId, Date from, Date to) {
        namedQuery("Slots.deleteForPersonBetweenDates")
                .setParameter("personId", personId)
                .setDate("fromDate", from)
                .setDate("toDate", to)
                .executeUpdate();
    }

    public void updateForPersonAndWeek(Slots[] slots, Long personId, Date from, Date to) {
        deleteForPersonBetweenDates(personId, from, to);
        for (Slots slot : slots) persist(slot);
    }

    public List<Slots> getForPersonForWeek(Long personId, Date start, Date end) {
        return list(namedQuery("Slots.getForPersonForWeek")
                .setParameter("personId", personId)
                .setDate("startDate", start)
                .setDate("endDate", end));
    }

    private void addRestrictionIfNotNull(Criteria criteria, Criterion expression, Object value) {
        if (value != null) {
            criteria.add(expression);
        }
    }
}
