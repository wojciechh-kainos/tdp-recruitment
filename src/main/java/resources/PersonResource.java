package resources;

import com.google.inject.Inject;
import constants.TdpConstants;
import dao.NoteDao;
import dao.PersonDao;
import dao.SlotDao;
import domain.Note;
import domain.Person;
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
public class PersonResource {

    private PersonDao personDao;
    private SlotDao slotDao;
    private NoteDao noteDao;
    private MailService mailService;
    SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

    @Inject
    public PersonResource(PersonDao personDao, SlotDao slotDao, MailService mailService, NoteDao noteDao) {
        this.personDao = personDao;
        this.slotDao = slotDao;
        this.noteDao = noteDao;
        this.mailService = mailService;
    }

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Person createPerson(Person person) {

        if (personDao.findByEmail(person.getEmail()).isEmpty()) {

            personDao.create(person);
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

        List<Person> persons = personDao.findAllActive();
        persons.forEach(p -> p.setSlotList(slotDao.getForPersonForWeek(p.getId(), start, end)));
        persons.forEach(p -> {
            Optional<Note> note = noteDao.getByPersonIdAndDate(p.getId(), start);

            if(note.isPresent()) {
                if(!note.get().getDescription().isEmpty()) {
                    p.setNoteList(Arrays.asList(note.get()));
                }
            }
        });

        return persons;
    }

    @GET
    @Path("/all/withoutSlots")
    @UnitOfWork
    public List fetchPersonsWithoutSlots() {
        return personDao.findAll();
    }

    @GET
    @Path("/{personId}/getNote")
    @UnitOfWork
    public Note getNote(@PathParam("personId") Long personId,
                        @QueryParam("date") String startDate) throws ParseException {
        Date date = formatter.parse(startDate);
        Optional<Note> note = noteDao.getByPersonIdAndDate(personId,date);

        return note.orElseThrow(() -> new WebApplicationException(Response.Status.NO_CONTENT));
    }

    @PUT
    @Path("/updateNote")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response createOrUpdate(Note note){
        noteDao.createOrUpdate(note);
        return Response.status(Response.Status.ACCEPTED).entity(note).build();
    }

    @GET
    @Path("/{id}")
    @UnitOfWork
    public Person getPersonById(@PathParam("id") Long id){
        Optional<Person> person = personDao.getById(id);

        return person.orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Person updatePerson(Person person) {
        personDao.update(person);
        return person;
    }

    @GET
    @Path("/all/recruiter")
    @UnitOfWork
    public Response getRecruiters() {
        List<Person> recruiterList = new ArrayList<>();

        for (Person person : personDao.findAll()) {
            if (person.getAdmin() != null && person.getAdmin()) {
                recruiterList.add(person);
            }
        }

        return Response.ok(recruiterList).build();
    }

}
