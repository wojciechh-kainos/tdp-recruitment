package dao;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import domain.AvailabilityType;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

public class AvailabilityTypeDao extends AbstractDAO<AvailabilityType>{
    @Inject
    public AvailabilityTypeDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public Optional<AvailabilityType> getById(long id){ return Optional.fromNullable(get(id));}

}
