package resources;

import com.google.inject.Inject;
import constants.TdpConstants;
import dao.NotesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Notes;
import domain.Persons;
import io.dropwizard.hibernate.UnitOfWork;
import org.joda.time.DateTime;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import services.MailService;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Path("/person")
@Produces(MediaType.APPLICATION_JSON)
public class PersonsResource {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;
    private NotesDao notesDao;
    private MailService mailService;
    SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

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

        if (personsDao.findByEmail(person.getEmail()).isEmpty()) {

            personsDao.create(person);
            mailService.sendEmail(person.getEmail(), person.getId());

            return person;

        } else {
            throw new WebApplicationException(Response.Status.CONFLICT);
        }
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List fetchPersonsWithSlots(@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate) throws ParseException {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        List<Persons> persons = personsDao.findAll();
        persons.forEach(p -> p.setSlotsList(slotsDao.getForPersonForWeek(p.getId(), start, end)));
        persons.forEach(p -> {
            Notes note = notesDao.getByPersonIdAndDate(p.getId(), start);
            if (note != null) {
                if (!note.getDescription().isEmpty()) {
                    p.setNotesList(Arrays.asList(note));
                }
            }
        });

        return persons;
    }

    @GET
    @Path("/{personId}/getNote")
    @UnitOfWork
    public Notes getNote(@PathParam("personId") Long personId,
                         @QueryParam("date") String startDate) throws ParseException {
        Date date = formatter.parse(startDate);
        return notesDao.getByPersonIdAndDate(personId, date);
    }

    @PUT
    @Path("/updateNote")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response createOrUpdate(Notes note){
        notesDao.createOrUpdate(note);
        return Response.status(Response.Status.ACCEPTED).entity(note).build();
    }

    @GET
    @Path("/{id}")
    @UnitOfWork
    public Response getPersonById(@PathParam("id") Long id) {
        Persons person = personsDao.getById(id);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(person).build();
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
