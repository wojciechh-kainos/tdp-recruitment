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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import services.ActivationLink;
import services.MailService;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.mail.MessagingException;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
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
    private ActivationLink activationLink;
    private final TdpRecruitmentPasswordStore passwordStore;
    private SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);
    private static final Logger logger = LoggerFactory.getLogger(PersonResource.class);

    @Inject
    public PersonResource(PersonDao personDao, SlotDao slotDao, MailService mailService, NoteDao noteDao, TdpRecruitmentPasswordStore passwordStore, ActivationLink activationLink) {
        this.personDao = personDao;
        this.slotDao = slotDao;
        this.noteDao = noteDao;
        this.mailService = mailService;
        this.passwordStore = passwordStore;
        this.activationLink = activationLink;
    }

    @PUT
    @RolesAllowed("recruiter")
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Person createPerson(Person person) {
        if (personDao.findByEmail(person.getEmail()).isEmpty()) {
            String token = UUID.randomUUID().toString();
            person.setActivationCode(token);
            person.setActive(false);
            personDao.create(person);

            try {
                mailService.sendEmail(activationLink.createMessage(person));
            } catch (MessagingException | IOException e) {
                logger.warn("Mailing error  => {}", e.getMessage());
                throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR);
            }

            return person;
        } else {
            logger.warn("Person with email: {} already exists", person.getEmail());
            throw new WebApplicationException(Response.Status.CONFLICT);
        }
    }

    @GET
    @PermitAll
    @Path("/all")
    @UnitOfWork
    public List fetchPersonsWithSlots(@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate) throws ParseException {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        List<Person> persons = personDao.findAllActive();
        persons.forEach(p -> p.setSlotList(slotDao.getForPersonForWeek(p.getId(), start, end)));
        persons.forEach(p -> {
            Optional<Note> note = noteDao.getByPersonIdAndDate(p.getId(), start);

            if (note.isPresent()) {
                if (!note.get().getDescription().isEmpty()) {
                    p.setNoteList(Arrays.asList(note.get()));
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
    @PermitAll
    @Path("/{personId}/getNote")
    @UnitOfWork
    public Note getNote(@PathParam("personId") Long personId,
                        @QueryParam("date") String startDate) throws ParseException {
        Date date = formatter.parse(startDate);
        Optional<Note> note = noteDao.getByPersonIdAndDate(personId, date);

        return note.orElseThrow(() -> {
            logger.warn("Note not found with person id => {}", personId.toString());
            return new WebApplicationException(Response.Status.NO_CONTENT);
        });
    }

    @PUT
    @PermitAll
    @Path("/updateNote")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response createOrUpdate(Note note) {
        noteDao.createOrUpdate(note);
        return Response.status(Response.Status.ACCEPTED).entity(note).build();
    }

    @GET
    @PermitAll
    @Path("/{id}")
    @UnitOfWork
    public Person getPersonById(@PathParam("id") Long id) {
        Optional<Person> person = personDao.getById(id);
        return person.orElseThrow(() -> {
            logger.warn("Person with id => {} not found", id.toString());
            return new WebApplicationException(Response.Status.NOT_FOUND);
        });
    }

    @PUT
    @PermitAll
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Response updatePerson(Person newPerson) throws TdpRecruitmentPasswordStore.CannotPerformOperationException {
        Optional<Person> user = personDao.getById(newPerson.getId());
        if (!user.isPresent()) {
            logger.warn("Person with id => {} not found", newPerson.getId().toString());
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (!personDao.findByEmail(newPerson.getEmail()).isEmpty() && !newPerson.getEmail().equals(user.get().getEmail())) {
            logger.warn("Email => {}  is already in use", newPerson.getEmail());
            return Response.status(Response.Status.CONFLICT).build();
        }
        Person person = user.get();
        person.setAdmin(newPerson.getAdmin() || false);
        person.setFirstName(newPerson.getFirstName());
        person.setLastName(newPerson.getLastName());
        person.setEmail(newPerson.getEmail());
        person.setIsDev(newPerson.getIsDev());
        person.setIsOps(newPerson.getIsOps());
        person.setIsOther(newPerson.getIsOther());
        person.setIsTest(newPerson.getIsTest());
        person.setBandLevel(newPerson.getBandLevel());
        person.setDefaultStartHour(newPerson.getDefaultStartHour());
        person.setDefaultFinishHour(newPerson.getDefaultFinishHour());
        if (newPerson.getPassword() != null) {
            person.setPassword(passwordStore.createHash(newPerson.getPassword()));
        }

        return Response.ok(person).build();
    }

    @PUT
    @RolesAllowed("recruiter")
    @Path("/{id}/switchAccountStatus")
    @UnitOfWork
    public Response switchAccountStatus(@PathParam("id") Long id) {

        Optional<Person> person = personDao.getById(id);
        if (person.isPresent()) {
            person.get().setActive(!person.get().getActive());

            return Response.ok().build();
        } else {
            logger.warn("Person with id => {} not found", id.toString());
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
    }

    @GET
    @RolesAllowed("recruiter")
    @Path("/all/recruiter")
    @UnitOfWork
    public Response getRecruiters() {
        return Response.ok(personDao.findAllRecruiters()).build();
    }

    @PUT
    @RolesAllowed("recruiter")
    @Path("/{id}/resendActivationLink")
    @UnitOfWork
    public Response resendActivationLink(@PathParam("id") Long id) {

        Optional<Person> person = personDao.getById(id);
        if (person.isPresent()) {
            String token = UUID.randomUUID().toString();
            person.get().setActivationCode(token);
            try {
                mailService.sendEmail(activationLink.createMessage(person.get()));
            } catch (MessagingException | IOException e) {
                logger.warn("Mailing error  => {}", e.getMessage());
                throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR);
            }
            return Response.status(Response.Status.OK).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

}
