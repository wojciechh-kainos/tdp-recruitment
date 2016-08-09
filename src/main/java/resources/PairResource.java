package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Path("/pairs")
@Produces(MediaType.APPLICATION_JSON)
public class PairResource {

    private SlotsDao slotsDao;

    @Inject
    public PairResource(SlotsDao slotsDao){
        this.slotsDao = slotsDao;
    }

    @GET
    @Path("/find")
    @UnitOfWork
    public List findPairs(@QueryParam("startDate")String startDate,
                          @QueryParam("endDate")String endDate,
                          @QueryParam("isDev")Boolean isDev,
                          @QueryParam("isTest")Boolean isTest,
                          @QueryParam("isOps")Boolean isOps){

        List<Slots> slots = slotsDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps);
        List<Persons> persons = personsInSlots(slots);

        return findPairsForPerson(slots, persons.get(0));
    }

    private static Predicate<Slots> predicateSlots(Persons person){
        return slot -> slot.getPerson().equals(person);
    }

    private List<Persons> personsInSlots(List<Slots> slots){
        return slots
                .stream()
                .map(Slots::getPerson)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List<Slots> slotsByPerson(List<Slots> slots, Predicate<Slots> predicate){
        return slots
                .stream()
                .filter(predicate)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List findPairsForPerson(List<Slots> slots, Persons person){
        List<Slots> remainingSlots = slotsByPerson(slots, predicateSlots(person).negate());
        List<Slots> searchSlots = slotsByPerson(slots, predicateSlots(person));

        return remainingSlots
                .stream()
                .filter(rs -> searchSlots
                            .stream()
                            .filter(ss -> rs.getSlot().equals(ss.getSlot()) && rs.getSlotsDate().equals(ss.getSlotsDate()))
                            .collect(Collectors.toCollection(ArrayList::new))
                            .size() > 0)
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();

                    map.put("searchPersonId", person.getId());
                    map.put("matchPersonId", item.getPerson().getId());
                    map.put("slotId", item.getSlot().getId());
                    map.put("slotDate", item.getSlotsDate());

                    return map;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

}
