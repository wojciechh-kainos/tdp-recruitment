package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;


@Path("/report")
@Produces(MediaType.APPLICATION_JSON)
public class ReportResource {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;

    @Inject
    public ReportResource(SlotsDao slotsDao, PersonsDao personsDao) {
        this.slotsDao = slotsDao;
        this.personsDao = personsDao;
    }

    @GET
    @Path("/{date_from}/{date_to}")
    @UnitOfWork
    public Report GetReport(
                            @PathParam("date_from") String date_from,
                            @PathParam("date_to") String date_to,
                            @QueryParam("personId") long person_id) throws ParseException{

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        Long availableCount = 0L;
        Long fullCount = 0L;
        Long initCount = 0L;
        Long wastedCount = 0L;

        Persons person = personsDao.getById(person_id);

        List<Slots> slotsList = slotsDao.getForPersonForWeek(person_id, startDate, endDate);

        for (Iterator<Slots> i = slotsList.iterator(); i.hasNext(); ){
            Slots slot = i.next();

            if (slot.getType().getType().equals("available")){
                availableCount +=1;
            }

            else if(slot.getType().getType().equals("full")){
                fullCount +=1;
            }

            else if(slot.getType().getType().equals("init")){
                initCount +=1;
            }
        }

        return new Report(person, initCount, availableCount, fullCount, wastedCount);
    }
}
