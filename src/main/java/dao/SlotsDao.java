package dao;

import com.google.inject.Inject;
import domain.Persons;
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

    public List<Slots> getForPersonForWeek(Long personId, Date start, Date end) {
        return list(namedQuery("Slots.getForPersonForWeek").setParameter("personId", personId).setDate("startDate", start)
                .setDate("endDate", end));
    }
}
