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

    public SlotsTimes getById(long id){ return get(id);}
}
