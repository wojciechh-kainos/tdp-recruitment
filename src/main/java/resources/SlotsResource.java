package resources;
import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Path("/slots")
@Produces(MediaType.APPLICATION_JSON)
public class SlotsResource {

    private SlotsDao slotsDao;
    private PersonsDao personsDao;

    @Inject
    public SlotsResource(SlotsDao slotsDao, PersonsDao personsDao) {
        this.slotsDao = slotsDao;
        this.personsDao = personsDao;
    }

    @PUT
    @Path("/update/{person_id}/{date_from}/{date_to}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response update(Slots[] slots,
                           @PathParam("person_id") long person_id,
                           @PathParam("date_from") String date_from,
                           @PathParam("date_to") String date_to) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date start = formatter.parse(date_from);
        Date end = formatter.parse(date_to);

        slotsDao.updateForPersonAndWeek(slots, person_id, start, end);

        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/week")
    @UnitOfWork
    public List<Slots> fetchSlotsForWeek(@QueryParam("id") Long id,
                                         @QueryParam("startDate") String startDate,
                                         @QueryParam("endDate") String endDate) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date start = formatter.parse(startDate);
        Date end = formatter.parse(endDate);

        return slotsDao.getForPersonForWeek(id, start, end);
    }
}
