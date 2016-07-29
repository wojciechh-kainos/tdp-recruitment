package dao;

import com.google.inject.Inject;
import domain.SlotsTimes;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

public class SlotsTimesDao extends AbstractDAO<SlotsTimes> {
    @Inject
    public SlotsTimesDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public long create(SlotsTimes slotsTimes){
        return persist(slotsTimes).getId();
    }

    public SlotsTimes getById(long id){ return get(id);}

    public void delete(long id){
        namedQuery("SlotsTimes.delete").setParameter("id", id).executeUpdate();
    }
}
