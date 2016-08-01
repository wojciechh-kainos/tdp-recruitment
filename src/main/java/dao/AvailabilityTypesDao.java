package dao;

import com.google.inject.Inject;
import domain.AvailabilityTypes;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

public class AvailabilityTypesDao extends AbstractDAO<AvailabilityTypes>{
    @Inject
    public AvailabilityTypesDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public long create(AvailabilityTypes availabilityTypes){
        return persist(availabilityTypes).getId();
    }

    public AvailabilityTypes getById(long id){ return get(id);}

    public void deleteById(long id){
        namedQuery("AvailabilityTypes.delete").setParameter("id", id).executeUpdate();
    }
}
