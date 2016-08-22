package resources;

import com.google.inject.Inject;
import dao.CandidateDao;
import domain.Candidate;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
}
