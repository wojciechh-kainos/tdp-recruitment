package resources;

import com.google.inject.Inject;
import dao.NotesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Notes;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Path("/person")
@Produces(MediaType.APPLICATION_JSON)
public class PersonResources {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;
    private NotesDao notesDao;
    SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

    @Inject
    public PersonResources(PersonsDao personsDao, SlotsDao slotsDao, NotesDao notesDao){
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
        this.notesDao = notesDao;
    }

    @PUT
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Persons createPerson(Persons person) {
        personsDao.create(person);
        return person;
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List fetchPersonsWithSlots(@QueryParam("startDate")String startDate, @QueryParam("endDate")String endDate) {
        List<Persons> persons = personsDao.findAll();
        List<Slots> slots = slotsDao.findBetween(startDate, endDate);

        return persons
                .stream()
                .map(person -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("person", person);
                    item.put("slots", slots
                            .stream()
                            .filter(slot -> slot.getPerson().getId() == person.getId())
                            .map(slot -> {
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", slot.getId());
                                map.put("person", slot.getPerson().getId());
                                map.put("day", slot.getSlotsDate());
                                map.put("slot", slot.getSlot().getId());
                                map.put("type", slot.getType().getType());

                                return map;
                            })
                            .collect(Collectors.toCollection(ArrayList::new)));

                    return item;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @GET
    @Path("/getNote")
    @UnitOfWork
    public Notes getNote(@QueryParam("id") Long personId,
                         @QueryParam("date") String startDate) throws ParseException {
        Date date = formatter.parse(startDate);
        return notesDao.getByIdAndDate(personId,date);
    }

    @PUT
    @Path("/updateNote")
    @Consumes(MediaType.APPLICATION_JSON)
    @UnitOfWork
    public Long updateNote(Notes note){
        return notesDao.create(note);
    }
}
