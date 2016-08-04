package dao;

import com.google.inject.Inject;
import domain.Slots;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.Date;
import java.util.List;

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
}
