package dao;

import com.google.inject.Inject;
import domain.Slot;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.joda.time.DateTime;

import java.util.Date;
import java.util.List;

public class SlotDao extends AbstractDAO<Slot> {

    @Inject
    public SlotDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public Slot findById(Long id) {
        return get(id);
    }

    public long create(Slot slot) {
        return persist(slot).getId();
    }

    public void deleteById(Long id) {
        namedQuery("Slot.delete").setParameter("id", id).executeUpdate();
    }

    public List<Slot> findBetween(String startDate, String endDate) {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        Criteria criteria = currentSession().createCriteria(Slot.class);
        addRestrictionIfNotNull(criteria, Restrictions.ge("slotDate", start), start);
        addRestrictionIfNotNull(criteria, Restrictions.le("slotDate", end), end);

        return criteria.list();
    }

    private void addRestrictionIfNotNull(Criteria criteria, Criterion expression, Object value) {
        if (value != null) {
            criteria.add(expression);
        }
    }

    public void deleteForPersonBetweenDates(Long personId, Date from, Date to) {
        namedQuery("Slot.deleteForPersonBetweenDates")
                .setParameter("personId", personId)
                .setDate("fromDate", from)
                .setDate("toDate", to)
                .executeUpdate();
    }

    public void updateForPersonAndWeek(List<Slot> slots, Long personId, Date from, Date to) {
        deleteForPersonBetweenDates(personId, from, to);
        for (Slot slot : slots) persist(slot);
    }

    public List<Slot> getForPersonForWeek(Long personId, Date start, Date end) {
        return list(namedQuery("Slot.getForPersonForWeek")
                .setParameter("personId", personId)
                .setDate("startDate", start)
                .setDate("endDate", end));
    }
}
