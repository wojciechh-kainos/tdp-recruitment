package resources;

import com.google.inject.Inject;
import dao.CandidateDao;
import domain.Candidate;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/candidate")
@Produces(MediaType.APPLICATION_JSON)
public class CandidateResource {

    private CandidateDao candidateDao;

    @Inject
    public CandidateResource(CandidateDao candidateDao){
        this.candidateDao = candidateDao;
    }

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Candidate createCandidate(Candidate candidate){
        candidateDao.create(candidate);
        return candidate;
    }

    @GET
    @Path("/all")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public List<Candidate> getAll(){
        return candidateDao.findAll();
    }

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Candidate update(Candidate candidate){
        candidateDao.update(candidate);
        return candidate;
    }

    @GET
    @Path("/{candidate_id}/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public void delete(@PathParam("candidate_id")Long id){
        candidateDao.deleteById(id);
    }
}
