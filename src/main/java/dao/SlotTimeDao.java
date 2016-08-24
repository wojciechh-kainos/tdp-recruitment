package dao;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import domain.SlotTime;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;
import java.util.List;

public class SlotTimeDao extends AbstractDAO<SlotTime> {
    @Inject
    public SlotTimeDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public Optional<SlotTime> getById(long id){ return Optional.fromNullable(get(id));}

    public List<SlotTime> getAll() {
        return list(namedQuery("SlotTime.getAll"));
    }

}
