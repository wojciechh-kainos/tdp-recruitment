package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.validator.constraints.NotEmpty;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Path("/person")
@Produces(MediaType.APPLICATION_JSON)
public class PersonResources {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;

    @Inject
    public PersonResources(PersonsDao personsDao, SlotsDao slotsDao) {
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @UnitOfWork
    public Response createPerson(@FormParam("email") @NotEmpty String email,
                                 @FormParam("firstname") @NotEmpty String firstName,
                                 @FormParam("lastname") @NotEmpty String lastName,
                                 @FormParam("isdev") Boolean isDev,
                                 @FormParam("istest") Boolean isTest,
                                 @FormParam("isweb") Boolean isWeb,
                                 @FormParam("bandlevel") Integer bandLevel) {
        Persons person = new Persons(email, firstName, lastName, isDev, isTest, isWeb, bandLevel);
        personsDao.create(person);
        return Response.status(Response.Status.CREATED).build();
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
}
