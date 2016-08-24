package resourceTests.PairResourceTests;

import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsWithDifferentAvailabilityTest {

    private final Date sameDate = MockDataUtil.today;
    private final AvailabilityType typeAvailable = MockDataUtil.available;
    private final AvailabilityType typeUnavailable = MockDataUtil.unavailable;
    private final AvailabilityType typeMaybe = MockDataUtil.maybe;

    private List<Slot> mockSlots = new ArrayList<>();
    private List<Person> persons;

    @Before
    public void setUp() {
        mockSlots.addAll(createFirstPerson());
        mockSlots.addAll(createSecondPerson());
        mockSlots.addAll(createThirdPerson());

        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindTwoPersons() {
        assertEquals("There should be only two persons found", 2, persons.size());
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindSecondAndThirdPerson() {
        List<Long> personIds = Arrays.asList(2L, 3L);

        assertTrue("There should be only person with id=2 and id=3",
                persons
                        .stream()
                        .map(Person::getId)
                        .allMatch(personIds::contains));
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindSlotsTimesIdBetween9And13() {
        List<Long> slotsTimesIds = Arrays.asList(9L, 10L, 11L, 12L, 13L);

        assertTrue("There should be only SlotTimes with ids between 9 and 13",
                persons
                        .stream()
                        .map(person -> person.getSlotList()
                                .stream()
                                .map(slot -> slot.getSlotTime().getId())
                                .allMatch(slotsTimesIds::contains))
                        .allMatch(isTrue -> isTrue));
    }

    private List<Slot> createFirstPerson() {
        List<SlotTime> slotsTimes = MockDataUtil.createSlotsTimesList(2, 11);
        Person person = MockDataUtil.createPerson(1L);

        return MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeUnavailable);
    }

    private List<Slot> createSecondPerson(){
        List<SlotTime> slotsTimes = MockDataUtil.createSlotsTimesList(1, 18);
        Person person = MockDataUtil.createPerson(2L);

        List<Slot> slots = MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
        slots.get(1).setType(typeUnavailable);
        slots.get(2).setType(typeMaybe);
        slots.get(3).setType(typeMaybe);
        slots.get(4).setType(typeMaybe);
        slots.get(5).setType(typeMaybe);
        slots.get(6).setType(typeMaybe);
        slots.get(7).setType(typeUnavailable);
        slots.get(13).setType(typeUnavailable);
        slots.get(14).setType(typeUnavailable);
        slots.get(15).setType(typeUnavailable);
        slots.get(16).setType(typeMaybe);
        slots.get(17).setType(typeMaybe);

        return slots;
    }

    private List<Slot> createThirdPerson() {
        List<SlotTime> slotsTimes = MockDataUtil.createSlotsTimesList(7, 18);
        Person person = MockDataUtil.createPerson(3L);

        List<Slot> slots = MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
        slots.get(7).setType(typeMaybe);
        slots.get(8).setType(typeMaybe);
        slots.get(9).setType(typeMaybe);
        slots.get(10).setType(typeMaybe);
        slots.get(11).setType(typeMaybe);

        return slots;
    }
}
