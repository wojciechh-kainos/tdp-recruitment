package resources;

import com.google.inject.Inject;
import dao.SlotsDao;
import domain.Pair;
import domain.Persons;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Path("/pairs")
@Produces(MediaType.APPLICATION_JSON)
public class PairResource {

    private final String AVAILABLE_TYPE = "available";
    private SlotsDao slotsDao;

    @Inject
    public PairResource(SlotsDao slotsDao) {
        this.slotsDao = slotsDao;
    }

    @GET
    @Path("/find")
    @UnitOfWork
    public List findPairs(@QueryParam("startDate") String startDate,
                          @QueryParam("endDate") String endDate,
                          @QueryParam("isDev") Boolean isDev,
                          @QueryParam("isTest") Boolean isTest,
                          @QueryParam("isOps") Boolean isOps) {

        List<Slots> slots = slotsDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps);
        List<Persons> persons = findPersonsInSlots(slots);
        List<Slots> filteredSlots = findTriplesInSlots(slots);

        return findPairsForAllPersons(filteredSlots, persons);
    }

    private List<Persons> findPersonsInSlots(List<Slots> slots) {
        return slots
                .stream()
                .map(Slots::getPerson)
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List<Slots> findTriplesInSlots(List<Slots> slots) {
        return streamSlotsForDate(slots)
                .flatMap(date -> {
                    List<Slots> slotsPerDate = slots
                            .stream()
                            .filter(slot -> slot.getSlotsDate().equals(date))
                            .collect(Collectors.toCollection(ArrayList::new));

                    return streamSlotsForPerson(slotsPerDate)
                            .flatMap(personId -> {
                                List<Slots> slotsPerDateForPerson = slotsPerDate
                                        .stream()
                                        .filter(slotPerDate -> slotPerDate.getPerson().getId().equals(personId)) //TODO: sorting
                                        .sorted((s1, s2) -> Long.compare(s1.getSlot().getId(), s2.getSlot().getId()))
                                        .collect(Collectors.toCollection(ArrayList::new));
                                List<Long> tripleIds = match(slotsPerDateForPerson
                                        .stream()
                                        .map(slot -> slot.getSlot().getId())
                                        .collect(Collectors.toCollection(ArrayList::new)));

                                return slotsPerDateForPerson
                                        .stream()
                                        .filter(slot -> tripleIds
                                                .stream()
                                                .anyMatch(id -> id.equals(slot.getSlot().getId())));
                            });
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private Stream<Long> streamSlotsForPerson(List<Slots> slots) {
        return slots.stream().map(slot -> slot.getPerson().getId()).distinct();
    }

    private Stream<java.sql.Date> streamSlotsForDate(List<Slots> slots) {
        return slots.stream().map(Slots::getSlotsDate).distinct();
    }

    private List<Long> match(List<Long> sortedList) {
        if (sortedList.size() < 3) {
            return new ArrayList<>();
        } else {
            return matchList(sortedList, 2, 1, 0, new ArrayList<>());
        }
    }

    private List<Long> matchList(List<Long> sortedList, int curr, int prev, int prevprev, List<Long> output) {
        if (curr < sortedList.size()) {
            if (sortedList.get(curr) - sortedList.get(prev) == 1 && sortedList.get(prev) - sortedList.get(prevprev) == 1) {
                output.add(sortedList.get(prevprev));
                output.add(sortedList.get(prev));
                output.add(sortedList.get(curr));
            }

            prevprev = prev;
            prev = curr;

            return matchList(sortedList, curr + 1, prev, prevprev, output);
        }

        return output
                .stream()
                .distinct()
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private static Predicate<Slots> predicateSlots(Persons person) {
        return slot -> slot.getPerson().equals(person);
    }

    private List<Slots> slotsByPerson(List<Slots> slots, Predicate<Slots> predicate) {
        return slots
                .stream()
                .filter(predicate)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private Stream<Pair> findAllPairsForPerson(List<Slots> slots, Persons person) {
        List<Slots> remainingSlots = slotsByPerson(slots, predicateSlots(person).negate());
        List<Slots> searchSlots = slotsByPerson(slots, predicateSlots(person));
        List<Slots> pairedSlots = remainingSlots
                .stream()
                .filter(rs -> searchSlots
                        .stream()
                        .filter(ss -> rs.getSlot().equals(ss.getSlot())
                                && rs.getSlotsDate().equals(ss.getSlotsDate())
                                && rs.getType().getType().equals(AVAILABLE_TYPE))
                        .collect(Collectors.toCollection(ArrayList::new))
                        .size() > 0)
                .collect(Collectors.toCollection(ArrayList::new));

        return pairedSlots
                .stream()
                .map(Slots::getPerson)
                .distinct()
                .map(foundPerson -> new Pair(person, foundPerson, slotsByPerson(pairedSlots, predicateSlots(foundPerson))));
    }

    private List<Slots> findSlotsForPersonsWithoutPairs(List<Slots> slots, List<Persons> persons) {
        return slots
                .stream()
                .filter(slot ->
                        persons
                                .stream()
                                .noneMatch(person -> person.getId().equals(slot.getPerson().getId()))
                )
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List findPairsForAllPersons(List<Slots> slots, List<Persons> persons) {
        List<Persons> prunedPersons = new ArrayList<>();

        return persons
                .stream()
                .flatMap(person -> {
                    Stream<Pair> pairs = findAllPairsForPerson(findSlotsForPersonsWithoutPairs(slots, prunedPersons), person);
                    prunedPersons.add(person);
                    return pairs;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
