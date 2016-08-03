package dao;

import com.google.inject.Inject;
import domain.Slots;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.sql.Date;
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

    public void deleteForPersonAndWeek(Long personId, Date from, Date to) {
        namedQuery("Slots.deleteWeek")
                .setParameter("personId", personId)
                .setParameter("fromDate", from)
                .setParameter("toDate", to)
                .executeUpdate();
    }

    public void updateForPersonAndWeek(List<Slots> slots, Long personId, Date from, Date to) {
        deleteForPersonAndWeek(personId, from, to);
        slots.forEach(this::persist);
    }
}