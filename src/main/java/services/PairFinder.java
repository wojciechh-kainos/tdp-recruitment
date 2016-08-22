package services;

import domain.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PairFinder {

    public List<Persons> findPairs(List<Slots> slots) {
        List<Persons> persons = findPersonsInSlots(slots);
        List<Pair> pairs = findPairsForAllPersons(slots, persons);
        List<Persons> pairsIntoPersons = mergePairsIntoPersons(pairs);
        List<Persons> groupedPersons = transformPairs(pairsIntoPersons);

        return filterTriples(groupedPersons);
    }

    private List<Persons> filterTriples(List<Persons> persons) {
        return persons
                .stream()
                .peek(person -> person.setSlotsList(findTriplesInSlots(person.getSlotsList())))
                .filter(person -> person.getSlotsList().size() > 0)
                .collect(Collectors.toCollection(ArrayList::new));
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
                                        .filter(slotPerDate -> slotPerDate.getPerson().getId().equals(personId))
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

    private Stream<Date> streamSlotsForDate(List<Slots> slots) {
        return slots.stream().map(Slots::getSlotsDate).distinct();
    }

    private Stream<Long> streamSlotsForPerson(List<Slots> slots) {
        return slots.stream().map(slot -> slot.getPerson().getId()).distinct();
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
            if (isSlotTimeJustAfterPrevious(sortedList, curr, prev) && isSlotTimeJustAfterPrevious(sortedList, prev, prevprev)) {
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

    private boolean isSlotTimeJustAfterPrevious(List<Long> sortedSlotsTimeIdList, int currentPosition, int previousPosition) {
        return sortedSlotsTimeIdList.get(currentPosition) - sortedSlotsTimeIdList.get(previousPosition) == 1;
    }

    private List<Pair> findPairsForAllPersons(List<Slots> slots, List<Persons> persons) {
        List<Persons> prunedPersons = new ArrayList<>();

        return persons
                .stream()
                .flatMap(person -> {
                    Stream<Pair> pairs = findAllPairsForPerson(withSlotsFromUnpairedPersons(slots, prunedPersons), person);
                    prunedPersons.add(person);
                    return pairs;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private Stream<Pair> findAllPairsForPerson(List<Slots> slots, Persons person) {
        List<Slots> remainingSlots = slotsByPerson(slots, predicateSlots(person).negate());
        List<Slots> searchSlots = slotsByPerson(slots, predicateSlots(person));

        List<Slots> pairedSlots = findPairsForPersonAndMerge(remainingSlots, searchSlots);


        return pairedSlots
                .stream()
                .map(Slots::getPerson)
                .filter(p -> !p.equals(person))
                .distinct()
                .map(foundPerson -> new Pair(
                        person,
                        foundPerson,
                        slotsByPerson(pairedSlots, predicateSlots(person)),
                        slotsByPerson(pairedSlots, predicateSlots(foundPerson))
                ));
    }

    private List<Slots> slotsByPerson(List<Slots> slots, Predicate<Slots> predicate) {
        return slots
                .stream()
                .filter(predicate)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private static Predicate<Slots> predicateSlots(Persons person) {
        return slot -> slot.getPerson().equals(person);
    }

    private List<Slots> withSlotsFromUnpairedPersons(List<Slots> slots, List<Persons> persons) {
        return slots
                .stream()
                .filter(slot ->
                        persons
                                .stream()
                                .noneMatch(person -> person.getId().equals(slot.getPerson().getId()))
                )
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List<Persons> mergePairsIntoPersons(List<Pair> pairs) {
        return pairs
                .stream()
                .flatMap(pair -> {
                    List<Persons> persons = new ArrayList<>();

                    Persons sp = pair.getSearchPerson().clone();
                    Persons mp = pair.getMatchPerson().clone();

                    sp.setSlotsList(pair.getSearchSlots());
                    mp.setSlotsList(pair.getMatchSlots());

                    persons.add(sp);
                    persons.add(mp);

                    return persons.stream();
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private List<Persons> transformPairs(List<Persons> pairedPersons) {
        List<Persons> persons = new ArrayList<>();

        pairedPersons
                .stream()
                .forEach(person -> {
                    if (persons.stream().anyMatch(p -> p.getId().equals(person.getId()))) {
                        Persons foundPerson = getPersonsListElement(persons, person.getId());
                        List<Slots> foundSlots = foundPerson.getSlotsList();
                        foundSlots.addAll(person.getSlotsList());

                        foundPerson
                                .setSlotsList(foundSlots
                                        .stream()
                                        .distinct()
                                        .collect(Collectors.toCollection(ArrayList::new)));
                    } else {
                        persons.add(person);
                    }
                });

        return persons;
    }

    private Persons getPersonsListElement(List<Persons> persons, Long personId) {
        return persons.stream().filter(person -> person.getId().equals(personId)).findFirst().get();
    }

    private List<Slots> findPairsForPersonAndMerge(List<Slots> remainingSlots, List<Slots> searchSlots) {
        List<Slots> pairedSlotsToPerson = findPairsInSlots(remainingSlots, searchSlots);
        List<Slots> searchPersonPairs = findPairsInSlots(searchSlots, remainingSlots);
        pairedSlotsToPerson.addAll(searchPersonPairs);

        return pairedSlotsToPerson;
    }

    private List<Slots> findPairsInSlots(List<Slots> remainingSlots, List<Slots> searchSlots) {
        List<Slots> foundSlots = new ArrayList<>();

        remainingSlots
                .stream()
                .forEach(rs -> searchSlots
                        .stream()
                        .forEach(ss -> {
                            if (rs.getSlot().getId() == ss.getSlot().getId()
                                    && rs.getSlotsDate().equals(ss.getSlotsDate())
                                    && (rs.getType().getType() == AvailabilityTypesEnum.available || rs.getType().getType() == AvailabilityTypesEnum.maybe)
                                    && (ss.getType().getType() == AvailabilityTypesEnum.available || ss.getType().getType() == AvailabilityTypesEnum.maybe)) {
                                foundSlots.add(rs);
                            }
                        })
                );

        return foundSlots;
    }
}
