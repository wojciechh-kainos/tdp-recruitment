package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.validator.constraints.NotEmpty;
import org.jvnet.hk2.internal.Collector;

import services.MailService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/person")
@Produces(MediaType.APPLICATION_JSON)
public class PersonsResource {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;
    private MailService mailService;

    @Inject
    public PersonsResource(PersonsDao personsDao, SlotsDao slotsDao, MailService mailService) {
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
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
