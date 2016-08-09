package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import org.jvnet.hk2.internal.Collector;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
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
    public PersonResources(PersonsDao personsDao, SlotsDao slotsDao){
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List fetchPersonsWithSlots(@QueryParam("startDate")String startDate, @QueryParam("endDate")String endDate){
        List<Persons> persons = personsDao.findAll();
        List<Slots> slots = slotsDao.findBetween(startDate, endDate);

        return persons
                .stream()
                .map(person -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("person", person);
                    return item;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    @GET
    @Path("/all1")
    @UnitOfWork
    public List fetchAllPersons(){
        return personsDao.findAll();


    }
}
