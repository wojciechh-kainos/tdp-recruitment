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
    public PersonResources(PersonsDao personsDao, SlotsDao slotsDao) {
        this.personsDao = personsDao;
        this.slotsDao = slotsDao;
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
    public List fetchPersonsWithSlots(@QueryParam("startDate") String startDate, @QueryParam("endDate") String endDate) {
        Date start = DateTime.parse(startDate).toDate();
        Date end = DateTime.parse(endDate).toDate();

        List<Persons> persons = personsDao.findAll();
        persons.forEach(p -> p.setSlotsList(slotsDao.getForPersonForWeek(p.getId(), start, end)));

        return persons;
    }

}
