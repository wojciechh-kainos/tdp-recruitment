package resources;

import com.google.inject.Inject;
import dao.RecruiterNoteDao;
import domain.RecruiterNote;
import io.dropwizard.hibernate.UnitOfWork;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/recruiterNote")
public class RecruiterNoteResource {

    private RecruiterNoteDao recruiterNoteDao;

    @Inject
    public RecruiterNoteResource(RecruiterNoteDao recruiterNoteDao) {
        this.recruiterNoteDao = recruiterNoteDao;
    }

    @GET
    @PermitAll
    @Path("/{limit}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public List<RecruiterNote> getAll(@PathParam("limit") int limit) {
        return recruiterNoteDao.findAll(limit);
    }

    @PUT
    @PermitAll
    @Produces(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Long create(RecruiterNote recruiterNote) {
        return recruiterNoteDao.create(recruiterNote);
    }
}
