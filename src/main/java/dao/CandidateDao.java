package dao;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import domain.Candidate;
import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.List;

public class CandidateDao extends AbstractDAO<Candidate>{

    @Inject
    public CandidateDao(SessionFactory sessionFactory){
        super(sessionFactory);
    }

    public List<Candidate> findAll(){
        return namedQuery("Candidate.findAll").list();
    }

    public Optional<Candidate> findById(Long id){
        return Optional.fromNullable(get(id));
    }

    public void deactivateById(Long id){
        namedQuery("Candidate.deactivateById").setParameter("id", id).executeUpdate();
    }

    public void deleteById(Long id){
        namedQuery("Candidate.deleteById").setParameter("id", id).executeUpdate();
    }

    public Long create(Candidate candidate){
        return persist(candidate).getId();
    }

    public void update(Candidate candidate){
        currentSession().update(candidate);
    }
}
