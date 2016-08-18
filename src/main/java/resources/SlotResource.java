package resources;

import com.google.inject.Inject;
import dao.SlotDao;
import domain.Slot;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Path("/slots")
@Produces(MediaType.APPLICATION_JSON)
public class SlotResource {

    private SlotDao slotDao;

    @Inject
    public SlotResource(SlotDao slotDao) {
        this.slotDao = slotDao;
    }

    @PUT
    @Path("/{date_from}/{date_to}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response update(
                           @PathParam("date_from") String date_from,
                           @PathParam("date_to") String date_to,
                           @QueryParam("personId") long person_id, List<Slot> slots) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        Date now = new Date();
        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        // Don't allow users to submit availabilities older than current week
        if (now.compareTo(startDate) > 0 && now.compareTo(endDate) > 0) {
            return Response.status(Response.Status.NOT_ACCEPTABLE).build();
        }

        slotDao.updateForPersonAndWeek(slots, person_id, startDate, endDate);
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/week")
    @UnitOfWork
    public List<Slot> fetchSlotsForWeek(@QueryParam("id") Long id,
                                        @QueryParam("startDate") String startDate,
                                        @QueryParam("endDate") String endDate) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date start = formatter.parse(startDate);
        Date end = formatter.parse(endDate);

        return slotDao.getForPersonForWeek(id, start, end);
    }
}
