package dao;

import com.google.inject.Inject;
import domain.AvailabilityType;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.Optional;

public class AvailabilityTypeDao extends AbstractDAO<AvailabilityType>{
    @Inject
    public AvailabilityTypeDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public Optional<AvailabilityType> getById(long id){ return Optional.ofNullable(get(id));}

}
