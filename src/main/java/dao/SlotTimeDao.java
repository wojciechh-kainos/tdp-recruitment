package dao;

import com.google.inject.Inject;
import domain.SlotTime;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import java.util.List;
import java.util.Optional;

public class SlotTimeDao extends AbstractDAO<SlotTime> {
    @Inject
    public SlotTimeDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public Optional<SlotTime> getById(long id){ return Optional.ofNullable(get(id));}

    public List<SlotTime> getAll() {
        return list(namedQuery("SlotTime.getAll"));
    }

}
