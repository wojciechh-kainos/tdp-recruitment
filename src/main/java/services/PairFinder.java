package services;


import domain.AvailabilityTypeEnum;
import domain.Pair;
import domain.Person;
import domain.Slot;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PairFinder {

    public List<Person> findPairs(List<Slot> slots) {
        List<Person> persons = findPersonsInSlots(slots);
        List<Pair> pairs = findPairsForAllPersons(slots, persons);
        List<Person> pairsIntoPersons = mergePairsIntoPersons(pairs);
        List<Person> groupedPersons = transformPairs(pairsIntoPersons);

        return filterTriples(groupedPersons);
    }

    private List<Person> filterTriples(List<Person> persons) {
        return persons
                .stream()
                .peek(person -> person.setSlotList(findTriplesInSlots(person.getSlotList())))
                .filter(person -> person.getSlotList().size() > 0)
                .collect(Collectors.toList());
    }

    private List<Person> findPersonsInSlots(List<Slot> slots) {
        return slots
                .stream()
                .map(Slot::getPerson)
                .distinct()
                .collect(Collectors.toList());
    }

    private List<Slot> findTriplesInSlots(List<Slot> slots) {
        return streamSlotsForDate(slots)
                .flatMap(date -> {
                    List<Slot> slotsPerDate = slots
                            .stream()
                            .filter(slot -> slot.getSlotDate().equals(date))
                            .collect(Collectors.toList());

                    return streamSlotsForPerson(slotsPerDate)
                            .flatMap(personId -> {
                                List<Slot> slotsPerDateForPerson = slotsPerDate
                                        .stream()
                                        .filter(slotPerDate -> slotPerDate.getPerson().getId().equals(personId))
                                        .sorted((s1, s2) -> Long.compare(s1.getSlotTime().getId(), s2.getSlotTime().getId()))
                                        .collect(Collectors.toList());
                                List<Long> tripleIds = match(slotsPerDateForPerson
                                        .stream()
                                        .map(slot -> slot.getSlotTime().getId())
                                        .collect(Collectors.toList()));

                                return slotsPerDateForPerson
                                        .stream()
                                        .filter(slot -> tripleIds
                                                .stream()
                                                .anyMatch(id -> id.equals(slot.getSlotTime().getId())));
                            });
                })
                .collect(Collectors.toList());
    }

    private Stream<Date> streamSlotsForDate(List<Slot> slots) {
        return slots.stream().map(Slot::getSlotDate).distinct();
    }

    private Stream<Long> streamSlotsForPerson(List<Slot> slots) {
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
                .collect(Collectors.toList());
    }

    private boolean isSlotTimeJustAfterPrevious(List<Long> sortedSlotsTimeIdList, int currentPosition, int previousPosition) {
        return sortedSlotsTimeIdList.get(currentPosition) - sortedSlotsTimeIdList.get(previousPosition) == 1;
    }

    private List<Pair> findPairsForAllPersons(List<Slot> slots, List<Person> persons) {
        List<Person> prunedPersons = new ArrayList<>();

        return persons
                .stream()
                .flatMap(person -> {
                    Stream<Pair> pairs = findAllPairsForPerson(withSlotsFromUnpairedPersons(slots, prunedPersons), person);
                    prunedPersons.add(person);
                    return pairs;
                })
                .collect(Collectors.toList());
    }

    private Stream<Pair> findAllPairsForPerson(List<Slot> slots, Person person) {
        List<Slot> remainingSlots = slotsByPerson(slots, predicateSlots(person).negate());
        List<Slot> searchSlots = slotsByPerson(slots, predicateSlots(person));

        List<Slot> pairedSlots = findPairsForPersonAndMerge(remainingSlots, searchSlots);


        return pairedSlots
                .stream()
                .map(Slot::getPerson)
                .filter(p -> !p.equals(person))
                .distinct()
                .map(foundPerson -> new Pair(
                        person,
                        foundPerson,
                        slotsByPerson(pairedSlots, predicateSlots(person)),
                        slotsByPerson(pairedSlots, predicateSlots(foundPerson))
                ));
    }

    private List<Slot> slotsByPerson(List<Slot> slots, Predicate<Slot> predicate) {
        return slots
                .stream()
                .filter(predicate)
                .collect(Collectors.toList());
    }

    private static Predicate<Slot> predicateSlots(Person person) {
        return slot -> slot.getPerson().equals(person);
    }

    private List<Slot> withSlotsFromUnpairedPersons(List<Slot> slots, List<Person> persons) {
        return slots
                .stream()
                .filter(slot ->
                        persons
                                .stream()
                                .noneMatch(person -> person.getId().equals(slot.getPerson().getId()))
                )
                .collect(Collectors.toList());
    }

    private List<Person> mergePairsIntoPersons(List<Pair> pairs) {
        return pairs
                .stream()
                .flatMap(pair -> {
                    List<Person> persons = new ArrayList<>();

                    Person sp = pair.getSearchPerson().clone();
                    Person mp = pair.getMatchPerson().clone();

                    sp.setSlotList(pair.getSearchSlots());
                    mp.setSlotList(pair.getMatchSlots());

                    persons.add(sp);
                    persons.add(mp);

                    return persons.stream();
                })
                .collect(Collectors.toList());
    }

    private List<Person> transformPairs(List<Person> pairedPersons) {
        List<Person> persons = new ArrayList<>();

        pairedPersons
                .stream()
                .forEach(person -> {
                    if (persons.stream().anyMatch(p -> p.getId().equals(person.getId()))) {
                        Person foundPerson = getPersonsListElement(persons, person.getId());
                        List<Slot> foundSlots = foundPerson.getSlotList();
                        foundSlots.addAll(person.getSlotList());

                        foundPerson
                                .setSlotList(foundSlots
                                        .stream()
                                        .distinct()
                                        .collect(Collectors.toList()));
                    } else {
                        persons.add(person);
                    }
                });

        return persons;
    }

    private Person getPersonsListElement(List<Person> persons, Long personId) {
        return persons.stream().filter(person -> person.getId().equals(personId)).findFirst().get();
    }

    private List<Slot> findPairsForPersonAndMerge(List<Slot> remainingSlots, List<Slot> searchSlots) {
        List<Slot> pairedSlotsToPerson = findPairsInSlots(remainingSlots, searchSlots);
        List<Slot> searchPersonPairs = findPairsInSlots(searchSlots, remainingSlots);
        pairedSlotsToPerson.addAll(searchPersonPairs);

        return pairedSlotsToPerson;
    }

    private List<Slot> findPairsInSlots(List<Slot> remainingSlots, List<Slot> searchSlots) {
        List<Slot> foundSlots = new ArrayList<>();

        remainingSlots
                .stream()
                .forEach(remainingSlot -> searchSlots
                        .stream()
                        .forEach(searchSlot -> {
                            if (remainingSlot.getSlotTime().getId() == searchSlot.getSlotTime().getId()
                                    && remainingSlot.getSlotDate().equals(searchSlot.getSlotDate())
                                    && (remainingSlot.getType().getName() == AvailabilityTypeEnum.available || remainingSlot.getType().getName() == AvailabilityTypeEnum.maybe)
                                    && (searchSlot.getType().getName() == AvailabilityTypeEnum.available || searchSlot.getType().getName() == AvailabilityTypeEnum.maybe)) {
                                foundSlots.add(remainingSlot);
                            }
                        })
                );

        return foundSlots;
    }
}
