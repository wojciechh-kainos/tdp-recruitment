package resources;

import com.google.inject.Inject;
import dao.NotesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Notes;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import org.joda.time.DateTime;
import org.jvnet.hk2.internal.Collector;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.NotEmpty;
import org.jvnet.hk2.internal.Collector;

import services.MailService;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Path("/person")
@Produces(MediaType.APPLICATION_JSON)
public class PersonsResource {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;
    private NotesDao notesDao;
    private MailService mailService;
    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

    @Inject
    public PersonsResource(PersonsDao personsDao, SlotsDao slotsDao, MailService mailService, NotesDao notesDao) {
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
        this.notesDao = notesDao;
        this.mailService = mailService;
    }

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Persons createPerson(Persons person) {
        personsDao.create(person);
        mailService.sendEmail(person.getEmail(), person.getId());
        return person;
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List fetchPersonsWithSlots(@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate) {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        List<Persons> persons = personsDao.findAll();
        persons.forEach(p -> p.setSlotsList(slotsDao.getForPersonForWeek(p.getId(), start, end)));

        return persons;
    }

    @GET
    @Path("/{personId}/getNote")
    @UnitOfWork
    public Notes getNote(@PathParam("personId") Long personId,
                         @QueryParam("date") String startDate) throws ParseException {
        Date date = formatter.parse(startDate);
        return notesDao.getByIdAndDate(personId,date);
    }

    @PUT
    @Path("/updateNote")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response createOrUpdate(Notes note){
        Date now = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(note.getDate());
        c.add(Calendar.DATE, 5); // Adding 5 days
        Date comparisonDate = new Date(c.getTimeInMillis());
        if (now.after(comparisonDate)) { // don't allow users to submit availabilities older than current week
            return Response.status(Response.Status.NOT_ACCEPTABLE).build();
        } else {
            notesDao.createOrUpdate(note);
            return Response.status(Response.Status.ACCEPTED).entity(note).build();
        }
    }

    @GET
    @Path("/{id}")
    @UnitOfWork
    public Persons getPersonById(@PathParam("id") Long id){
         return personsDao.getById(id);
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Persons updatePerson(Persons person) {
        personsDao.update(person);
        return person;
    }
}
