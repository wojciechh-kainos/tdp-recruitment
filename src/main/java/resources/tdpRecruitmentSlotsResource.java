package resources;

import com.google.inject.Inject;
import dao.SlotsDao;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.Date;
import java.util.List;

@Path("/slots")
@Produces(MediaType.APPLICATION_JSON)
public class tdpRecruitmentSlotsResource {

    private SlotsDao slotsDao;

    @Inject
    public tdpRecruitmentSlotsResource(SlotsDao slotsDao) { this.slotsDao = slotsDao; }


    @POST
    @Path("/update/{person_id}/{date_from}/{date_to}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response update(List<Slots> slots, @PathParam("person_id") long person_id, @PathParam("date_from") Date date_from, @PathParam("date_to") Date date_to){

        slotsDao.updateForPersonAndWeek(slots, person_id, date_from, date_to);

        return Response.status(Response.Status.CREATED).build();
    }
}
