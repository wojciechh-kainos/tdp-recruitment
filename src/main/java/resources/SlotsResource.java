package resources;

import com.google.inject.Inject;
import constants.TdpConstants;
import dao.SlotsDao;
import domain.Slots;
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
public class SlotsResource {

    private SlotsDao slotsDao;

    @Inject
    public SlotsResource(SlotsDao slotsDao) {
        this.slotsDao = slotsDao;
    }

    @PUT
    @Path("/{date_from}/{date_to}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response update(Slots[] slots,
                           @PathParam("date_from") String date_from,
                           @PathParam("date_to") String date_to,
                           @QueryParam("personId") long person_id) throws ParseException {

        Date now = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        slotsDao.updateForPersonAndWeek(slots, person_id, startDate, endDate);
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/week")
    @UnitOfWork
    public List<Slots> fetchSlotsForWeek(@QueryParam("id") Long id,
                                         @QueryParam("startDate") String startDate,
                                         @QueryParam("endDate") String endDate) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

        Date start = formatter.parse(startDate);
        Date end = formatter.parse(endDate);

        return slotsDao.getForPersonForWeek(id, start, end);
    }
}
