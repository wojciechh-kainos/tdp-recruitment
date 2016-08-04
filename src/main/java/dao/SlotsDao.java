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

    public Slots findById(Long id){
        return get(id);
    }

    public long create(Slots slot){
        return persist(slot).getId();
    }

    public void deleteById(Long id) {
        namedQuery("Slots.delete").setParameter("id", id).executeUpdate();
    }

    public List<Slots> findBetween(String startDate, String endDate){
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        Criteria criteria = currentSession().createCriteria(Slots.class);
        addRestrictionIfNotNull(criteria, Restrictions.ge("slotsDate", start), start);
        addRestrictionIfNotNull(criteria, Restrictions.le("slotsDate", end), end);

        return criteria.list();
    }

    private void addRestrictionIfNotNull(Criteria criteria, Criterion expression, Object value){
        if (value != null){
            criteria.add(expression);
        }

    public List<Slots> getForPersonForWeek(Long personId, Date start, Date end) {
        return list(namedQuery("Slots.getForPersonForWeek")
                .setParameter("personId", personId)
                .setDate("startDate", start)
                .setDate("endDate", end));
    }
}
