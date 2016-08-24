package dao;

import com.google.inject.Inject;
import domain.AvailabilityType;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

public class AvailabilityTypeDao extends AbstractDAO<AvailabilityType>{
    @Inject
    public AvailabilityTypeDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public AvailabilityType getById(long id){ return get(id);}

}
