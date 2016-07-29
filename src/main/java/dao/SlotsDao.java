package dao;

import com.google.inject.Inject;
import domain.Slots;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

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

    public List<Slots> findAll() {
        return list(namedQuery("Slots.findAll"));
    }

    public void deleteAll(){
        namedQuery("Slots.deleteAll").executeUpdate();
    }
}
