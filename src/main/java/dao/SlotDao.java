package dao;

import com.google.inject.Inject;
import domain.AvailabilityTypeEnum;
import domain.Slot;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.joda.time.DateTime;

import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class SlotDao extends AbstractDAO<Slot> {

    @Inject
    public SlotDao(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    public Optional<Slot> findById(Long id) {
        return Optional.ofNullable(get(id));
    }

    public long create(Slot slot) {
        return persist(slot).getId();
    }

    public void deleteById(Long id) {
        namedQuery("Slot.delete").setParameter("id", id).executeUpdate();
    }

    public List<Slot> findSlotsForPairMatching(String startDate, String endDate, Time startTime, Time endTime, Boolean isDev, Boolean isTest, Boolean isOps, Boolean isOther){
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        Criteria criteria = criteria();

        Criteria criteriaPerson = criteria.createCriteria("person");
        criteriaPerson.add(Restrictions.eq("active", true));
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isDev", isDev), isDev);
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isTest", isTest), isTest);
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isOps", isOps), isOps);
        addRestrictionIfNotNull(criteriaPerson, Restrictions.eq("isOther", isOther), isOther);

        Criteria criteriaAvail = criteria.createCriteria("type");
        criteriaAvail.add(Restrictions.or(Restrictions.eq("name", AvailabilityTypeEnum.maybe), Restrictions.eq("name", AvailabilityTypeEnum.available)));

        Criteria criteriaTime = criteria.createCriteria("slotTime");
        criteriaTime.add(Restrictions.ge("startTime", startTime));
        criteriaTime.add(Restrictions.le("endTime", endTime));

        criteria.add(Restrictions.ge("slotDate", start));
        criteria.add(Restrictions.le("slotDate", end));

        return list(criteria);
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

    public void updateForPersonAndWeekFromRecruiter(List<Slot> slots) {
        for (Slot slot : slots) persist(slot);
    }

    public List<Slot> getForPersonForWeek(Long personId, Date start, Date end) {
        return list(namedQuery("Slot.getForPersonForWeek")
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
