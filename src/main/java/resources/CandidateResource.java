package resources;

import com.google.inject.Inject;
import dao.CandidateDao;
import domain.Candidate;
import io.dropwizard.hibernate.UnitOfWork;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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
    @RolesAllowed("recruiter")
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Candidate createCandidate(Candidate candidate){
        candidateDao.create(candidate);
        return candidate;
    }

    @GET
    @RolesAllowed("recruiter")
    @Path("/all")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public List<Candidate> getAll(){
        return candidateDao.findAll();
    }

    @PUT
    @RolesAllowed("recruiter")
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Candidate update(Candidate candidate){
        candidateDao.update(candidate);
        return candidate;
    }

    @PUT
    @RolesAllowed("recruiter")
    @Path("/{candidate_id}/deactivate")
    @Produces(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response deactivate(@PathParam("candidate_id")Long id){
        candidateDao.deactivateById(id);
        return Response.status(Response.Status.ACCEPTED).entity(id).build();
    }
}
