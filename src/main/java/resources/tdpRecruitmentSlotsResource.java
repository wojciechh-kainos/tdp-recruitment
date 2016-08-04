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
public class tdpRecruitmentSlotsResource {

    private SlotsDao slotsDao;
    private PersonsDao personsDao;

    @Inject
    public tdpRecruitmentSlotsResource(SlotsDao slotsDao, PersonsDao personsDao) {
        this.slotsDao = slotsDao;
        this.personsDao = personsDao;
    }


    @POST
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

        Persons person = personsDao.getById(person_id);
        for (Slots slot : slots) slot.setPerson(person);

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

        List<Slots> list = slotsDao.getForPersonForWeek(id, start, end);
        return list;
    }
}
