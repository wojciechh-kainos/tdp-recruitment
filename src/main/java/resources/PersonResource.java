package resources;

import auth.TdpRecruitmentPasswordStore;
import com.google.inject.Inject;
import constants.TdpConstants;
import dao.NoteDao;
import dao.PersonDao;
import dao.SlotDao;
import domain.Note;
import domain.Person;
import io.dropwizard.hibernate.UnitOfWork;
import org.joda.time.DateTime;

import javax.annotation.security.RolesAllowed;
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
    private final TdpRecruitmentPasswordStore passwordStore;

    @Inject
    public PersonResource(PersonDao personDao, SlotDao slotDao, MailService mailService, NoteDao noteDao, TdpRecruitmentPasswordStore passwordStore) {
        this.personDao = personDao;
        this.slotDao = slotDao;
        this.noteDao = noteDao;
        this.mailService = mailService;
        this.passwordStore = passwordStore;
    }

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Person createPerson(Person person) {
        personDao.create(person);
        mailService.sendEmail(person.getEmail(), person.getId());
        return person;
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
            Note note = noteDao.getByPersonIdAndDate(p.getId(), start);
            if(note != null) {
                if(!note.getDescription().isEmpty()) {
                    p.setNoteList(Arrays.asList(note));
                }
            }
        });

        return persons;
    }

    @GET
    @RolesAllowed("recruiter")
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
        return noteDao.getByPersonIdAndDate(personId,date);
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
    public Response getPersonById(@PathParam("id") Long id){
        Person person = personDao.getById(id);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(person).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response updatePerson(Person newPerson) throws TdpRecruitmentPasswordStore.CannotPerformOperationException {
        Person person = personDao.getById(newPerson.getId());
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        person.setIsDev(newPerson.getIsDev());
        person.setIsOps(newPerson.getIsOps());
        person.setIsOther(newPerson.getIsOther());
        person.setIsTest(newPerson.getIsTest());
        person.setBandLevel(newPerson.getBandLevel());
        person.setDefaultStartHour(newPerson.getDefaultStartHour());
        person.setDefaultFinishHour(newPerson.getDefaultFinishHour());
        if(newPerson.getPassword()!=null){
            person.setPassword(passwordStore.createHash(person.getPassword()));
        }
        return Response.ok(person).build();
    }

    @PUT
    @Path("/{id}/switchAccountStatus")
    @UnitOfWork
    public Response switchAccountStatus(@PathParam("id") Long id) {

        Person person = personDao.getById(500L);
        if(person != null) {
        person.setActive(!person.getActive());

        return Response.ok().build();
        }
        else throw new WebApplicationException(Response.Status.BAD_REQUEST);
    }
}
